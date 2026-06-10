// Notification service — orchestrates the post-payment fan-out.
//
// As of the CodeWords integration this is a thin wrapper over the CodeWords
// Transaction Hub. A single hub call now handles every channel that used to be
// fanned out by hand:
//   - Customer receipt email
//   - Customer WhatsApp confirmation
//   - Team WhatsApp alerts (all numbers in CODEWORDS_OWNER_PHONES)
//   - Team email alerts (all addresses in CODEWORDS_OWNER_EMAILS)
//   - Google Sheets logging
//
// The public surface (`notifyOrder` + `NotificationSummary`) is unchanged so
// callers such as /api/payment/verify need no modification.

import type { CustomerInfo, SplitBreakdown } from "@/lib/payment/types";
import {
  sendTransactionNotification,
  isCodeWordsConfigured,
} from "./codewords";

export interface NotifyOrderInput {
  customer: CustomerInfo;
  amount: number;
  currency: string;
  txRef: string;
  transactionId?: string | number;
  split: SplitBreakdown;
}

export interface NotificationSummary {
  /** True only if the notification hub reported success. */
  allSent: boolean;
  /** Per-channel outcome lines for auditing / persistence. */
  log: string[];
}

/** Human-readable delivery descriptor used in the receipt description. */
function describeDelivery(option: CustomerInfo["deliveryOption"]): string {
  return option === "speed" ? "Speed delivery (1-2 days)" : "Normal delivery (5-7 days)";
}

export async function notifyOrder(
  input: NotifyOrderInput
): Promise<NotificationSummary> {
  const businessName =
    process.env.CODEWORDS_BUSINESS_NAME ||
    process.env.NEXT_PUBLIC_BUSINESS_NAME ||
    "Male Vitamin";

  const log: string[] = [];

  // Build a clear description for the receipt / sheet row.
  const delivery = describeDelivery(input.customer.deliveryOption);
  const description = `${businessName} order — ${delivery}. Address: ${input.customer.customerAddress}`;

  // Transaction date in YYYY-MM-DD (hub expects this format).
  const transactionDate = new Date().toISOString().slice(0, 10);

  if (!isCodeWordsConfigured()) {
    log.push(
      "SKIP codewords -> not configured (set CODEWORDS_API_KEY, CODEWORDS_ENDPOINT)"
    );
    console.warn("[NotificationService] CodeWords not configured — nothing sent.");
    return { allSent: false, log };
  }

  const outcome = await sendTransactionNotification({
    customer_name: input.customer.customerName,
    customer_email: input.customer.customerEmail,
    customer_phone: input.customer.customerPhone,
    amount: input.amount,
    currency: input.currency,
    reference: input.txRef,
    description,
    transaction_date: transactionDate,
    // business_name, logo_url, owner_phones, owner_emails fall back to env
    // defaults inside the CodeWords client.
  });

  let allSent = false;

  if (outcome.skipped) {
    log.push(`SKIP codewords -> ${outcome.reason ?? "skipped"}`);
  } else if (!outcome.ok || !outcome.result) {
    log.push(`FAIL codewords -> ${outcome.reason ?? "unknown error"}`);
  } else {
    const r = outcome.result;
    log.push(`OK codewords customer-email -> ${r.customer_email_sent}`);
    log.push(`OK codewords customer-whatsapp -> ${r.whatsapp_sent}`);
    log.push(`OK codewords team-whatsapp -> ${r.owner_phones_notified} notified`);
    log.push(`OK codewords team-email -> ${r.owner_emails_sent} sent`);
    log.push(`OK codewords sheet-logged -> ${r.sheet_logged}`);
    if (r.sheet_url) log.push(`INFO codewords sheet-url -> ${r.sheet_url}`);
    log.push(`INFO codewords message -> ${r.message}`);

    // Consider it "all sent" if the customer receipt + at least one team
    // channel succeeded.
    allSent =
      r.customer_email_sent &&
      (r.owner_phones_notified > 0 || r.owner_emails_sent > 0);
  }

  console.log("[NotificationService] Summary:", { allSent, log });
  return { allSent, log };
}
