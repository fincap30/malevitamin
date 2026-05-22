import { NextRequest, NextResponse } from "next/server";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

/**
 * POST /api/payment/verify
 *
 * Verifies a Flutterwave transaction server-side and calculates the split breakdown.
 * After successful verification, triggers notifications:
 * - WhatsApp to customer: "Payment confirmed, product will be sent"
 * - WhatsApp to JVL: Order details + delivery address + split breakdown
 * - Email to customer: Payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionId,
      txRef,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      deliveryOption,
    } = body;

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

      const splitBreakdown = calculateSplitBreakdown(
        850,
        deliveryOption || "normal"
      );

      // Trigger all notifications (customer + JVL)
      await triggerNotifications({
        customerName: customerName || "Demo Customer",
        customerEmail: customerEmail || "demo@test.com",
        customerPhone: customerPhone || undefined,
        customerAddress: customerAddress || "123 Demo Street, Pretoria",
        deliveryOption: deliveryOption || "normal",
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
      const splitBreakdown = calculateSplitBreakdown(
        amount,
        deliveryOption || "normal"
      );

      console.log("[Payment Verified]", {
        txRef,
        transactionId,
        amount,
        currency,
        paymentType: verifyData.data.payment_type,
        splitBreakdown,
      });

      // Trigger all notifications (customer + JVL)
      await triggerNotifications({
        customerName:
          customerName || verifyData.data.customer?.name || "Customer",
        customerEmail:
          customerEmail || verifyData.data.customer?.email || "",
        customerPhone:
          customerPhone ||
          verifyData.data.customer?.phone_number ||
          undefined,
        customerAddress: customerAddress || "Address not provided",
        deliveryOption: deliveryOption || "normal",
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
 * 1. WhatsApp to customer: Payment confirmed + product will be sent
 * 2. WhatsApp to JVL: Full order details + delivery address + split
 * 3. Email to customer: Payment confirmation
 */
