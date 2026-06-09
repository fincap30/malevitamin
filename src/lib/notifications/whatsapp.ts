// WhatsApp sender — core logic for the Universal WhatsApp Gateway.
//
// This is the single place that talks to the gateway. It is called both by
// the /api/payment/notify route and directly by the notification service,
// so there is no fragile server-to-server self-fetch.
//
// Gateway: sends from Sitewizard, messages appear as: 🔔 {product}: {message}
// Env vars:
//   WHATSAPP_GATEWAY_URL  - Gateway endpoint
//   WHATSAPP_GATEWAY_KEY  - Bearer token for auth
//   WHATSAPP_PRODUCT_NAME - Registered site name (must match gateway registration)

export interface SendWhatsAppInput {
  phone?: string;
  message: string;
  /** Optional context, used only for logging when the gateway is unconfigured. */
  context?: Record<string, unknown>;
}

export interface SendResult {
  success: boolean;
  sent: boolean;
  channel: "whatsapp";
  reason?: string;
  detail?: unknown;
}

/**
 * Send a single WhatsApp message via the gateway.
 *
 * Never throws — failures are caught and reported in the result so a single
 * failed recipient cannot abort the rest of the notification fan-out.
 */
export async function sendWhatsApp(input: SendWhatsAppInput): Promise<SendResult> {
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
  const gatewayKey = process.env.WHATSAPP_GATEWAY_KEY;
  const productName = process.env.WHATSAPP_PRODUCT_NAME;

  if (!input.phone) {
    return {
      success: true,
      sent: false,
      channel: "whatsapp",
      reason: "No phone number provided",
    };
  }

  // Gateway not configured — log so the message is not silently lost.
  if (!gatewayUrl || !gatewayKey || !productName) {
    console.log("[WhatsApp] Gateway not configured — logging notification:", {
      to: input.phone,
      message: input.message,
      ...input.context,
    });
    return {
      success: true,
      sent: false,
      channel: "whatsapp",
      reason:
        "WhatsApp gateway not configured. Set WHATSAPP_GATEWAY_URL, WHATSAPP_GATEWAY_KEY, and WHATSAPP_PRODUCT_NAME.",
    };
  }

  try {
    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gatewayKey}`,
      },
      body: JSON.stringify({
        phone: input.phone,
        product: productName,
        message: input.message,
      }),
    });

    const result = await response.json().catch(() => ({}));
    console.log("[WhatsApp] Message sent to", input.phone, {
      success: result.success,
      detail: result.detail,
      product: productName,
    });

    return {
      success: Boolean(result.success),
      sent: Boolean(result.success),
      channel: "whatsapp",
      detail: result.detail,
    };
  } catch (error) {
    console.error("[WhatsApp] Gateway call failed:", error);
    console.log("[WhatsApp] Message that would have been sent:", {
      to: input.phone,
      product: productName,
      message: input.message,
    });
    return {
      success: false,
      sent: false,
      channel: "whatsapp",
      reason: "WhatsApp gateway call failed",
    };
  }
}
