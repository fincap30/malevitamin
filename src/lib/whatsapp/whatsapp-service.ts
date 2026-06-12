// WhatsApp service — outbound sending via the CodeWords Universal WhatsApp Gateway.
//
// This is the single, canonical helper for sending a WhatsApp message from the
// MaleVitamin site. It posts to the gateway's send endpoint and reports the
// outcome without ever throwing, so a failed send can never crash a checkout,
// a webhook, or a notification fan-out.
//
// The gateway automatically prefixes every message with the site's icon and
// display name (e.g. "💪 MaleVitamin:"). Do NOT add that prefix in `message`.
//
// Environment variables:
//   WHATSAPP_GATEWAY_URL  - Gateway send endpoint (POST base URL)
//   WHATSAPP_AUTH_TOKEN   - Bearer token for auth (WHATSAPP_GATEWAY_KEY also accepted)
//   WHATSAPP_PRODUCT_NAME - Registered site name (must match gateway registration)

export interface SendWhatsAppResult {
  /** True when the gateway accepted and reported a successful send. */
  success: boolean;
  /** True when a request was actually dispatched to the gateway. */
  sent: boolean;
  /** Human-readable reason when not sent / failed. */
  reason?: string;
  /** Raw detail string returned by the gateway, when available. */
  detail?: string;
  /** The normalized phone the message was addressed to. */
  phone?: string;
}

/** Default product/site name if the env var is not set. */
const DEFAULT_PRODUCT_NAME = "malevitamin";

/**
 * Normalize a phone number to international format with a leading "+".
 *
 * The gateway expects E.164-style numbers (e.g. "+27833907059"). Handles the
 * common South African input shapes:
 *   "+27 83 390 7059" -> "+27833907059"
 *   "0833907059"      -> "+27833907059"
 *   "27833907059"     -> "+27833907059"
 *   "833907059"       -> "+27833907059"  (assumes SA, 9 local digits)
 *
 * Returns `undefined` when the input has no usable digits.
 */
export function formatPhone(
  raw: string | undefined | null,
  defaultCountryCode = "27"
): string | undefined {
  if (!raw) return undefined;

  const hadPlus = raw.trim().startsWith("+");
  // Keep digits only (drops "+", spaces, dashes, parentheses).
  let digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;

  if (hadPlus) {
    // Already an international number with an explicit "+".
    return `+${digits}`;
  }

  // Local SA number starting with 0 -> swap leading 0 for the country code.
  if (digits.startsWith("0")) {
    digits = defaultCountryCode + digits.slice(1);
  } else if (digits.length <= 9) {
    // Bare local subscriber number (no country code, no leading 0).
    digits = defaultCountryCode + digits;
  }
  // Otherwise assume the country code is already present.

  return `+${digits}`;
}

/**
 * Basic sanity check that a normalized number looks like a real phone number.
 * Requires a country code + subscriber number (10–15 digits total per E.164).
 */
export function isValidPhone(phone: string | undefined): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Send a single WhatsApp message via the Universal Gateway.
 *
 * @param phone   Recipient number (any common SA format; normalized internally).
 * @param message Message body. Do NOT include the "💪 MaleVitamin:" prefix —
 *                the gateway adds it automatically.
 *
 * Never throws. Inspect the returned `success` / `sent` flags for the outcome.
 */
export async function send_whatsapp(
  phone: string | undefined | null,
  message: string
): Promise<SendWhatsAppResult> {
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
  const authToken =
    process.env.WHATSAPP_AUTH_TOKEN || process.env.WHATSAPP_GATEWAY_KEY;
  const productName = process.env.WHATSAPP_PRODUCT_NAME || DEFAULT_PRODUCT_NAME;

  // --- Input validation -----------------------------------------------------
  if (!message || !message.trim()) {
    return { success: false, sent: false, reason: "Empty message" };
  }

  const formattedPhone = formatPhone(phone);
  if (!formattedPhone || !isValidPhone(formattedPhone)) {
    return {
      success: false,
      sent: false,
      reason: `Invalid or missing phone number: ${String(phone)}`,
    };
  }

  // --- Configuration guard ---------------------------------------------------
  if (!gatewayUrl || !authToken) {
    console.log("[WhatsApp] Gateway not configured — message not sent:", {
      to: formattedPhone,
      message,
    });
    return {
      success: false,
      sent: false,
      phone: formattedPhone,
      reason:
        "WhatsApp gateway not configured. Set WHATSAPP_GATEWAY_URL and WHATSAPP_AUTH_TOKEN.",
    };
  }

  // --- Dispatch --------------------------------------------------------------
  try {
    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        phone: formattedPhone,
        product: productName,
        message,
      }),
    });

    const result = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      detail?: string;
    };

    if (!response.ok) {
      console.error("[WhatsApp] Gateway returned an error", {
        status: response.status,
        detail: result.detail,
        to: formattedPhone,
      });
      return {
        success: false,
        sent: true,
        phone: formattedPhone,
        detail: result.detail,
        reason: `Gateway HTTP ${response.status}`,
      };
    }

    const success = Boolean(result.success);
    console.log("[WhatsApp] Message dispatched", {
      to: formattedPhone,
      product: productName,
      success,
      detail: result.detail,
    });

    return {
      success,
      sent: true,
      phone: formattedPhone,
      detail: result.detail,
      reason: success ? undefined : result.detail || "Gateway reported failure",
    };
  } catch (error) {
    console.error("[WhatsApp] Gateway call failed:", error);
    return {
      success: false,
      sent: false,
      phone: formattedPhone,
      reason: "WhatsApp gateway call failed (network error)",
    };
  }
}
