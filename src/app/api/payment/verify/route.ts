import { NextRequest, NextResponse } from "next/server";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

/**
 * POST /api/payment/verify
 *
 * Verifies a Flutterwave transaction server-side and calculates the split breakdown.
 * After successful verification, triggers notifications:
 * - WhatsApp to customer: Payment confirmed + split breakdown + delivery details
 * - WhatsApp to JVL: Full client details + order + split + bank accounts
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

    // Demo mode
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

    // Real verification
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

  // 1. WhatsApp to CUSTOMER — with split breakdown
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
        ownerShare: details.splitBreakdown.ownerShare,
        ownerLabel: process.env.SPLIT_OWNER_LABEL || "Owner",
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

      console.log("[Payment] Customer WhatsApp sent to", details.customerPhone);
    } catch (error) {
      console.error("[Payment] Customer WhatsApp failed:", error);
    }
  }

  // 2. WhatsApp to JVL — Full client details + split + bank accounts
  const jvlPhone = process.env.JVL_NOTIFICATION_PHONE;
  if (jvlPhone) {
    try {
      const jvlMessage = buildJVLWhatsAppMessage({
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        customerPhone: details.customerPhone || "Not provided",
        amount: details.amount,
        currencySymbol,
        deliveryOption: details.deliveryOption,
        deliveryFee: details.splitBreakdown.deliveryFee,
        address: details.customerAddress,
        txRef: details.txRef,
        productName: businessName,
        jvlNet: details.splitBreakdown.partnerNetShare,
        jvlGross: details.splitBreakdown.partnerGrossShare,
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

      console.log("[Payment] Email sent to", details.customerEmail);
    } catch (error) {
      console.error("[Payment] Email failed:", error);
    }
  }

  // 4. Log
  console.log("[Payment] Split breakdown:", details.splitBreakdown);
}

/**
 * Build WhatsApp message for CUSTOMER.
 * Shows payment confirmation + split + delivery details.
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
  ownerShare: number;
  ownerLabel: string;
}): string {
  const deliveryLabel =
    params.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";
  const jvlAmount = params.amount - params.ownerShare;
  return [
    `Payment Confirmed!`,
    ``,
    `Hi ${params.customerName},`,
    ``,
    `Your payment of *${params.currencySymbol} ${params.amount.toFixed(2)}* has been received and confirmed.`,
    ``,
    `📦 Deliver to:`,
    `${params.address}`,
    `🚚 ${deliveryLabel}`,
    ``,
    `You will be informed with tracking details once it ships.`,
    ``,
    `Ref: ${params.txRef}`,
    ``,
    `Thank you for your order!`,
  ].join("\n");
}

/**
 * Build WhatsApp message for JVL with FULL details.
 * Shows client name, phone, email, address, product, delivery,
 * exact split amounts, and bank account info.
 * Gateway prepends: 🔔 malevitamine:
 */
function buildJVLWhatsAppMessage(params: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currencySymbol: string;
  deliveryOption: string;
  deliveryFee: number;
  address: string;
  txRef: string;
  productName: string;
  jvlNet: number;
  jvlGross: number;
  ownerShare: number;
  flutterwaveFee: number;
}): string {
  const deliveryLabel =
    params.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";

  const ownerBank = process.env.OWNER_BANK || "";
  const ownerAccName = process.env.OWNER_ACCOUNT_NAME || "";
  const ownerAccNo = process.env.OWNER_ACCOUNT_NUMBER || "";
  const partnerBank = process.env.PARTNER_BANK || "";
  const partnerAccName = process.env.PARTNER_ACCOUNT_NAME || "";
  const partnerAccNo = process.env.PARTNER_ACCOUNT_NUMBER || "";
  const partnerBranch = process.env.PARTNER_BRANCH || "";

  return [
    `🛒 NEW ORDER — ${params.productName}`,
    ``,
    `--- CLIENT DETAILS ---`,
    `Name: ${params.customerName}`,
    `Phone: ${params.customerPhone}`,
    `Email: ${params.customerEmail}`,
    `Address: ${params.address}`,
    ``,
    `--- ORDER DETAILS ---`,
    `Product: ${params.productName}`,
    `Amount Paid: ${params.currencySymbol} ${params.amount.toFixed(2)}`,
    `Delivery: ${deliveryLabel} (${params.currencySymbol} ${params.deliveryFee.toFixed(2)})`,
    `Reference: ${params.txRef}`,
    ``,
    `--- MONEY SPLIT ---`,
    `Total Received: ${params.currencySymbol} ${params.amount.toFixed(2)}`,
    ``,
    `TJ Schoeman (25% clean):`,
    `  → ${params.currencySymbol} ${params.ownerShare.toFixed(2)}`,
    `  → ${ownerBank} | ${ownerAccName} | Acc: ${ownerAccNo}`,
    ``,
    `JVL (75% minus costs):`,
    `  → Gross: ${params.currencySymbol} ${params.jvlGross.toFixed(2)}`,
    `  → Flutterwave fee: -${params.currencySymbol} ${params.flutterwaveFee.toFixed(2)}`,
    `  → Delivery fee: -${params.currencySymbol} ${params.deliveryFee.toFixed(2)}`,
    `  → JVL NET: ${params.currencySymbol} ${params.jvlNet.toFixed(2)}`,
    `  → ${partnerBank} | ${partnerAccName} | Acc: ${partnerAccNo} | Branch: ${partnerBranch}`,
    ``,
    `Please ship to customer at the above address.`,
  ].join("\n");
}

/**
 * Calculate the split breakdown.
 *
 * TJ gets 25% of GROSS (clean, no deductions)
 * JVL gets remaining after TJ's share + Flutterwave fee
 * Delivery fee deducted from JVL's share
 */
function calculateSplitBreakdown(
  totalAmount: number,
  deliveryOption: string = "normal"
) {
  const flutterwaveFee = totalAmount * 0.029 + 1;

  const ownerPercentage = Number(process.env.SPLIT_OWNER_PERCENTAGE || 25);
  const ownerShare = totalAmount * (ownerPercentage / 100);

  const partnerGrossShare = totalAmount - ownerShare - flutterwaveFee;

  const normalFee = Number(process.env.DELIVERY_FEE_NORMAL || 8900) / 100;
  const speedFee = Number(process.env.DELIVERY_FEE_SPEED || 11900) / 100;
  const deliveryFee = deliveryOption === "speed" ? speedFee : normalFee;

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
