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

      const deliveryFee = deliveryOption === "speed" ? 119 : 89;
      const totalAmount = 850 + deliveryFee;
      const splitBreakdown = calculateSplitBreakdown(
        totalAmount,
        deliveryOption || "normal"
      );

      await triggerNotifications({
        customerName: customerName || "Demo Customer",
        customerEmail: customerEmail || "demo@test.com",
        customerPhone: customerPhone || undefined,
        customerAddress: customerAddress || "123 Demo Street, Pretoria",
        deliveryOption: deliveryOption || "normal",
        amount: totalAmount,
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
          amount: totalAmount,
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
 * Shows payment confirmation + delivery details only.
 * Money split is PRIVATE — only shown to TJ and JVL.
 * Gateway prepends: 🔔 malevitamin:
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
  return [
    `✅ Payment Confirmed!`,
    ``,
    `Hi ${params.customerName},`,
    ``,
    `Your payment of *${params.currencySymbol} ${params.amount.toFixed(2)}* has been received and confirmed.`,
    ``,
    `📦 Deliver to:`,
    `${params.address}`,
    `🚚 ${deliveryLabel}`,
    ``,
    `Your product will be sent to you shortly. You will be informed with tracking details once it ships.`,
    ``,
    `Ref: ${params.txRef}`,
    ``,
    `Thank you for your order!`,
  ].join("\n");
}

/**
 * Build WhatsApp message for JVL.
 * Shows client particulars, order details, and ONLY JVL's share.
 * No other party's figures shown. "Sitewizard" used as agent name.
 * "Payment gateway" used instead of Flutterwave.
 * Gateway prepends: 🔔 malevitamin:
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

  const partnerBank = process.env.PARTNER_BANK || "";
  const partnerAccName = process.env.PARTNER_ACCOUNT_NAME || "";
  const partnerAccNo = process.env.PARTNER_ACCOUNT_NUMBER || "";
  const partnerBranch = process.env.PARTNER_BRANCH || "";

  const jvlAccountPayment = params.jvlNet;

  return [
    `🛒 NEW ORDER — ${params.productName}`,
    ``,
    `━━━ CLIENT PARTICULARS ━━━`,
    `👤 Name: ${params.customerName}`,
    `📞 Phone: ${params.customerPhone}`,
    `📧 Email: ${params.customerEmail}`,
    `📍 Address: ${params.address}`,
    ``,
    `━━━ ORDER DETAILS ━━━`,
    `Product: ${params.productName}`,
    `Amount Paid: ${params.currencySymbol} ${params.amount.toFixed(2)}`,
    `Delivery: ${deliveryLabel}`,
    `Reference: ${params.txRef}`,
    `Processed by: Sitewizard`,
    ``,
    `━━━ JVL SETTLEMENT ━━━`,
    `JVL Share (75% of product after fees): ${params.currencySymbol} ${params.jvlGross.toFixed(2)}`,
    `Plus delivery fee: +${params.currencySymbol} ${params.deliveryFee.toFixed(2)}`,
    `Payment gateway fee deducted: -${params.currencySymbol} ${params.flutterwaveFee.toFixed(2)}`,
    ``,
    `💰 AMOUNT TO JVL ACCOUNT: ${params.currencySymbol} ${jvlAccountPayment.toFixed(2)}`,
    `  ➤ Bank: ${partnerBank} | ${partnerAccName}`,
    `  ➤ Account: ${partnerAccNo} | Branch: ${partnerBranch}`,
    ``,
    `━━━ ACTION REQUIRED ━━━`,
    `Please ship to the client at the address above.`,
    `Reply to this message to confirm shipment.`,
  ].join("\n");
}

/**
 * Calculate the split breakdown.
 *
 * Customer pays total = product price + delivery fee.
 * Flutterwave takes fee from total. Delivery goes to JVL.
 * Owner and JVL split the product portion (after fees) 25/75.
 *
 * Example: R 969 total (R 850 product + R 119 speed delivery)
 *   - Flutterwave fee: R 29.10
 *   - Settlement: R 939.90
 *   - Delivery to JVL: R 119.00
 *   - Split pool: R 939.90 - R 119.00 = R 820.90
 *   - Owner (25%): R 205.23
 *   - JVL (75% + delivery): R 615.68 + R 119.00 = R 734.68
 */
function calculateSplitBreakdown(
  totalAmount: number,
  deliveryOption: string = "normal"
) {
  const flutterwaveFee = totalAmount * 0.029 + 1;
  const afterFeeAmount = totalAmount - flutterwaveFee;

  const normalFee = Number(process.env.DELIVERY_FEE_NORMAL || 8900) / 100;
  const speedFee = Number(process.env.DELIVERY_FEE_SPEED || 11900) / 100;
  const deliveryFee = deliveryOption === "speed" ? speedFee : normalFee;

  // Split pool = settlement minus delivery fee
  const splitPool = afterFeeAmount - deliveryFee;

  const ownerPercentage = Number(process.env.SPLIT_OWNER_PERCENTAGE || 25);
  const ownerShare = splitPool * (ownerPercentage / 100);

  const partnerGrossShare = splitPool * ((100 - ownerPercentage) / 100);

  // JVL total = 75% of split pool + delivery fee
  const partnerNetShare = partnerGrossShare + deliveryFee;
  const settlementAmount = totalAmount - flutterwaveFee;

  const splits = [
    {
      label: process.env.SPLIT_OWNER_LABEL || "Owner",
      percentage: ownerPercentage,
      amount: Math.round(ownerShare * 100) / 100,
      note: `${ownerPercentage}% of product after fees`,
    },
    {
      label: process.env.SPLIT_PARTNER_LABEL || "JVL",
      percentage: 100 - ownerPercentage,
      amount: Math.round(partnerGrossShare * 100) / 100,
      note: `${100 - ownerPercentage}% of product + delivery (R ${deliveryFee.toFixed(2)})`,
    },
  ];

  return {
    totalAmount,
    productPrice: totalAmount - deliveryFee,
    flutterwaveFee: Math.round(flutterwaveFee * 100) / 100,
    afterFeeAmount: Math.round(afterFeeAmount * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    splitPool: Math.round(splitPool * 100) / 100,
    ownerShare: Math.round(ownerShare * 100) / 100,
    partnerGrossShare: Math.round(partnerGrossShare * 100) / 100,
    partnerNetShare: Math.round(partnerNetShare * 100) / 100,
    settlementAmount: Math.round(settlementAmount * 100) / 100,
    splits,
  };
}

function getBaseUrl(): string {
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}
