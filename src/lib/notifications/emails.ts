// Email builders — plain-text bodies + professional HTML versions.
//
// Mirrors the WhatsApp audiences:
//   - Partner (JVL): client particulars + order + JVL settlement.
//   - Owner: full transaction details + both shares.
//   - Customer: payment confirmation + delivery only.

import type { SplitBreakdown } from "@/lib/payment/types";
import type { OrderMessageContext } from "./messages";
import {
  deliveryLabel,
  getOwnerBankDetails,
  getPartnerBankDetails,
} from "./bank-details";

export interface EmailContent {
  subject: string;
  body: string;
  html: string;
}

/* ----------------------------- PARTNER (JVL) ----------------------------- */

export function buildPartnerEmail(ctx: OrderMessageContext): EmailContent {
  const label = deliveryLabel(ctx.deliveryOption);
  const productPrice = ctx.amount - ctx.split.deliveryFee;
  const bank = getPartnerBankDetails();
  const s = ctx.split;

  const body = [
    `NEW ORDER — ${ctx.productName}`,
    ``,
    `CLIENT PARTICULARS:`,
    `Name: ${ctx.customerName}`,
    `Phone: ${ctx.customerPhone}`,
    `Email: ${ctx.customerEmail}`,
    `Address: ${ctx.customerAddress}`,
    ``,
    `ORDER DETAILS:`,
    `Product: ${ctx.productName}`,
    `Product Price: R ${productPrice.toFixed(2)}`,
    `Delivery: ${label} — R ${s.deliveryFee.toFixed(2)}`,
    `Total Paid: R ${ctx.amount.toFixed(2)}`,
    `Reference: ${ctx.txRef}`,
    `Processed by: Sitewizard`,
    ``,
    `JVL SETTLEMENT:`,
    `JVL Share (75% of product after fees): R ${s.partnerGrossShare.toFixed(2)}`,
    `Plus delivery fee (full): +R ${s.deliveryFee.toFixed(2)}`,
    `Payment gateway fee: -R ${s.flutterwaveFee.toFixed(2)}`,
    ``,
    `TOTAL TO JVL ACCOUNT: R ${s.partnerNetShare.toFixed(2)}`,
    `Bank: ${bank.bank} | ${bank.accountName}`,
    `Account: ${bank.accountNumber} | Branch: ${bank.branch}`,
    ``,
    `Owner Share (25%): R ${s.ownerShare.toFixed(2)}`,
    ``,
    `Auto-split by payment gateway. Funds settle within 24h.`,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#2563eb;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;font-size:20px;">&#128722; NEW ORDER — ${ctx.productName}</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      <h3 style="color:#374151;border-bottom:2px solid #2563eb;padding-bottom:8px;margin-top:0;">CLIENT PARTICULARS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Name:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Phone:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerPhone}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Email:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Address:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerAddress}</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #2563eb;padding-bottom:8px;margin-top:24px;">ORDER DETAILS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Product:</td><td style="padding:6px 0;font-weight:600;">${ctx.productName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Product Price:</td><td style="padding:6px 0;font-weight:600;">R ${productPrice.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Delivery:</td><td style="padding:6px 0;font-weight:600;">${label} — R ${s.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Total Paid:</td><td style="padding:6px 0;font-weight:600;">R ${ctx.amount.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Reference:</td><td style="padding:6px 0;font-weight:600;">${ctx.txRef}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Processed by:</td><td style="padding:6px 0;font-weight:600;">Sitewizard</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #2563eb;padding-bottom:8px;margin-top:24px;">JVL SETTLEMENT</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:200px;">JVL Share (75% of product after fees):</td><td style="padding:6px 0;font-weight:600;">R ${s.partnerGrossShare.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Plus delivery fee (full):</td><td style="padding:6px 0;font-weight:600;">+R ${s.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Payment gateway fee:</td><td style="padding:6px 0;font-weight:600;">-R ${s.flutterwaveFee.toFixed(2)}</td></tr>
        <tr style="background:#f0fdf4;"><td style="padding:10px 6px;color:#059669;font-weight:700;font-size:16px;">TOTAL TO JVL ACCOUNT:</td><td style="padding:10px 6px;font-weight:700;font-size:18px;color:#059669;">R ${s.partnerNetShare.toFixed(2)}</td></tr>
      </table>
      <div style="background:#f9fafb;padding:12px 16px;border-radius:6px;margin-top:16px;">
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Bank:</strong> ${bank.bank} | ${bank.accountName}</p>
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Account:</strong> ${bank.accountNumber} | <strong>Branch:</strong> ${bank.branch}</p>
      </div>
      <p style="color:#6b7280;font-size:12px;margin-top:20px;">Owner Share (25%): R ${s.ownerShare.toFixed(2)}<br>Auto-split by payment gateway. Funds settle within 24h.<br>Sent by Sitewizard on behalf of ${ctx.productName}</p>
    </div>
  </div>`;

  return {
    subject: `NEW ORDER — ${ctx.productName} — R ${ctx.amount.toFixed(2)}`,
    body,
    html,
  };
}

/* -------------------------------- OWNER --------------------------------- */

export function buildOwnerEmail(ctx: OrderMessageContext): EmailContent {
  const label = deliveryLabel(ctx.deliveryOption);
  const productPrice = ctx.amount - ctx.split.deliveryFee;
  const ownerBank = getOwnerBankDetails();
  const partnerBank = getPartnerBankDetails();
  const s = ctx.split;

  const body = [
    `PAYMENT RECEIVED — ${ctx.productName}`,
    ``,
    `CLIENT PARTICULARS:`,
    `Name: ${ctx.customerName}`,
    `Phone: ${ctx.customerPhone}`,
    `Email: ${ctx.customerEmail}`,
    `Address: ${ctx.customerAddress}`,
    ``,
    `TRANSACTION DETAILS:`,
    `Product: ${ctx.productName}`,
    `Product Price: R ${productPrice.toFixed(2)}`,
    `Delivery (${label}): R ${s.deliveryFee.toFixed(2)}`,
    `Total Paid: R ${ctx.amount.toFixed(2)}`,
    `Payment Gateway Fee: -R ${s.flutterwaveFee.toFixed(2)}`,
    `Reference: ${ctx.txRef}`,
    `Processed by: Sitewizard`,
    ``,
    `YOUR SETTLEMENT (25%):`,
    `Your Share (25% of product after fees): R ${s.ownerShare.toFixed(2)}`,
    `Bank: ${ownerBank.bank} | ${ownerBank.accountName}`,
    `Account: ${ownerBank.accountNumber} | Branch: ${ownerBank.branch}`,
    ``,
    `JVL SETTLEMENT (75% + delivery):`,
    `JVL Share: R ${s.partnerNetShare.toFixed(2)}`,
    `Bank: ${partnerBank.bank} | ${partnerBank.accountName}`,
    `Account: ${partnerBank.accountNumber} | Branch: ${partnerBank.branch}`,
    ``,
    `Auto-split by payment gateway. Funds settle within 24h.`,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#d97706;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;font-size:20px;">&#128176; PAYMENT RECEIVED — ${ctx.productName}</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:0;">CLIENT PARTICULARS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Name:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Phone:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerPhone}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Email:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Address:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerAddress}</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:24px;">TRANSACTION DETAILS</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Product:</td><td style="padding:6px 0;font-weight:600;">${ctx.productName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Product Price:</td><td style="padding:6px 0;font-weight:600;">R ${productPrice.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Delivery:</td><td style="padding:6px 0;font-weight:600;">${label} — R ${s.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Total Paid:</td><td style="padding:6px 0;font-weight:600;">R ${ctx.amount.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Gateway Fee:</td><td style="padding:6px 0;font-weight:600;">-R ${s.flutterwaveFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Reference:</td><td style="padding:6px 0;font-weight:600;">${ctx.txRef}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Processed by:</td><td style="padding:6px 0;font-weight:600;">Sitewizard</td></tr>
      </table>
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:24px;">YOUR SETTLEMENT (25%)</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#fffbeb;"><td style="padding:10px 6px;color:#d97706;font-weight:700;font-size:16px;">Your Share (25% of product after fees):</td><td style="padding:10px 6px;font-weight:700;font-size:18px;color:#d97706;">R ${s.ownerShare.toFixed(2)}</td></tr>
      </table>
      <div style="background:#f9fafb;padding:12px 16px;border-radius:6px;margin-top:12px;">
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Bank:</strong> ${ownerBank.bank} | ${ownerBank.accountName}</p>
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Account:</strong> ${ownerBank.accountNumber} | <strong>Branch:</strong> ${ownerBank.branch}</p>
      </div>
      <h3 style="color:#374151;border-bottom:2px solid #d97706;padding-bottom:8px;margin-top:24px;">JVL SETTLEMENT (75% + delivery)</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#f0fdf4;"><td style="padding:10px 6px;color:#059669;font-weight:700;font-size:16px;">JVL Share:</td><td style="padding:10px 6px;font-weight:700;font-size:18px;color:#059669;">R ${s.partnerNetShare.toFixed(2)}</td></tr>
      </table>
      <div style="background:#f9fafb;padding:12px 16px;border-radius:6px;margin-top:12px;">
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Bank:</strong> ${partnerBank.bank} | ${partnerBank.accountName}</p>
        <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Account:</strong> ${partnerBank.accountNumber} | <strong>Branch:</strong> ${partnerBank.branch}</p>
      </div>
      <p style="color:#6b7280;font-size:12px;margin-top:20px;">Auto-split by payment gateway. Funds settle to bank accounts within 24h.<br>Sent by Sitewizard on behalf of ${ctx.productName}</p>
    </div>
  </div>`;

  return {
    subject: `PAYMENT RECEIVED — ${ctx.productName} — R ${ctx.amount.toFixed(2)}`,
    body,
    html,
  };
}

/* ------------------------------- CUSTOMER ------------------------------- */

export function buildCustomerEmail(ctx: OrderMessageContext): EmailContent {
  const label = deliveryLabel(ctx.deliveryOption);
  const s = ctx.split;

  const body = [
    `Hi ${ctx.customerName},`,
    ``,
    `Your payment of R ${ctx.amount.toFixed(2)} has been received and confirmed.`,
    ``,
    `Your product will be sent to you shortly. You will be informed with tracking details once it ships.`,
    ``,
    `Order Reference: ${ctx.txRef}`,
    ``,
    `Thank you for your order!`,
    ``,
    `— ${ctx.productName}`,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#059669;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;font-size:20px;">&#9989; Payment Confirmed!</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      <p style="font-size:16px;color:#374151;">Hi ${ctx.customerName},</p>
      <p style="font-size:16px;color:#374151;">Your payment of <strong>R ${ctx.amount.toFixed(2)}</strong> has been received and confirmed.</p>
      <h3 style="color:#374151;border-bottom:2px solid #059669;padding-bottom:8px;margin-top:24px;">Delivery Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Address:</td><td style="padding:6px 0;font-weight:600;">${ctx.customerAddress}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Delivery:</td><td style="padding:6px 0;font-weight:600;">${label} — R ${s.deliveryFee.toFixed(2)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Reference:</td><td style="padding:6px 0;font-weight:600;">${ctx.txRef}</td></tr>
      </table>
      <p style="font-size:15px;color:#374151;margin-top:20px;">Your product will be sent to you shortly. You will be informed with tracking details once it ships.</p>
      <p style="font-size:15px;color:#374151;">Thank you for your order!</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="color:#6b7280;font-size:12px;">— ${ctx.productName}</p>
    </div>
  </div>`;

  return {
    subject: `${ctx.productName} — Payment Confirmed`,
    body,
    html,
  };
}
