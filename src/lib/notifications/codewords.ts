// CodeWords Transaction Notifier client.
//
// One hub call replaces the old direct SMTP + WhatsApp fan-out. On every
// successful payment it:
//   - emails a branded receipt to the customer
//   - WhatsApps a confirmation to the customer
//   - alerts the whole team via WhatsApp (CODEWORDS_OWNER_PHONES)
//   - alerts the whole team via email (CODEWORDS_OWNER_EMAILS)
//   - logs the sale to Google Sheets
//
// API contract (OpenAPI "Transaction Hub" v2.0.0):
//   POST {CODEWORDS_ENDPOINT}
//   Authorization: Bearer {CODEWORDS_API_KEY}
//   body: TransactionInput (see below)
//
// This module never throws — failures are reported in the result so a single
// notification failure can never lose or block a confirmed sale.

/** Payload accepted by the CodeWords Transaction Hub. */
export interface CodeWordsTransactionInput {
  customer_name: string;
  customer_email: string;
  amount: number;
  currency?: string;
  reference?: string | null;
  description?: string | null;
  /** YYYY-MM-DD */
  transaction_date?: string | null;
  /** International format, NO leading "+". */
  customer_phone?: string | null;
  business_name?: string | null;
  logo_url?: string | null;
  /** Team WhatsApp numbers (international, no +). */
  owner_phones?: string[] | null;
  /** Team email addresses. */
  owner_emails?: string[] | null;
}

/** Response returned by the CodeWords Transaction Hub. */
export interface CodeWordsTransactionResult {
  customer_email_sent: boolean;
  owner_email_sent: boolean;
  whatsapp_sent: boolean;
  sheet_logged: boolean;
  owner_phones_notified: number;
  owner_emails_sent: number;
  sheet_url?: string | null;
  reference?: string | null;
  message: string;
}

export interface CodeWordsSendOutcome {
  /** True when the hub was reached and reported a result. */
  ok: boolean;
  /** True when the hub call was skipped because it is not configured. */
  skipped: boolean;
  reason?: string;
  result?: CodeWordsTransactionResult;
}

/**
 * Normalize a phone number to international format with NO leading "+".
 * Handles common South African inputs:
 *   "+27 83 390 7059" -> "27833907059"
 *   "0833907059"      -> "27833907059"
 *   "27833907059"     -> "27833907059"
 */
export function normalizePhone(
  raw: string | undefined | null,
  defaultCountryCode = "27"
): string | undefined {
  if (!raw) return undefined;
  // Keep digits only (drops "+", spaces, dashes, parentheses).
  let digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  // Local SA number starting with 0 -> swap leading 0 for country code.
  if (digits.startsWith("0")) {
    digits = defaultCountryCode + digits.slice(1);
  }
  return digits;
}

/** Parse a comma-separated env list into a clean string array. */
function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** True when the CodeWords notifier has the minimum config to run. */
export function isCodeWordsConfigured(): boolean {
  return Boolean(process.env.CODEWORDS_API_KEY && process.env.CODEWORDS_ENDPOINT);
}

/**
 * Send a transaction to the CodeWords hub.
 *
 * `owner_phones` / `owner_emails` default to the team lists in the
 * environment, and `business_name` / `logo_url` default to the configured
 * brand — callers only need to supply the customer + amount fields.
 */
export async function sendTransactionNotification(
  input: CodeWordsTransactionInput
): Promise<CodeWordsSendOutcome> {
  const endpoint = process.env.CODEWORDS_ENDPOINT;
  const apiKey = process.env.CODEWORDS_API_KEY;

  if (!endpoint || !apiKey) {
    console.log(
      "[CodeWords] Not configured — logging transaction instead:",
      {
        customer: input.customer_name,
        email: input.customer_email,
        amount: input.amount,
        reference: input.reference,
      }
    );
    return {
      ok: false,
      skipped: true,
      reason:
        "CodeWords not configured. Set CODEWORDS_API_KEY and CODEWORDS_ENDPOINT.",
    };
  }

  // Apply brand + team defaults from the environment.
  const ownerPhones =
    input.owner_phones ?? parseList(process.env.CODEWORDS_OWNER_PHONES);
  const ownerEmails =
    input.owner_emails ?? parseList(process.env.CODEWORDS_OWNER_EMAILS);

  const payload: CodeWordsTransactionInput = {
    ...input,
    currency: input.currency || process.env.NEXT_PUBLIC_CURRENCY || "ZAR",
    business_name:
      input.business_name ||
      process.env.CODEWORDS_BUSINESS_NAME ||
      process.env.NEXT_PUBLIC_BUSINESS_NAME ||
      "Male Vitamin",
    logo_url: input.logo_url || process.env.CODEWORDS_LOGO_URL || undefined,
    customer_phone: normalizePhone(input.customer_phone),
    owner_phones: ownerPhones.length ? ownerPhones : undefined,
    owner_emails: ownerEmails.length ? ownerEmails : undefined,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[CodeWords] Hub returned an error", {
        status: response.status,
        body: text.slice(0, 500),
      });
      return {
        ok: false,
        skipped: false,
        reason: `CodeWords HTTP ${response.status}`,
      };
    }

    const result = (await response.json()) as CodeWordsTransactionResult;
    console.log("[CodeWords] Transaction processed:", {
      reference: result.reference,
      customer_email_sent: result.customer_email_sent,
      whatsapp_sent: result.whatsapp_sent,
      owner_phones_notified: result.owner_phones_notified,
      owner_emails_sent: result.owner_emails_sent,
      sheet_logged: result.sheet_logged,
      message: result.message,
    });

    return { ok: true, skipped: false, result };
  } catch (error) {
    console.error("[CodeWords] Hub call failed:", error);
    return {
      ok: false,
      skipped: false,
      reason: "CodeWords hub call failed (network error)",
    };
  }
}
