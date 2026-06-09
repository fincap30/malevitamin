// Notification service — orchestrates the post-payment fan-out.
//
// Channels (each best-effort and isolated so one failure never blocks others):
//   1. WhatsApp to customer        — confirmation + delivery.
//   2. WhatsApp to every partner    — JVL contacts (Nico, Ana, Chalyn, Jacques).
//   3. WhatsApp to owner            — full details + both shares.
//   4. Email to partner sale inbox  — JVL settlement.
//   5. Email to owner sale inbox    — both shares.
//   6. Email to customer            — confirmation.
//
// Calls the WhatsApp / email libs directly (no server-to-server self-fetch),
// and returns a structured summary the caller can persist on the order.

import type { CustomerInfo, SplitBreakdown } from "@/lib/payment/types";
import { sendWhatsApp } from "./whatsapp";
import { sendEmail } from "./email";
import {
  buildCustomerWhatsAppMessage,
  buildOwnerWhatsAppMessage,
  buildPartnerWhatsAppMessage,
  type OrderMessageContext,
} from "./messages";
import {
  buildCustomerEmail,
  buildOwnerEmail,
  buildPartnerEmail,
} from "./emails";

export interface NotifyOrderInput {
  customer: CustomerInfo;
  amount: number;
  currency: string;
  txRef: string;
  transactionId?: string | number;
  split: SplitBreakdown;
}

export interface NotificationSummary {
  /** True only if every attempted channel reported success. */
  allSent: boolean;
  /** Per-channel outcome lines for auditing / persistence. */
  log: string[];
}

export async function notifyOrder(
  input: NotifyOrderInput
): Promise<NotificationSummary> {
  const businessName =
    process.env.NEXT_PUBLIC_BUSINESS_NAME || "Our Store";
  const currencySymbol = input.currency === "ZAR" ? "R" : input.currency;

  const ctx: OrderMessageContext = {
    customerName: input.customer.customerName,
    customerEmail: input.customer.customerEmail,
    customerPhone: input.customer.customerPhone || "Not provided",
    customerAddress: input.customer.customerAddress,
    deliveryOption: input.customer.deliveryOption,
    amount: input.amount,
    currencySymbol,
    txRef: input.txRef,
    productName: businessName,
    split: input.split,
  };

  const log: string[] = [];
  let allSent = true;

  const record = (channel: string, target: string, ok: boolean, reason?: string) => {
    if (!ok) allSent = false;
    log.push(
      `${ok ? "OK" : "FAIL"} ${channel} -> ${target}${reason ? ` (${reason})` : ""}`
    );
  };

  // 1. Customer WhatsApp
  if (input.customer.customerPhone) {
    const r = await sendWhatsApp({
      phone: input.customer.customerPhone,
      message: buildCustomerWhatsAppMessage(ctx),
      context: { txRef: input.txRef, audience: "customer" },
    });
    record("whatsapp", "customer", r.sent, r.reason);
  }

  // 2. Partner (JVL) WhatsApp — every configured contact
  const partnerPhones = [
    process.env.JVL_PHONE_NICO,
    process.env.JVL_PHONE_ANA,
    process.env.JVL_PHONE_CHALYN,
    process.env.JVL_PHONE_JACQUES,
  ].filter(Boolean) as string[];

  if (partnerPhones.length > 0) {
    const partnerMsg = buildPartnerWhatsAppMessage(ctx);
    for (const phone of partnerPhones) {
      const r = await sendWhatsApp({
        phone,
        message: partnerMsg,
        context: { txRef: input.txRef, audience: "partner" },
      });
      record("whatsapp", `partner:${phone}`, r.sent, r.reason);
    }
  }

  // 3. Owner WhatsApp
  if (process.env.OWNER_PHONE) {
    const r = await sendWhatsApp({
      phone: process.env.OWNER_PHONE,
      message: buildOwnerWhatsAppMessage(ctx),
      context: { txRef: input.txRef, audience: "owner" },
    });
    record("whatsapp", "owner", r.sent, r.reason);
  }

  // 4. Partner (JVL) sale email
  if (process.env.JVL_SALE_EMAIL) {
    const email = buildPartnerEmail(ctx);
    const r = await sendEmail({ to: process.env.JVL_SALE_EMAIL, ...email });
    record("email", "partner", r.sent, r.reason);
  }

  // 5. Owner sale email
  if (process.env.OWNER_SALE_EMAIL) {
    const email = buildOwnerEmail(ctx);
    const r = await sendEmail({ to: process.env.OWNER_SALE_EMAIL, ...email });
    record("email", "owner", r.sent, r.reason);
  }

  // 6. Customer email
  if (input.customer.customerEmail) {
    const email = buildCustomerEmail(ctx);
    const r = await sendEmail({ to: input.customer.customerEmail, ...email });
    record("email", "customer", r.sent, r.reason);
  }

  console.log("[NotificationService] Summary:", { allSent, log });
  return { allSent, log };
}
