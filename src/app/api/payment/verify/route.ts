import { NextRequest, NextResponse } from "next/server";

// Flutterwave Payment Verification Endpoint
// Docs: https://developer.flutterwave.com/docs/integration-guides/verify-transactions

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, txRef } = body;

    if (!transactionId || !txRef) {
      return NextResponse.json(
        { verified: false, error: "Missing transaction ID or reference" },
        { status: 400 }
      );
    }

    // If no secret key configured, return demo response
    if (
      !FLUTTERWAVE_SECRET_KEY ||
      FLUTTERWAVE_SECRET_KEY === "FLWSECK_TEST-your-secret-key-here"
    ) {
      console.log(
        `[DEMO MODE] Payment verification for tx: ${transactionId}, ref: ${txRef}`
      );
      return NextResponse.json({
        verified: true,
        demo: true,
        message:
          "Demo mode — payment simulated. Configure FLUTTERWAVE_SECRET_KEY for real verification.",
        data: {
          id: transactionId,
          tx_ref: txRef,
          amount: 850,
          currency: "ZAR",
          status: "successful",
        },
      });
    }

    // Verify transaction with Flutterwave API
    const response = await fetch(
      `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (
      result.status === "success" &&
      result.data?.status === "successful" &&
      result.data?.tx_ref === txRef &&
      result.data?.currency === "ZAR" &&
      result.data?.amount >= 850
    ) {
      // Payment verified!
      // In production you would:
      // 1. Save the order to your database
      // 2. Send confirmation email/SMS
      // 3. Trigger fulfillment/shipping

      return NextResponse.json({
        verified: true,
        data: {
          id: result.data.id,
          tx_ref: result.data.tx_ref,
          flw_ref: result.data.flw_ref,
          amount: result.data.amount,
          currency: result.data.currency,
          status: result.data.status,
          payment_type: result.data.payment_type,
          customer: result.data.customer,
        },
      });
    }

    return NextResponse.json(
      {
        verified: false,
        error: "Payment verification failed",
        details: result.data?.processor_response || "Transaction not confirmed",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { verified: false, error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}
