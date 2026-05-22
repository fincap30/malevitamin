import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/whatsapp-webhook
 *
 * Receives incoming WhatsApp replies from the Universal WhatsApp Gateway.
 *
 * When a customer replies to a WhatsApp message sent from this site,
 * the gateway smart-routes the reply here. Replies are isolated per site —
 * no cross-site mixing.
 *
 * Incoming payload from gateway:
 *   {
 *     "phone": "+27831234567",
 *     "message": "Yes I want to book",
 *     "messageId": "3EB0487AF93A...",
 *     "timestamp": "2026-05-22T08:15:00Z",
 *     "from_name": "Johan Botha"
 *   }
 *
 * Use this webhook to:
 * - Log customer replies for follow-up
 * - Trigger auto-responses
 * - Update order status based on customer input
 * - Store conversation history in your database
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const phone = data.phone || "unknown";
    const message = data.message || "";
    const fromName = data.from_name || "Unknown";
    const messageId = data.messageId || "";
    const timestamp = data.timestamp || new Date().toISOString();

    console.log("[WhatsApp Webhook] Incoming reply:", {
      from: fromName,
      phone,
      message,
      messageId,
      timestamp,
    });

    // --- Handle common customer replies ---
    const lowerMessage = message.toLowerCase().trim();

    // Customer confirming they received the product
    if (
      lowerMessage.includes("received") ||
      lowerMessage.includes("got it") ||
      lowerMessage.includes("delivered")
    ) {
      console.log(
        `[WhatsApp] Customer ${fromName} (${phone}) confirmed delivery`
      );
      // TODO: Update order status in database
    }

    // Customer asking about their order
    if (
      lowerMessage.includes("where") ||
      lowerMessage.includes("tracking") ||
      lowerMessage.includes("status") ||
      lowerMessage.includes("order")
    ) {
      console.log(
        `[WhatsApp] Customer ${fromName} (${phone}) asking about order status`
      );
      // TODO: Look up order and auto-reply with tracking info
    }

    // Customer wanting to return or complain
    if (
      lowerMessage.includes("return") ||
      lowerMessage.includes("refund") ||
      lowerMessage.includes("complaint") ||
      lowerMessage.includes("problem")
    ) {
      console.log(
        `[WhatsApp] Customer ${fromName} (${phone}) has a complaint/return request`
      );
      // TODO: Alert support team
    }

    // Acknowledge receipt — the gateway requires a 200 response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WhatsApp Webhook] Error processing reply:", error);
    // Still return 200 so the gateway doesn't retry
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}

/**
 * GET /api/whatsapp-webhook
 *
 * Health check endpoint. Can be used to verify the webhook is live.
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    product: process.env.WHATSAPP_PRODUCT_NAME || "not configured",
    message: "WhatsApp webhook is ready to receive replies",
  });
}
