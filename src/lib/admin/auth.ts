// Admin authentication — minimal, dependency-free password protection.
//
// Strategy: a single shared admin password (ADMIN_PASSWORD env var). On login we
// verify the password and set an httpOnly session cookie whose value is a
// SHA-256 token derived from the password + a fixed salt. We never store the raw
// password in the cookie, and we recompute + compare the token on every request.
//
// Uses the Web Crypto API (crypto.subtle), which works in both the Node.js
// runtime and the Cloudflare Workers edge runtime.

import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mv_admin_session";
/** Session lifetime: 12 hours. */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

const TOKEN_SALT = "malevitamin::admin::v1";

/** The configured admin password (falls back to a clearly-insecure default). */
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "changeme";
}

/** True when a real admin password has been configured via the environment. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0);
}

/** Compute the opaque session token for a given password. */
export async function computeSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${TOKEN_SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The session token that corresponds to the currently-configured password. */
export async function expectedSessionToken(): Promise<string> {
  return computeSessionToken(getAdminPassword());
}

/** Constant-time-ish string comparison to avoid trivial timing leaks. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Validate a submitted password against the configured admin password. */
export function verifyPassword(submitted: string): boolean {
  const expected = getAdminPassword();
  if (!submitted) return false;
  return safeEqual(submitted, expected);
}

/**
 * Read the admin session cookie and confirm it matches the expected token.
 * Safe to call from server components and route handlers.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE)?.value;
    if (!token) return false;
    const expected = await expectedSessionToken();
    return safeEqual(token, expected);
  } catch {
    return false;
  }
}
