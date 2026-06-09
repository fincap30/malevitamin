// WhatsApp message builders.
//
// Three audiences with different visibility of the money split:
//   - Customer: payment confirmation + delivery only (no split figures).
//   - Partner (JVL): client particulars + order + ONLY their own settlement.
//   - Owner: full transaction details + BOTH shares.
//
// "Sitewizard" is used as the processing-agent name and "payment gateway"
// instead of "Flutterwave" in partner/customer-facing copy.

import type { SplitBreakdown } from "@/lib/payment/types";
import {
  deliveryLabel,
  getOwnerBankDetails,
  getPartnerBankDetails,
} from "./bank-details";

export interface OrderMessageContext {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  deliveryOption: string;
  amount: number;
  currencySymbol: string;
  txRef: string;
  productName: string;
  split: SplitBreakdown;
}

/** Customer WhatsApp — confirmation + delivery details only. */
export function buildCustomerWhatsAppMessage(ctx: OrderMessageContext): string {
  return [
    `✅ Payment Confirmed!`,
    ``,
    `Hi ${ctx.customerName},`,
    ``,
    `Your payment of *${ctx.currencySymbol} ${ctx.amount.toFixed(2)}* has been received and confirmed.`,
    ``,
    `📦 Deliver to:`,
    `${ctx.customerAddress}`,
    `🚚 ${deliveryLabel(ctx.deliveryOption)}`,
    ``,
    `Your product will be sent to you shortly. You will be informed with tracking details once it ships.`,
    ``,
    `Ref: ${ctx.txRef}`,
    ``,
    `Thank you for your order!`,
  ].join("\n");
}

/** Partner (JVL) WhatsApp — client particulars + only JVL's settlement. */
export function buildPartnerWhatsAppMessage(ctx: OrderMessageContext): string {
  const bank = getPartnerBankDetails();
  return [
    `🛒 NEW ORDER — ${ctx.productName}`,
    ``,
    `━━━ CLIENT PARTICULARS ━━━`,
    `👤 Name: ${ctx.customerName}`,
    `📞 Phone: ${ctx.customerPhone}`,
    `📧 Email: ${ctx.customerEmail}`,
    `📍 Address: ${ctx.customerAddress}`,
    ``,
    `━━━ ORDER DETAILS ━━━`,
    `Product: ${ctx.productName}`,
    `Amount Paid: ${ctx.currencySymbol} ${ctx.amount.toFixed(2)}`,
    `Delivery: ${deliveryLabel(ctx.deliveryOption)}`,
    `Reference: ${ctx.txRef}`,
    `Processed by: Sitewizard`,
    ``,
    `━━━ JVL SETTLEMENT ━━━`,
    `JVL Share (75% of product after fees): ${ctx.currencySymbol} ${ctx.split.partnerGrossShare.toFixed(2)}`,
    `Plus delivery fee (full): +${ctx.currencySymbol} ${ctx.split.deliveryFee.toFixed(2)}`,
    `Payment gateway fee deducted from total: -${ctx.currencySymbol} ${ctx.split.flutterwaveFee.toFixed(2)}`,
    ``,
    `💰 TOTAL TO JVL ACCOUNT: ${ctx.currencySymbol} ${ctx.split.partnerNetShare.toFixed(2)}`,
    `   (75% of product + full delivery — auto-split by payment gateway)`,
    `  ➤ Bank: ${bank.bank} | ${bank.accountName}`,
    `  ➤ Account: ${bank.accountNumber} | Branch: ${bank.branch}`,
    ``,
    `━━━ ACTION REQUIRED ━━━`,
    `Please ship to the client at the address above.`,
    `Reply to this message to confirm shipment.`,
  ].join("\n");
}

/** Owner WhatsApp — full transaction details + both shares. */
export function buildOwnerWhatsAppMessage(ctx: OrderMessageContext): string {
  const ownerBank = getOwnerBankDetails();
  const partnerBank = getPartnerBankDetails();
  const productPrice = ctx.amount - ctx.split.deliveryFee;
  return [
    `💰 PAYMENT RECEIVED — ${ctx.productName}`,
    ``,
    `━━━ CLIENT PARTICULARS ━━━`,
    `👤 Name: ${ctx.customerName}`,
    `📞 Phone: ${ctx.customerPhone}`,
    `📧 Email: ${ctx.customerEmail}`,
    `📍 Address: ${ctx.customerAddress}`,
    ``,
    `━━━ TRANSACTION DETAILS ━━━`,
    `Product: ${ctx.productName}`,
    `Product Price: ${ctx.currencySymbol} ${productPrice.toFixed(2)}`,
    `Delivery (${deliveryLabel(ctx.deliveryOption)}): ${ctx.currencySymbol} ${ctx.split.deliveryFee.toFixed(2)}`,
    `Total Paid: ${ctx.currencySymbol} ${ctx.amount.toFixed(2)}`,
    `Payment Gateway Fee: -${ctx.currencySymbol} ${ctx.split.flutterwaveFee.toFixed(2)}`,
    `Reference: ${ctx.txRef}`,
    `Processed by: Sitewizard`,
    ``,
    `━━━ YOUR SETTLEMENT (25%) ━━━`,
    `Your Share (25% of product after fees): ${ctx.currencySymbol} ${ctx.split.ownerShare.toFixed(2)}`,
    `  ➤ Bank: ${ownerBank.bank} | ${ownerBank.accountName}`,
    `  ➤ Account: ${ownerBank.accountNumber} | Branch: ${ownerBank.branch}`,
    ``,
    `━━━ JVL SETTLEMENT (75% + delivery) ━━━`,
    `JVL Share: ${ctx.currencySymbol} ${ctx.split.partnerNetShare.toFixed(2)}`,
    `  ➤ Bank: ${partnerBank.bank} | ${partnerBank.accountName}`,
    `  ➤ Account: ${partnerBank.accountNumber} | Branch: ${partnerBank.branch}`,
    ``,
    `Auto-split by payment gateway. Funds settle to bank accounts within 24h.`,
  ].join("\n");
}
