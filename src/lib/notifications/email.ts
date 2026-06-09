// Email sender — core logic wrapping nodemailer (SMTP).
//
// Single place that builds the SMTP transport and sends mail. Called by the
// /api/send-email route and directly by the notification service.
//
// Env vars:
//   SMTP_HOST - SMTP server (default: smtp.gmail.com)
//   SMTP_PORT - SMTP port (default: 587; 465 implies TLS)
//   SMTP_USER - SMTP username (email address)
//   SMTP_PASS - SMTP password (App Password for Gmail)
//   SMTP_FROM - From address (default: SMTP_USER)

import nodemailer from "nodemailer";

export interface SendEmailInput {
  to?: string;
  subject: string;
  body: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  sent: boolean;
  channel: "email";
  reason?: string;
  messageId?: string;
}

/**
 * Send an email via SMTP. Never throws — returns a structured result.
 */
export async function sendEmail(input: SendEmailInput): Promise<EmailResult> {
  if (!input.to) {
    return {
      success: true,
      sent: false,
      channel: "email",
      reason: "No recipient provided",
    };
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom =
    process.env.SMTP_FROM || smtpUser || "noreply@malevitamin.co.za";
  const fromName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Male Vitamin";

  if (!smtpUser || !smtpPass) {
    console.log("[Email] SMTP not configured — logging email:", {
      from: smtpFrom,
      to: input.to,
      subject: input.subject,
    });
    return {
      success: true,
      sent: false,
      channel: "email",
      reason: "SMTP not configured. Set SMTP_USER and SMTP_PASS.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${smtpFrom}>`,
      to: input.to,
      subject: input.subject,
      text: input.body,
      html: input.html || input.body.replace(/\n/g, "<br/>"),
    });

    console.log("[Email] Sent to", input.to, { messageId: info.messageId });
    return {
      success: true,
      sent: true,
      channel: "email",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return {
      success: false,
      sent: false,
      channel: "email",
      reason: "Email send failed",
    };
  }
}
