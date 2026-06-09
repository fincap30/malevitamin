import { NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/lib/notifications/email";

/**
 * POST /api/send-email
 *
 * Sends an email via SMTP (nodemailer). The transport/sending logic lives in
 * @/lib/notifications/email so it can be reused directly by the payment flow.
 *
 * Request body: { to, subject, body, html? }
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

    const result = await sendEmail({ to, subject, body, html });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return NextResponse.json(
      { success: false, error: "Email send failed" },
      { status: 500 }
    );
  }
}
