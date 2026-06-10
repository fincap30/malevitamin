import { NextRequest, NextResponse } from "next/server";

/**
 * Bidirectional WhatsApp endpoint for Male Vitamin.
 *
 * POST /api/whatsapp
 *   Receives inbound WhatsApp messages routed from the bidirectional gateway
 *   when a customer replies to a notification. Replies are isolated per site,
 *   so only messages for this product (WHATSAPP_PRODUCT_NAME) arrive here.
 *
 * GET /api/whatsapp
 *   Lightweight health check + webhook-verification handshake.
 *
 * Expected inbound payload (gateway -> us):
 *   {
 *     "phone":     "27831234567",       // international, may include +
 *     "message":   "Yes I want to book",
 *     "messageId": "3EB0487AF93A...",
 *     "timestamp": "2026-06-10T08:15:00Z",
 *     "from_name": "Johan Botha",
 *     "product":   "Male Vitamin"        // optional, gateway-supplied
 *   }
 *
 * The handler classifies the reply (delivery confirmation, order/tracking
 * query, complaint/return, opt-out) so downstream automation or a human agent
 * can follow up. It always returns HTTP 200 so the gateway never retries.
 */

type ReplyIntent =
  | "delivery_confirmation"
  | "order_status"
  | "complaint_return"
  | "opt_out"
  | "greeting"
  | "other";

function classifyMessage(message: string): ReplyIntent {
  const text = message.toLowerCase().trim();

  if (!text) return "other";

  if (/(stop|unsubscribe|opt[\s-]?out|do not contact)/.test(text)) {
    return "opt_out";
  }
  if (/(received|got it|delivered|arrived|thank)/.test(text)) {
    return "delivery_confirmation";
  }
  if (/(return|refund|complaint|complain|problem|broken|wrong|damaged)/.test(text)) {
    return "complaint_return";
  }
  if (/(where|tracking|track|status|order|delivery|when|shipped|dispatch)/.test(text)) {
    return "order_status";
  }
  if (/^(hi|hello|hey|good (morning|afternoon|evening)|howzit)\b/.test(text)) {
    return "greeting";
  }
  return "other";
}

/** Optional shared-secret check (set WHATSAPP_WEBHOOK_SECRET to enable). */
function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.WHATSAPP_WEBHOOK_SECRET;
  if (!expected) return true; // no secret configured -> open (gateway-trusted)

  const header =
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  return header === expected;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      // Still 200 so the gateway does not hammer retries, but flag it.
      console.warn("[WhatsApp] Inbound rejected — bad/missing webhook secret");
      return NextResponse.json({ received: true, authorized: false });
    }

    const data = await request.json().catch(() => ({} as Record<string, unknown>));

    const phone = String(data.phone || data.from || "unknown");
    const message = String(data.message || data.text || "");
    const fromName = String(data.from_name || data.name || "Unknown");
    const messageId = String(data.messageId || data.id || "");
    const timestamp = String(data.timestamp || new Date().toISOString());
    const product = String(
      data.product || process.env.WHATSAPP_PRODUCT_NAME || "Male Vitamin"
    );

    const intent = classifyMessage(message);

    console.log("[WhatsApp] Inbound reply:", {
      product,
      from: fromName,
      phone,
      message,
      messageId,
      timestamp,
      intent,
    });

    // --- React to the classified intent -------------------------------------
    // These are intentionally side-effect-light hooks. Wire them up to the
    // order DB / CRM / human-handoff as those systems come online.
    switch (intent) {
      case "delivery_confirmation":
        console.log(`[WhatsApp] ${fromName} (${phone}) confirmed delivery.`);
        break;
      case "order_status":
        console.log(`[WhatsApp] ${fromName} (${phone}) is asking about their order.`);
        break;
      case "complaint_return":
        console.log(
          `[WhatsApp] ${fromName} (${phone}) raised a complaint/return — needs human follow-up.`
        );
        break;
      case "opt_out":
        console.log(`[WhatsApp] ${fromName} (${phone}) requested opt-out.`);
        break;
      case "greeting":
        console.log(`[WhatsApp] ${fromName} (${phone}) sent a greeting.`);
        break;
      default:
        console.log(`[WhatsApp] ${fromName} (${phone}) sent a general message.`);
    }

    // The gateway requires a prompt 200. Echo the parsed intent for debugging.
    return NextResponse.json({ received: true, intent });
  } catch (error) {
    console.error("[WhatsApp] Error processing inbound message:", error);
    // Still 200 so the gateway does not retry indefinitely.
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}

export async function GET(request: NextRequest) {
  // Some gateways perform a verification handshake by echoing a challenge.
  const challenge = request.nextUrl.searchParams.get("challenge");
  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({
    status: "active",
    product: process.env.WHATSAPP_PRODUCT_NAME || "Male Vitamin",
    message: "WhatsApp inbound webhook is ready to receive replies",
  });
}
