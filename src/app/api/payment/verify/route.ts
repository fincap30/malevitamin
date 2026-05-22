import { NextRequest, NextResponse } from "next/server";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

/**
 * POST /api/payment/verify
 *
 * Verifies a Flutterwave transaction server-side and calculates the split breakdown.
 * This prevents tampering with payment results on the client side.
 *
 * After successful verification, triggers notifications:
 * - WhatsApp message to customer (if phone provided)
 * - Email confirmation to customer
 * - Internal logging of split breakdown
 *
 * Request body:
 *   { transactionId: number, txRef: string, customerPhone?: string }
 *
 * Response:
 *   { verified: boolean, data?: object, splitBreakdown?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, txRef, customerPhone } = body;

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

      const splitBreakdown = calculateSplitBreakdown(850);

      // Still trigger notifications in demo mode (for testing)
      await triggerNotifications({
        customerName: "Demo Customer",
        customerEmail: "demo@test.com",
        customerPhone: customerPhone || undefined,
        amount: 850,
        currency: "ZAR",
        txRef,
        transactionId,
        splitBreakdown,
      });

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
        splitBreakdown,
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

      // Trigger notifications (WhatsApp + email)
      await triggerNotifications({
        customerName: verifyData.data.customer?.name || "Customer",
        customerEmail: verifyData.data.customer?.email || "",
        customerPhone:
          customerPhone || verifyData.data.customer?.phone_number || undefined,
        amount,
        currency,
        txRef,
        transactionId,
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
 * Trigger all notifications after a verified payment.
 * - WhatsApp to customer
 * - Email to customer
 * - Internal logging
 */
async function triggerNotifications(details: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  currency: string;
  txRef: string;
  transactionId: number;
  splitBreakdown: ReturnType<typeof calculateSplitBreakdown>;
}): Promise<void> {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Our Store";

  // 1. Send WhatsApp notification to customer
  if (details.customerPhone) {
    try {
      const whatsappMessage = buildWhatsAppMessage({
        customerName: details.customerName,
        amount: details.amount,
        currency: details.currency,
        businessName,
        txRef: details.txRef,
      });

      await fetch(`${getBaseUrl()}/api/payment/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          phone: details.customerPhone,
          message: whatsappMessage,
          customerName: details.customerName,
          amount: details.amount,
          currency: details.currency,
          txRef: details.txRef,
          transactionId: details.transactionId,
        }),
      });

      console.log("[Payment] WhatsApp notification sent to", details.customerPhone);
    } catch (error) {
      console.error("[Payment] WhatsApp notification failed:", error);
      // Don't fail the whole flow if notification fails
    }
  }

  // 2. Send email confirmation (placeholder — integrate with your email service)
  if (details.customerEmail) {
    try {
      await fetch(`${getBaseUrl()}/api/payment/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email",
          email: details.customerEmail,
          customerName: details.customerName,
          amount: details.amount,
          currency: details.currency,
          businessName,
          txRef: details.txRef,
        }),
      });

      console.log("[Payment] Email notification sent to", details.customerEmail);
    } catch (error) {
      console.error("[Payment] Email notification failed:", error);
    }
  }

  // 3. Log the full split breakdown
  console.log("[Payment] Split breakdown:", {
    totalAmount: details.splitBreakdown.totalAmount,
    flutterwaveFee: details.splitBreakdown.flutterwaveFee,
    settlementAmount: details.splitBreakdown.settlementAmount,
    splits: details.splitBreakdown.splits,
  });
}

/**
 * Build the WhatsApp message for customer confirmation.
 */
function buildWhatsAppMessage(params: {
  customerName: string;
  amount: number;
  currency: string;
  businessName: string;
  txRef: string;
}): string {
  const currencySymbol = params.currency === "ZAR" ? "R" : params.currency;
  return [
    `✅ *${params.businessName} - Payment Confirmed!*`,
    ``,
    `Hi ${params.customerName},`,
    ``,
    `Your payment of *${currencySymbol} ${params.amount.toFixed(2)}* has been received and confirmed.`,
    ``,
    `📦 Your product will be sent to you shortly. You will be informed with tracking details once it ships.`,
    ``,
    `Reference: ${params.txRef}`,
    ``,
    `Thank you for your order!`,
    ``,
    `— ${params.businessName}`,
  ].join("\n");
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
      label: process.env.SPLIT_OWNER_LABEL || "Owner",
      percentage: ownerPct,
      amount: settlementAmount * (ownerPct / 100),
    });
  }

  // Partner 1
  const partnerPct = Number(process.env.SPLIT_PARTNER_PERCENTAGE || 0);
  if (partnerPct > 0) {
    recipients.push({
      label: process.env.SPLIT_PARTNER_LABEL || "Partner",
      percentage: partnerPct,
      amount: settlementAmount * (partnerPct / 100),
    });
  }

  // Partner 2 (optional)
  const partner2Pct = Number(process.env.SPLIT_PARTNER_2_PERCENTAGE || 0);
  if (partner2Pct > 0) {
    recipients.push({
      label: process.env.SPLIT_PARTNER_2_LABEL || "Partner 2",
      percentage: partner2Pct,
      amount: settlementAmount * (partner2Pct / 100),
    });
  }

  // Partner 3 (optional)
  const partner3Pct = Number(process.env.SPLIT_PARTNER_3_PERCENTAGE || 0);
  if (partner3Pct > 0) {
    recipients.push({
      label: process.env.SPLIT_PARTNER_3_LABEL || "Partner 3",
      percentage: partner3Pct,
      amount: settlementAmount * (partner3Pct / 100),
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

/**
 * Get the base URL for internal API calls.
 */
function getBaseUrl(): string {
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}
