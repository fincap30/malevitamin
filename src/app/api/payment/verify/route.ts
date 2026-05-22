import { NextRequest, NextResponse } from "next/server";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

/**
 * POST /api/payment/verify
 *
 * Verifies a Flutterwave transaction server-side and calculates the split breakdown.
 * This prevents tampering with payment results on the client side.
 *
 * Request body:
 *   { transactionId: number, txRef: string }
 *
 * Response:
 *   { verified: boolean, data?: object, splitBreakdown?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const { transactionId, txRef } = await request.json();

    if (!transactionId || !txRef) {
      return NextResponse.json(
        { verified: false, error: "Missing transactionId or txRef" },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    // Demo mode — return simulated success
    if (
      !secretKey ||
      secretKey === "FLWSECK_TEST-your-secret-key-here" ||
      secretKey.includes("xxxxx")
    ) {
      console.log("[Payment Verify] Demo mode — simulating success");
      return NextResponse.json({
        verified: true,
        data: {
          id: transactionId,
          tx_ref: txRef,
          amount: 850,
          currency: "ZAR",
          status: "successful",
          payment_type: "demo",
        },
        splitBreakdown: calculateSplitBreakdown(850),
        demo: true,
      });
    }

    // Real verification with Flutterwave
    const verifyResponse = await fetch(
      `${FLUTTERWAVE_VERIFY_URL}/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (
      verifyData.status === "success" &&
      verifyData.data.status === "successful"
    ) {
      const amount = verifyData.data.amount;
      const currency = verifyData.data.currency;
      const splitBreakdown = calculateSplitBreakdown(amount);

      // Log the split for your records
      console.log("[Payment Verified]", {
        txRef,
        transactionId,
        amount,
        currency,
        paymentType: verifyData.data.payment_type,
        splitBreakdown,
      });

      return NextResponse.json({
        verified: true,
        data: verifyData.data,
        splitBreakdown,
      });
    }

    return NextResponse.json({
      verified: false,
      error: "Transaction not successful",
      data: verifyData.data,
    });
  } catch (error) {
    console.error("[Payment Verify Error]", error);
    return NextResponse.json(
      { verified: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}

/**
 * Calculate the split breakdown for a given amount.
 * Matches the client-side calculation in lib/flutterwave.ts
 */
function calculateSplitBreakdown(totalAmount: number) {
  // Flutterwave SA fee estimate: 2.9% + R1 for local cards
  const flutterwaveFee = totalAmount * 0.029 + 1;
  const settlementAmount = totalAmount - flutterwaveFee;

  const recipients: { label: string; percentage: number; amount: number }[] =
    [];

  // Owner
  const ownerPct = Number(process.env.SPLIT_OWNER_PERCENTAGE || 0);
  if (ownerPct > 0) {
    recipients.push({
      label: "Owner",
      percentage: ownerPct,
      amount: settlementAmount * (ownerPct / 100),
    });
  }

  // Partner 1
  const partnerPct = Number(process.env.SPLIT_PARTNER_PERCENTAGE || 0);
  if (partnerPct > 0) {
    recipients.push({
      label: "Partner",
      percentage: partnerPct,
      amount: settlementAmount * (partnerPct / 100),
    });
  }

  // Partner 2 (optional)
  const partner2Pct = Number(process.env.SPLIT_PARTNER_2_PERCENTAGE || 0);
  if (partner2Pct > 0) {
    recipients.push({
      label: "Partner 2",
      percentage: partner2Pct,
      amount: settlementAmount * (partner2Pct / 100),
    });
  }

  return {
    totalAmount,
    flutterwaveFee: Math.round(flutterwaveFee * 100) / 100,
    settlementAmount: Math.round(settlementAmount * 100) / 100,
    splits: recipients.map((r) => ({
      ...r,
      amount: Math.round(r.amount * 100) / 100,
    })),
  };
}
