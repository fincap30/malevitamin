import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/notify
 *
 * Handles post-payment notifications:
 * - WhatsApp messages to customers (via Universal WhatsApp Gateway)
 * - Email confirmations to customers
 *
 * WHATSAPP GATEWAY:
 * ================
 * Uses the Universal WhatsApp Gateway on CodeWords.
 * - Sends from +27769379301 (Sitewizard)
 * - Messages appear as: 🔔 {product}: {message}
 * - Replies are smart-routed back to this site's webhook
 * - Product name MUST match the registered site name in .env
 *
 * Request body:
 *   {
 *     type: "whatsapp" | "email",
 *     // WhatsApp fields:
 *     phone?: string,
 *     message?: string,
 *     // Email fields:
 *     email?: string,
 *     // Common fields:
 *     customerName?: string,
 *     amount?: number,
 *     currency?: string,
 *     txRef?: string,
 *     transactionId?: number,
 *     businessName?: string,
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "whatsapp") {
      return await handleWhatsAppNotification(body);
    }

    if (type === "email") {
      return await handleEmailNotification(body);
    }

    return NextResponse.json(
      { success: false, error: "Unknown notification type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Payment Notify] Error:", error);
    return NextResponse.json(
      { success: false, error: "Notification failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle WhatsApp notification via Universal WhatsApp Gateway.
 *
 * Gateway: https://runtime.codewords.ai/run/wa_universal_gateway_438e963b
 * Sends from: +27769379301 (Sitewizard)
 * Format: 🔔 {product}: {message}
 * Smart routing: Replies go only to this site's webhook
 *
 * Env vars:
 *   WHATSAPP_GATEWAY_URL - Gateway endpoint
 *   WHATSAPP_GATEWAY_KEY - Bearer token for auth
 *   WHATSAPP_PRODUCT_NAME - Registered site name (must match gateway registration)
 */
async function handleWhatsAppNotification(body: {
  phone?: string;
  message?: string;
  customerName?: string;
  amount?: number;
  currency?: string;
  txRef?: string;
  transactionId?: number;
}): Promise<NextResponse> {
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
  const gatewayKey = process.env.WHATSAPP_GATEWAY_KEY;
  const productName = process.env.WHATSAPP_PRODUCT_NAME;

  if (!body.phone) {
    console.log(
      "[WhatsApp] No phone number provided — skipping WhatsApp notification"
    );
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "No phone number provided",
    });
  }

  // If WhatsApp gateway is configured, send the message
  if (gatewayUrl && gatewayKey && productName) {
    try {
      const response = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gatewayKey}`,
        },
        body: JSON.stringify({
          phone: body.phone,
          product: productName,
          message: body.message,
        }),
      });

      const result = await response.json();

      console.log("[WhatsApp] Message sent to", body.phone, {
        success: result.success,
        detail: result.detail,
        product: productName,
      });

      return NextResponse.json({
        success: result.success,
        channel: "whatsapp",
        phone: body.phone,
        sent: result.success,
        detail: result.detail,
      });
    } catch (error) {
      console.error("[WhatsApp] Gateway call failed:", error);
      // Log the message so it's not lost
      console.log("[WhatsApp] Message that would have been sent:", {
        to: body.phone,
        product: productName,
        message: body.message,
      });
      return NextResponse.json({
        success: false,
        channel: "whatsapp",
        error: "WhatsApp Gateway call failed",
        logged: true,
      });
    }
  }

  // No WhatsApp gateway configured — log the notification
  console.log("[WhatsApp] Gateway not configured — logging notification:", {
    to: body.phone,
    customerName: body.customerName,
    amount: body.amount,
    currency: body.currency,
    txRef: body.txRef,
    message: body.message,
  });

  return NextResponse.json({
    success: true,
    channel: "whatsapp",
    phone: body.phone,
    sent: false,
    reason:
      "WhatsApp gateway not configured. Set WHATSAPP_GATEWAY_URL, WHATSAPP_GATEWAY_KEY, and WHATSAPP_PRODUCT_NAME in .env to enable.",
    logged: true,
  });
}

/**
 * Handle email notification.
 *
 * If EMAIL_API_URL is set, sends the email via the email service.
 * Otherwise, logs the email for development/testing.
 */
async function handleEmailNotification(body: {
  email?: string;
  customerName?: string;
  amount?: number;
  currency?: string;
  businessName?: string;
  txRef?: string;
  customSubject?: string;
  customBody?: string;
}): Promise<NextResponse> {
  const emailApiUrl = process.env.EMAIL_API_URL;

  if (!body.email) {
    console.log("[Email] No email provided — skipping email notification");
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "No email provided",
    });
  }

  const businessName =
    body.businessName ||
    process.env.NEXT_PUBLIC_BUSINESS_NAME ||
    "Our Store";
  const currencySymbol =
    body.currency === "ZAR" ? "R" : body.currency || "R";

  // Support custom subject/body for JVL and other non-customer emails
  const subject = body.customSubject || `${businessName} — Payment Confirmed`;
  const emailBodyText = body.customBody || `Hi ${body.customerName},

Your payment of ${currencySymbol} ${(body.amount || 0).toFixed(
    2
  )} has been received and confirmed.

Your product will be sent to you shortly. You will be informed with tracking details once it ships.

Order Reference: ${body.txRef}

Thank you for your order!

— ${businessName}`;

  const emailContent = {
    to: body.email,
    subject,
    body: emailBodyText,
  };

  if (emailApiUrl) {
    try {
      const response = await fetch(emailApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent),
      });

      console.log("[Email] Sent to", body.email, {
        status: response.status,
      });
      return NextResponse.json({
        success: true,
        channel: "email",
        email: body.email,
        sent: true,
      });
    } catch (error) {
      console.error("[Email] Failed:", error);
      console.log(
        "[Email] Content that would have been sent:",
        emailContent
      );
      return NextResponse.json({
        success: false,
        channel: "email",
        error: "Email API call failed",
        logged: true,
      });
    }
  }

  // No email service configured — log it
  console.log(
    "[Email] Service not configured — logging notification:",
    emailContent
  );

  return NextResponse.json({
    success: true,
    channel: "email",
    email: body.email,
    sent: false,
    reason:
      "Email service not configured. Set EMAIL_API_URL in .env to enable.",
    logged: true,
  });
}