async function triggerNotifications(details: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  deliveryOption: string;
  amount: number;
  currency: string;
  txRef: string;
  transactionId: number;
  splitBreakdown: ReturnType<typeof calculateSplitBreakdown>;
}): Promise<void> {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Our Store";
  const baseUrl = getBaseUrl();
  const currencySymbol = details.currency === "ZAR" ? "R" : details.currency;

  // 1. WhatsApp to CUSTOMER
  if (details.customerPhone) {
    try {
      const customerMessage = buildCustomerWhatsAppMessage({
        customerName: details.customerName,
        amount: details.amount,
        currencySymbol,
        deliveryOption: details.deliveryOption,
        deliveryFee: details.splitBreakdown.deliveryFee,
        txRef: details.txRef,
        address: details.customerAddress,
      });

      await fetch(`${baseUrl}/api/payment/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          phone: details.customerPhone,
          message: customerMessage,
        }),
      });

      console.log(
        "[Payment] Customer WhatsApp sent to",
        details.customerPhone
      );
    } catch (error) {
      console.error("[Payment] Customer WhatsApp failed:", error);
    }
  }

  // 2. WhatsApp to JVL — Order details with delivery address
  const jvlPhone = process.env.JVL_NOTIFICATION_PHONE;
  if (jvlPhone) {
    try {
      const jvlMessage = buildJVLWhatsAppMessage({
        customerName: details.customerName,
        customerPhone: details.customerPhone || "Not provided",
        amount: details.amount,
        currencySymbol,
        deliveryOption: details.deliveryOption,
        deliveryFee: details.splitBreakdown.deliveryFee,
        address: details.customerAddress,
        txRef: details.txRef,
        productName: businessName,
        jvlShare: details.splitBreakdown.partnerNetShare,
        ownerShare: details.splitBreakdown.ownerShare,
        flutterwaveFee: details.splitBreakdown.flutterwaveFee,
      });

      await fetch(`${baseUrl}/api/payment/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          phone: jvlPhone,
          message: jvlMessage,
        }),
      });

      console.log("[Payment] JVL WhatsApp sent to", jvlPhone);
    } catch (error) {
      console.error("[Payment] JVL WhatsApp failed:", error);
    }
  }

  // 3. Email to customer
  if (details.customerEmail) {
    try {
      await fetch(`${baseUrl}/api/payment/notify`, {
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

      console.log(
        "[Payment] Email sent to",
        details.customerEmail
      );
    } catch (error) {
      console.error("[Payment] Email failed:", error);
    }
  }

  // 4. Log the full split breakdown
  console.log("[Payment] Split breakdown:", {
    totalAmount: details.splitBreakdown.totalAmount,
    flutterwaveFee: details.splitBreakdown.flutterwaveFee,
    ownerShare: details.splitBreakdown.ownerShare,
    partnerGrossShare: details.splitBreakdown.partnerGrossShare,
    deliveryFee: details.splitBreakdown.deliveryFee,
    partnerNetShare: details.splitBreakdown.partnerNetShare,
  });
}

/**
 * Build WhatsApp message for CUSTOMER.
 * Gateway prepends: 🔔 malevitamine:
 */
function buildCustomerWhatsAppMessage(params: {
  customerName: string;
  amount: number;
  currencySymbol: string;
  deliveryOption: string;
  deliveryFee: number;
  txRef: string;
  address: string;
}): string {
  const deliveryLabel =
    params.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";
  return [
    `Payment Confirmed!`,
    ``,
    `Hi ${params.customerName},`,
    ``,
    `Your payment of *${params.currencySymbol} ${params.amount.toFixed(2)}* has been received and confirmed.`,
    ``,
    `📦 Your product will be sent to:`,
    `${params.address}`,
    ``,
    `🚚 Delivery: ${deliveryLabel}`,
    ``,
    `You will be informed with tracking details once it ships.`,
    ``,
    `Reference: ${params.txRef}`,
    ``,
    `Thank you for your order!`,
  ].join("\n");
}

/**
 * Build WhatsApp message for JVL with full order details.
 * Gateway prepends: 🔔 malevitamine:
 *
 * JVL needs: customer name, address, product, delivery details, their share.
 */
function buildJVLWhatsAppMessage(params: {
  customerName: string;
  customerPhone: string;
  amount: number;
  currencySymbol: string;
  deliveryOption: string;
  deliveryFee: number;
  address: string;
  txRef: string;
  productName: string;
  jvlShare: number;
  ownerShare: number;
  flutterwaveFee: number;
}): string {
  const deliveryLabel =
    params.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";
  return [
    `NEW ORDER — ${params.productName}`,
    ``,
    `Customer: ${params.customerName}`,
    `Phone: ${params.customerPhone}`,
    `Address: ${params.address}`,
    ``,
    `Product: ${params.productName}`,
    `Amount: ${params.currencySymbol} ${params.amount.toFixed(2)}`,
    `Delivery: ${deliveryLabel} (${params.currencySymbol} ${params.deliveryFee.toFixed(2)})`,
    ``,
    `Reference: ${params.txRef}`,
    ``,
    `--- PAYMENT SPLIT ---`,
    `TJ (25% clean): ${params.currencySymbol} ${params.ownerShare.toFixed(2)}`,
    `Flutterwave fee: -${params.currencySymbol} ${params.flutterwaveFee.toFixed(2)}`,
    `Delivery fee: -${params.currencySymbol} ${params.deliveryFee.toFixed(2)}`,
    `JVL (net): ${params.currencySymbol} ${params.jvlShare.toFixed(2)}`,
    ``,
    `Please ship to customer at the above address.`,
  ].join("\n");
}

/**
 * Calculate the split breakdown.
 *
 * JVL PAYMENT LOGIC:
 * - TJ gets 25% of GROSS (clean, no deductions)
 * - JVL gets the REMAINING after TJ's share and Flutterwave fee
 * - Delivery fee is deducted from JVL's share
 */
function calculateSplitBreakdown(
  totalAmount: number,
  deliveryOption: string = "normal"
) {
  // Flutterwave SA fee: 2.9% + R1 (local card estimate)
  const flutterwaveFee = totalAmount * 0.029 + 1;

  // Owner (TJ) gets 25% of GROSS — clean
  const ownerPercentage = Number(process.env.SPLIT_OWNER_PERCENTAGE || 25);
  const ownerShare = totalAmount * (ownerPercentage / 100);

  // JVL gets the remaining after TJ's share and Flutterwave fee
  const partnerGrossShare = totalAmount - ownerShare - flutterwaveFee;

  // Delivery fee
  const normalFee = Number(process.env.DELIVERY_FEE_NORMAL || 8900) / 100;
  const speedFee = Number(process.env.DELIVERY_FEE_SPEED || 11900) / 100;
  const deliveryFee = deliveryOption === "speed" ? speedFee : normalFee;

  // JVL net after delivery
  const partnerNetShare = partnerGrossShare - deliveryFee;

  const settlementAmount = totalAmount - flutterwaveFee;

  const splits = [
    {
      label: process.env.SPLIT_OWNER_LABEL || "Owner",
      percentage: ownerPercentage,
      amount: Math.round(ownerShare * 100) / 100,
      note: "Clean — no deductions",
    },
    {
      label: process.env.SPLIT_PARTNER_LABEL || "Partner",
      percentage: 100 - ownerPercentage,
      amount: Math.round(partnerNetShare * 100) / 100,
      note: `After Flutterwave fee (-R ${flutterwaveFee.toFixed(2)}) and delivery (-R ${deliveryFee.toFixed(2)})`,
    },
  ];

  return {
    totalAmount,
    flutterwaveFee: Math.round(flutterwaveFee * 100) / 100,
    ownerShare: Math.round(ownerShare * 100) / 100,
    partnerGrossShare: Math.round(partnerGrossShare * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    partnerNetShare: Math.round(partnerNetShare * 100) / 100,
    settlementAmount: Math.round(settlementAmount * 100) / 100,
    splits,
  };
}

function getBaseUrl(): string {
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}
