import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { formatPhone } from "@/lib/whatsapp/whatsapp-service";

/**
 * POST /api/whatsapp-webhook
 *
 * Receives incoming WhatsApp replies from the Universal WhatsApp Gateway.
 *
 * When a customer replies to a WhatsApp message sent from this site, the
 * gateway smart-routes the reply here. Replies are isolated per site — no
 * cross-site mixing.
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
 * Contract: the gateway requires a 200 response with `{ "received": true }`
 * within 15 seconds, otherwise it will retry. We therefore do the minimum
 * synchronous work (parse + persist), wrap every step defensively, and always
 * return 200 — even on internal failure — so the gateway never spam-retries.
 */

type IncomingMessage = {
  phone: string;
  message: string;
  fromName: string;
  messageId: string;
  timestamp: string;
};

/**
 * Lightweight keyword-based intent classifier. Mirrors the categories used by
 * the support flow so stored messages are immediately filterable.
 */
function classifyIntent(message: string): string {
  const m = message.toLowerCase().trim();

  if (!m) return "other";
  if (/(received|got it|delivered|arrived)/.test(m)) return "delivery_confirmation";
  if (/(where|tracking|track|status|order)/.test(m)) return "order_status";
  if (/(return|refund|complaint|problem|broken|wrong|damaged)/.test(m))
    return "complaint_return";
  if (/(stop|unsubscribe|opt out|opt-out|no more)/.test(m)) return "opt_out";
  if (/^(hi|hello|hey|good (morning|afternoon|evening)|howzit|molo)\b/.test(m))
    return "greeting";
  return "other";
}

/** Parse a timestamp string into a Date, falling back to null on bad input. */
function parseTimestamp(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Persist the inbound message. Wrapped so a DB failure (e.g. on an ephemeral
 * runtime without a writable DB) never blocks the required 200 response.
 * De-duplicates on `messageId` when the gateway supplies one.
 */
async function persistMessage(msg: IncomingMessage, intent: string): Promise<void> {
  try {
    if (msg.messageId) {
      const existing = await db.whatsAppMessage.findFirst({
        where: { messageId: msg.messageId },
        select: { id: true },
      });
      if (existing) {
        console.log("[WhatsApp Webhook] Duplicate messageId, skipping:", msg.messageId);
        return;
      }
    }

    await db.whatsAppMessage.create({
      data: {
        phone: formatPhone(msg.phone) || msg.phone,
        fromName: msg.fromName || null,
        message: msg.message,
        messageId: msg.messageId || null,
        intent,
        direction: "inbound",
        sentAt: parseTimestamp(msg.timestamp),
      },
    });
    console.log("[WhatsApp Webhook] Logged inbound message to DB:", {
      phone: msg.phone,
      intent,
    });
  } catch (error) {
    // Never let persistence failure break the webhook contract.
    console.error("[WhatsApp Webhook] Failed to persist message:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json().catch(() => ({}));

    const msg: IncomingMessage = {
      phone: data.phone || "unknown",
      message: typeof data.message === "string" ? data.message : "",
      fromName: data.from_name || data.fromName || "Unknown",
      messageId: data.messageId || data.message_id || "",
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const intent = classifyIntent(msg.message);

    console.log("[WhatsApp Webhook] Incoming reply:", {
      from: msg.fromName,
      phone: msg.phone,
      message: msg.message,
      messageId: msg.messageId,
      timestamp: msg.timestamp,
      intent,
    });

    // Persist for follow-up / auditing. Defensive — never throws.
    await persistMessage(msg, intent);

    // Acknowledge receipt — the gateway requires a 200 within 15s.
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WhatsApp Webhook] Error processing reply:", error);
    // Still return 200 so the gateway does not retry indefinitely.
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
