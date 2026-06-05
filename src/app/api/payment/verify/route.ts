import { NextRequest, NextResponse } from "next/server";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

/**
 * POST /api/payment/verify
 *
 * Verifies a Flutterwave transaction server-side and calculates the split breakdown.
 * After successful verification, triggers notifications:
 * - WhatsApp to customer: Payment confirmed + delivery details
 * - WhatsApp to ALL JVL contacts (Nico, Ana, Chalyn, Jacques): Full client details + order + JVL settlement
 * - WhatsApp to Owner (T Schoeman): Full transaction details + both shares
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

  // 2. WhatsApp to ALL JVL contacts — Full client details + split + bank accounts
  const jvlPhones = [
    process.env.JVL_PHONE_NICO,
    process.env.JVL_PHONE_ANA,
    process.env.JVL_PHONE_CHALYN,
    process.env.JVL_PHONE_JACQUES,
  ].filter(Boolean) as string[];

  if (jvlPhones.length > 0) {
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

    for (const phone of jvlPhones) {
      try {
        await fetch(`${baseUrl}/api/payment/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "whatsapp",
            phone,
            message: jvlMessage,
          }),
        });
        console.log("[Payment] JVL WhatsApp sent to", phone);
      } catch (error) {
        console.error("[Payment] JVL WhatsApp failed for", phone, error);
      }
    }
  }

  // 3. WhatsApp to OWNER (T Schoeman) — Full transaction details + Owner's share
  const ownerPhone = process.env.OWNER_PHONE;
  if (ownerPhone) {
    try {
      const ownerMessage = buildOwnerWhatsAppMessage({
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
        ownerShare: details.splitBreakdown.ownerShare,
        jvlShare: details.splitBreakdown.partnerNetShare,
        flutterwaveFee: details.splitBreakdown.flutterwaveFee,
      });

      await fetch(`${baseUrl}/api/payment/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          phone: ownerPhone,
          message: ownerMessage,
        }),
      });
      console.log("[Payment] Owner WhatsApp sent to", ownerPhone);
    } catch (error) {
      console.error("[Payment] Owner WhatsApp failed:", error);
    }
  }

  // 4. Email to JVL (Ana) — Full transaction details + client particulars
  const jvlSaleEmail = process.env.JVL_SALE_EMAIL;
  if (jvlSaleEmail) {
    try {
      const deliveryLabel =
        details.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";
      const productPrice = details.amount - details.splitBreakdown.deliveryFee;

      const jvlEmailBody = [
        `NEW ORDER — ${businessName}`,
        ``,
        `CLIENT PARTICULARS:`,
        `Name: ${details.customerName}`,
        `Phone: ${details.customerPhone || "Not provided"}`,
        `Email: ${details.customerEmail}`,
        `Address: ${details.customerAddress}`,
        ``,
        `ORDER DETAILS:`,
        `Product: ${businessName}`,
        `Product Price: R ${productPrice.toFixed(2)}`,
        `Delivery: ${deliveryLabel} — R ${details.splitBreakdown.deliveryFee.toFixed(2)}`,
        `Total Paid: R ${details.amount.toFixed(2)}`,
        `Reference: ${details.txRef}`,
        `Processed by: Sitewizard`,
        ``,
        `JVL SETTLEMENT:`,
        `JVL Share (75% of product after fees): R ${details.splitBreakdown.partnerGrossShare.toFixed(2)}`,
        `Plus delivery fee (full): +R ${details.splitBreakdown.deliveryFee.toFixed(2)}`,
        `Payment gateway fee: -R ${details.splitBreakdown.flutterwaveFee.toFixed(2)}`,
        ``,
        `TOTAL TO JVL ACCOUNT: R ${details.splitBreakdown.partnerNetShare.toFixed(2)}`,
        `Bank: Standard Bank | JVL Headquarters PTY Ltd`,
        `Account: 253215811 | Branch: Menlyn`,
        ``,
        `Owner Share (25%): R ${details.splitBreakdown.ownerShare.toFixed(2)}`,
        ``,
        `Auto-split by payment gateway. Funds settle within 24h.`,
      ].join("\n");

      // Professional HTML version of the sale notification
      const jvlEmailHtml = buildJVLSaleEmailHtml({
        businessName,
        customerName: details.customerName,
        customerPhone: details.customerPhone || "Not provided",
        customerEmail: details.customerEmail,
        customerAddress: details.customerAddress,
        productPrice,
        deliveryLabel,
        deliveryFee: details.splitBreakdown.deliveryFee,
        totalAmount: details.amount,
        txRef: details.txRef,
        partnerGrossShare: details.splitBreakdown.partnerGrossShare,
        deliveryFeeAmount: details.splitBreakdown.deliveryFee,
        flutterwaveFee: details.splitBreakdown.flutterwaveFee,
        partnerNetShare: details.splitBreakdown.partnerNetShare,
        ownerShare: details.splitBreakdown.ownerShare,
      });

      await fetch(`${baseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: jvlSaleEmail,
          subject: `NEW ORDER — ${businessName} — R ${details.amount.toFixed(2)}`,
          body: jvlEmailBody,
          html: jvlEmailHtml,
        }),
      });

      console.log("[Payment] JVL sale email sent to", jvlSaleEmail);
    } catch (error) {
      console.error("[Payment] JVL sale email failed:", error);
    }
  }

  // 5. Email to OWNER (T Schoeman) — Full transaction details + both shares
  const ownerSaleEmail = process.env.OWNER_SALE_EMAIL;
  if (ownerSaleEmail) {
    try {
      const deliveryLabel =
        details.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";
      const productPrice = details.amount - details.splitBreakdown.deliveryFee;

      const ownerEmailBody = [
        `PAYMENT RECEIVED — ${businessName}`,
        ``,
        `CLIENT PARTICULARS:`,
        `Name: ${details.customerName}`,
        `Phone: ${details.customerPhone || "Not provided"}`,
        `Email: ${details.customerEmail}`,
        `Address: ${details.customerAddress}`,
        ``,
        `TRANSACTION DETAILS:`,
        `Product: ${businessName}`,
        `Product Price: R ${productPrice.toFixed(2)}`,
        `Delivery (${deliveryLabel}): R ${details.splitBreakdown.deliveryFee.toFixed(2)}`,
        `Total Paid: R ${details.amount.toFixed(2)}`,
        `Payment Gateway Fee: -R ${details.splitBreakdown.flutterwaveFee.toFixed(2)}`,
        `Reference: ${details.txRef}`,
        `Processed by: Sitewizard`,
        ``,
        `YOUR SETTLEMENT (25%):`,
        `Your Share (25% of product after fees): R ${details.splitBreakdown.ownerShare.toFixed(2)}`,
        `Bank: Capitec | Theunis J Schoeman`,
        `Account: 2399132838 | Branch: 470010`,
        ``,
        `JVL SETTLEMENT (75% + delivery):`,
        `JVL Share: R ${details.splitBreakdown.partnerNetShare.toFixed(2)}`,
        `Bank: Standard Bank | JVL Headquarters PTY Ltd`,
        `Account: 253215811 | Branch: Menlyn`,
        ``,
        `Auto-split by payment gateway. Funds settle within 24h.`,
      ].join("\n");

      const ownerEmailHtml = buildOwnerSaleEmailHtml({
        businessName,
        customerName: details.customerName,
        customerPhone: details.customerPhone || "Not provided",
        customerEmail: details.customerEmail,
        customerAddress: details.customerAddress,
        productPrice,
        deliveryLabel,
        deliveryFee: details.splitBreakdown.deliveryFee,
        totalAmount: details.amount,
        flutterwaveFee: details.splitBreakdown.flutterwaveFee,
        txRef: details.txRef,
        ownerShare: details.splitBreakdown.ownerShare,
        partnerNetShare: details.splitBreakdown.partnerNetShare,
      });

      await fetch(`${baseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ownerSaleEmail,
          subject: `PAYMENT RECEIVED — ${businessName} — R ${details.amount.toFixed(2)}`,
          body: ownerEmailBody,
          html: ownerEmailHtml,
        }),
      });

      console.log("[Payment] Owner sale email sent to", ownerSaleEmail);
    } catch (error) {
      console.error("[Payment] Owner sale email failed:", error);
    }
  }

  // 6. Email to customer
  if (details.customerEmail) {
    try {
      const deliveryLabel =
        details.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";

      const customerEmailBody = [
        `Hi ${details.customerName},`,
        ``,
        `Your payment of R ${details.amount.toFixed(2)} has been received and confirmed.`,
        ``,
        `Your product will be sent to you shortly. You will be informed with tracking details once it ships.`,
        ``,
        `Order Reference: ${details.txRef}`,
        ``,
        `Thank you for your order!`,
        ``,
        `— ${businessName}`,
      ].join("\n");

      const customerEmailHtml = buildCustomerSaleEmailHtml({
        businessName,
        customerName: details.customerName,
        totalAmount: details.amount,
        deliveryLabel,
        deliveryFee: details.splitBreakdown.deliveryFee,
        address: details.customerAddress,
        txRef: details.txRef,
      });

      await fetch(`${baseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: details.customerEmail,
          subject: `${businessName} — Payment Confirmed`,
          body: customerEmailBody,
          html: customerEmailHtml,
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
    `Plus delivery fee (full): +${params.currencySymbol} ${params.deliveryFee.toFixed(2)}`,
    `Payment gateway fee deducted from total: -${params.currencySymbol} ${params.flutterwaveFee.toFixed(2)}`,
    ``,
    `💰 TOTAL TO JVL ACCOUNT: ${params.currencySymbol} ${jvlAccountPayment.toFixed(2)}`,
    `   (75% of product + full delivery — auto-split by payment gateway)`,
    `  ➤ Bank: ${partnerBank} | ${partnerAccName}`,
    `  ➤ Account: ${partnerAccNo} | Branch: ${partnerBranch}`,
    ``,
    `━━━ ACTION REQUIRED ━━━`,
    `Please ship to the client at the address above.`,
    `Reply to this message to confirm shipment.`,
  ].join("\n");
}

/**
 * Build WhatsApp message for OWNER (T Schoeman).
 * Shows full transaction details, client particulars, and BOTH shares.
 * Owner sees everything — client details, their own share, and JVL's share.
 * Gateway prepends: 🔔 malevitamin:
 */
