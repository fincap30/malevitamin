// Flutterwave webhook signature verification.
//
// Flutterwave signs webhook calls by sending a `verif-hash` header that must
// equal the secret hash you configure in the Flutterwave dashboard. Comparing
// them prevents spoofed payment notifications.
//
// Set FLUTTERWAVE_WEBHOOK_HASH in the environment to the same secret hash
// configured in the dashboard. If it is not set, verification fails closed.
//
// Usage (in a future /api/payment/webhook route):
//   const signature = request.headers.get("verif-hash");
//   if (!verifyWebhookSignature(signature)) return 401;

import crypto from "crypto";

export const FLUTTERWAVE_SIGNATURE_HEADER = "verif-hash";

/**
 * Verify the `verif-hash` header against the configured secret hash.
 * Uses a constant-time comparison to avoid timing attacks.
 *
 * Fails closed: returns false when either the header or the secret is missing.
 */
export function verifyWebhookSignature(
  signature: string | null | undefined
): boolean {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;

  if (!secretHash) {
    console.error(
      "[Webhook] FLUTTERWAVE_WEBHOOK_HASH is not set — rejecting webhook."
    );
    return false;
  }
  if (!signature) {
    console.warn("[Webhook] Missing verif-hash header — rejecting webhook.");
    return false;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(secretHash);
  if (a.length !== b.length) return false;

  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
