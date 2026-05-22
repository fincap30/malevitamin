import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/notify
 *
 * Handles post-payment notifications:
 * - WhatsApp messages to customers (via WhatsApp Business API)
 * - Email confirmations to customers
 *
 * When a payment is verified, the verify route calls this endpoint
 * to send notifications automatically.
 *
 * WHATSAPP INTEGRATION:
 * ====================
 * Set the WHATSAPP_API_URL environment variable to your WhatsApp agent endpoint.
 * The endpoint should accept:
 *   { phone: string, message: string, customerName: string, ... }
 *
 * If WHATSAPP_API_URL is not set, WhatsApp notifications are logged but not sent.
 * This allows the system to work without WhatsApp until you connect your agent.
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
 * Handle WhatsApp notification.
 *
 * If WHATSAPP_API_URL is set, sends the message via the WhatsApp agent.
 * Otherwise, logs the message for development/testing.
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
  const whatsappApiUrl = process.env.WHATSAPP_API_URL;
  const whatsappApiKey = process.env.WHATSAPP_API_KEY;

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

  // If WhatsApp agent is configured, send the message
  if (whatsappApiUrl) {
    try {
      const response = await fetch(whatsappApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(whatsappApiKey
            ? { Authorization: `Bearer ${whatsappApiKey}` }
            : {}),
        },
        body: JSON.stringify({
          phone: body.phone,
          message: body.message,
          customerName: body.customerName,
          amount: body.amount,
          currency: body.currency,
          txRef: body.txRef,
          transactionId: body.transactionId,
        }),
      });

      const result = await response.json();

      console.log("[WhatsApp] Message sent to", body.phone, {
        status: response.status,
        result,
      });

      return NextResponse.json({
        success: true,
        channel: "whatsapp",
        phone: body.phone,
        sent: true,
      });
    } catch (error) {
      console.error("[WhatsApp] Failed to send message:", error);
      // Log the message so it's not lost
      console.log("[WhatsApp] Message that would have been sent:", {
        to: body.phone,
        message: body.message,
      });
      return NextResponse.json({
        success: false,
        channel: "whatsapp",
        error: "WhatsApp API call failed",
        logged: true,
      });
    }
  }

  // No WhatsApp agent configured — log the notification
  console.log("[WhatsApp] Agent not configured — logging notification:", {
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
      "WhatsApp agent not configured. Set WHATSAPP_API_URL in .env to enable.",
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

  const businessName = body.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || "Our Store";
  const currencySymbol = body.currency === "ZAR" ? "R" : body.currency || "R";

  const emailContent = {
    to: body.email,
    subject: `${businessName} — Payment Confirmed`,
    body: `Hi ${body.customerName},

Your payment of ${currencySymbol} ${(body.amount || 0).toFixed(2)} has been received and confirmed.

Your product will be sent to you shortly. You will be informed with tracking details once it ships.

Order Reference: ${body.txRef}

Thank you for your order!

— ${businessName}`,
  };

  if (emailApiUrl) {
    try {
      const response = await fetch(emailApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent),
      });

      console.log("[Email] Sent to", body.email, { status: response.status });
      return NextResponse.json({
        success: true,
        channel: "email",
        email: body.email,
        sent: true,
      });
    } catch (error) {
      console.error("[Email] Failed:", error);
      console.log("[Email] Content that would have been sent:", emailContent);
      return NextResponse.json({
        success: false,
        channel: "email",
        error: "Email API call failed",
        logged: true,
      });
    }
  }

  // No email service configured — log it
  console.log("[Email] Service not configured — logging notification:", emailContent);

  return NextResponse.json({
    success: true,
    channel: "email",
    email: body.email,
    sent: false,
    reason: "Email service not configured. Set EMAIL_API_URL in .env to enable.",
    logged: true,
  });
}