function buildOwnerWhatsAppMessage(params: {
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
  ownerShare: number;
  jvlShare: number;
  flutterwaveFee: number;
}): string {
  const deliveryLabel =
    params.deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";

  const ownerBank = process.env.OWNER_BANK || "";
  const ownerAccName = process.env.OWNER_ACCOUNT_NAME || "";
  const ownerAccNo = process.env.OWNER_ACCOUNT_NUMBER || "";
  const ownerBranch = process.env.OWNER_BRANCH || "";

  const productPrice = params.amount - params.deliveryFee;

  return [
    `💰 PAYMENT RECEIVED — ${params.productName}`,
    ``,
    `━━━ CLIENT PARTICULARS ━━━`,
    `👤 Name: ${params.customerName}`,
    `📞 Phone: ${params.customerPhone}`,
    `📧 Email: ${params.customerEmail}`,
    `📍 Address: ${params.address}`,
    ``,
    `━━━ TRANSACTION DETAILS ━━━`,
    `Product: ${params.productName}`,
    `Product Price: ${params.currencySymbol} ${productPrice.toFixed(2)}`,
    `Delivery (${deliveryLabel}): ${params.currencySymbol} ${params.deliveryFee.toFixed(2)}`,
    `Total Paid: ${params.currencySymbol} ${params.amount.toFixed(2)}`,
    `Payment Gateway Fee: -${params.currencySymbol} ${params.flutterwaveFee.toFixed(2)}`,
    `Reference: ${params.txRef}`,
    `Processed by: Sitewizard`,
    ``,
    `━━━ YOUR SETTLEMENT (25%) ━━━`,
    `Your Share (25% of product after fees): ${params.currencySymbol} ${params.ownerShare.toFixed(2)}`,
    `  ➤ Bank: ${ownerBank} | ${ownerAccName}`,
    `  ➤ Account: ${ownerAccNo} | Branch: ${ownerBranch}`,
    ``,
    `━━━ JVL SETTLEMENT (75% + delivery) ━━━`,
    `JVL Share: ${params.currencySymbol} ${params.jvlShare.toFixed(2)}`,
    `  ➤ Bank: Standard Bank | JVL Headquarters PTY Ltd`,
    `  ➤ Account: 253215811 | Branch: Menlyn`,
    ``,
    `Auto-split by payment gateway. Funds settle to bank accounts within 24h.`,
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

/**
 * Build professional HTML email for JVL sale notification.
 * Shows client particulars, order details, and JVL settlement breakdown.
 */
function buildJVLSaleEmailHtml(params: {
  businessName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productPrice: number;
  deliveryLabel: string;
  deliveryFee: number;
  totalAmount: number;
  txRef: string;
  partnerGrossShare: number;
  deliveryFeeAmount: number;
  flutterwaveFee: number;
  partnerNetShare: number;
  ownerShare: number;
}): string {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#2563eb;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;font-size:20px;">&#128722; NEW ORDER — ${params.businessName}</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      <h3 style="color:#374151;border-bottom:2px solid #2563eb;padding-bottom:8px;margin-top:0;">CLIENT PARTICULARS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Name:</td><td style="padding:6px 0;font-weight:600;">${params.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Phone:</td><td style="padding:6px 0;font-weight:600;">${params.customerPhone}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Email:</td><td style="padding:6px 0;font-weight:600;">${params.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Address:</td><td style="padding:6px 0;font-weight:600;">${params.customerAddress}</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #2563eb;padding-bottom:8px;margin-top:24px;">ORDER DETAILS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Product:</td><td style="padding:6px 0;font-weight:600;">${params.businessName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Product Price:</td><td style="padding:6px 0;font-weight:600;">R ${params.productPrice.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Delivery:</td><td style="padding:6px 0;font-weight:600;">${params.deliveryLabel} — R ${params.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Total Paid:</td><td style="padding:6px 0;font-weight:600;">R ${params.totalAmount.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Reference:</td><td style="padding:6px 0;font-weight:600;">${params.txRef}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Processed by:</td><td style="padding:6px 0;font-weight:600;">Sitewizard</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #2563eb;padding-bottom:8px;margin-top:24px;">JVL SETTLEMENT</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:200px;">JVL Share (75% of product after fees):</td><td style="padding:6px 0;font-weight:600;">R ${params.partnerGrossShare.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Plus delivery fee (full):</td><td style="padding:6px 0;font-weight:600;">+R ${params.deliveryFeeAmount.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Payment gateway fee:</td><td style="padding:6px 0;font-weight:600;">-R ${params.flutterwaveFee.toFixed(2)}</td></tr>
        <tr style="background:#f0fdf4;"><td style="padding:10px 6px;color:#059669;font-weight:700;font-size:16px;">TOTAL TO JVL ACCOUNT:</td><td style="padding:10px 6px;font-weight:700;font-size:18px;color:#059669;">R ${params.partnerNetShare.toFixed(2)}</td></tr>
      </table>
      <div style="background:#f9fafb;padding:12px 16px;border-radius:6px;margin-top:16px;">
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Bank:</strong> Standard Bank | JVL Headquarters PTY Ltd</p>
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Account:</strong> 253215811 | <strong>Branch:</strong> Menlyn</p>
      </div>
      <p style="color:#6b7280;font-size:12px;margin-top:20px;">Owner Share (25%): R ${params.ownerShare.toFixed(2)}<br>Auto-split by payment gateway. Funds settle within 24h.<br>Sent by Sitewizard on behalf of ${params.businessName}</p>
    </div>
  </div>`;
}

/**
 * Build professional HTML email for customer payment confirmation.
 * Shows payment confirmation + delivery details only (no money split).
 */
function buildCustomerSaleEmailHtml(params: {
  businessName: string;
  customerName: string;
  totalAmount: number;
  deliveryLabel: string;
  deliveryFee: number;
  address: string;
  txRef: string;
}): string {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#059669;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;font-size:20px;">&#9989; Payment Confirmed!</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      <p style="font-size:16px;color:#374151;">Hi ${params.customerName},</p>
      <p style="font-size:16px;color:#374151;">Your payment of <strong>R ${params.totalAmount.toFixed(2)}</strong> has been received and confirmed.</p>
      <h3 style="color:#374151;border-bottom:2px solid #059669;padding-bottom:8px;margin-top:24px;">Delivery Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Address:</td><td style="padding:6px 0;font-weight:600;">${params.address}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Delivery:</td><td style="padding:6px 0;font-weight:600;">${params.deliveryLabel} — R ${params.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Reference:</td><td style="padding:6px 0;font-weight:600;">${params.txRef}</td></tr>
      </table>
      <p style="font-size:15px;color:#374151;margin-top:20px;">Your product will be sent to you shortly. You will be informed with tracking details once it ships.</p>
      <p style="font-size:15px;color:#374151;">Thank you for your order!</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="color:#6b7280;font-size:12px;">— ${params.businessName}</p>
    </div>
  </div>`;
}

/**
 * Build professional HTML email for Owner (T Schoeman).
 * Shows client particulars, full transaction details, and BOTH shares.
 */
function buildOwnerSaleEmailHtml(params: {
  businessName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productPrice: number;
  deliveryLabel: string;
  deliveryFee: number;
  totalAmount: number;
  flutterwaveFee: number;
  txRef: string;
  ownerShare: number;
  partnerNetShare: number;
}): string {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#d97706;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;font-size:20px;">&#128176; PAYMENT RECEIVED — ${params.businessName}</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:0;">CLIENT PARTICULARS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Name:</td><td style="padding:6px 0;font-weight:600;">${params.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Phone:</td><td style="padding:6px 0;font-weight:600;">${params.customerPhone}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Email:</td><td style="padding:6px 0;font-weight:600;">${params.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Address:</td><td style="padding:6px 0;font-weight:600;">${params.customerAddress}</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:24px;">TRANSACTION DETAILS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Product:</td><td style="padding:6px 0;font-weight:600;">${params.businessName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Product Price:</td><td style="padding:6px 0;font-weight:600;">R ${params.productPrice.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Delivery:</td><td style="padding:6px 0;font-weight:600;">${params.deliveryLabel} — R ${params.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Total Paid:</td><td style="padding:6px 0;font-weight:600;">R ${params.totalAmount.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Gateway Fee:</td><td style="padding:6px 0;font-weight:600;">-R ${params.flutterwaveFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Reference:</td><td style="padding:6px 0;font-weight:600;">${params.txRef}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Processed by:</td><td style="padding:6px 0;font-weight:600;">Sitewizard</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:24px;">YOUR SETTLEMENT (25%)</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#fffbeb;"><td style="padding:10px 6px;color:#d97706;font-weight:700;font-size:16px;">Your Share (25% of product after fees):</td><td style="padding:10px 6px;font-weight:700;font-size:18px;color:#d97706;">R ${params.ownerShare.toFixed(2)}</td></tr>
      </table>
      <div style="background:#f9fafb;padding:12px 16px;border-radius:6px;margin-top:12px;">
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Bank:</strong> Capitec | Theunis J Schoeman</p>
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Account:</strong> 2399132838 | <strong>Branch:</strong> 470010</p>
      </div>
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:24px;">JVL SETTLEMENT (75% + delivery)</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#f0fdf4;"><td style="padding:10px 6px;color:#059669;font-weight:700;font-size:16px;">JVL Share:</td><td style="padding:10px 6px;font-weight:700;font-size:18px;color:#059669;">R ${params.partnerNetShare.toFixed(2)}</td></tr>
      </table>
      <div style="background:#f9fafb;padding:12px 16px;border-radius:6px;margin-top:12px;">
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Bank:</strong> Standard Bank | JVL Headquarters PTY Ltd</p>
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Account:</strong> 253215811 | <strong>Branch:</strong> Menlyn</p>
      </div>
      <p style="color:#6b7280;font-size:12px;margin-top:20px;">Auto-split by payment gateway. Funds settle to bank accounts within 24h.<br>Sent by Sitewizard on behalf of ${params.businessName}</p>
    </div>
  </div>`;
}
