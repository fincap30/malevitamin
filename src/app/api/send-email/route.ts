import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/send-email
 *
 * Sends an email using nodemailer (Gmail SMTP or any SMTP provider).
 * Used for JVL sale notifications and customer confirmations.
 *
 * Request body:
 *   {
 *     to: string,
 *     subject: string,
 *     body: string,
 *     html?: string,  // optional HTML version
 *   }
 *
 * Env vars:
 *   SMTP_HOST - SMTP server (default: smtp.gmail.com)
 *   SMTP_PORT - SMTP port (default: 587)
 *   SMTP_USER - SMTP username (email address)
 *   SMTP_PASS - SMTP password (App Password for Gmail)
 *   SMTP_FROM - From address (default: SMTP_USER)
 */
export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, html } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { success: false, error: "Missing to, subject, or body" },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || "noreply@malevitamin.co.za";

    if (!smtpUser || !smtpPass) {
      // No SMTP configured — log the email
      console.log("[Email] SMTP not configured — logging email:", {
        from: smtpFrom,
        to,
        subject,
        body,
      });
      return NextResponse.json({
        success: true,
        sent: false,
        reason: "SMTP not configured. Set SMTP_USER and SMTP_PASS in .env.",
        logged: true,
      });
    }

    // Create transporter — use secure=true for port 465, otherwise STARTTLS
    const useSecure = smtpPort === 465;
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: useSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Male Vitamin" <${smtpFrom}>`,
      to,
      subject,
      text: body,
      html: html || body.replace(/\n/g, "<br/>"),
    });

    console.log("[Email] Sent to", to, {
      messageId: info.messageId,
      response: info.response,
    });

    return NextResponse.json({
      success: true,
      sent: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return NextResponse.json(
      { success: false, error: "Email send failed" },
      { status: 500 }
    );
  }
}
