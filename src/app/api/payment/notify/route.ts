import { NextRequest, NextResponse } from "next/server";

import { sendWhatsApp } from "@/lib/notifications/whatsapp";
import { sendEmail } from "@/lib/notifications/email";

/**
 * POST /api/payment/notify
 *
 * Generic notification endpoint kept for backward compatibility. The actual
 * sending logic lives in the notification libs (@/lib/notifications/*), which
 * are also used directly by the payment verify flow.
 *
 * Request body:
 *   { type: "whatsapp", phone, message }
 *   { type: "email", email, customSubject?, customBody?, customerName?, amount?, currency?, txRef?, businessName? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body ?? {};

    if (type === "whatsapp") {
      const result = await sendWhatsApp({
        phone: body.phone,
        message: body.message,
        context: {
          customerName: body.customerName,
          amount: body.amount,
          currency: body.currency,
          txRef: body.txRef,
        },
      });
      return NextResponse.json(result);
    }

    if (type === "email") {
      const businessName =
        body.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || "Our Store";
      const currencySymbol = body.currency === "ZAR" ? "R" : body.currency || "R";
      const subject =
        body.customSubject || `${businessName} — Payment Confirmed`;
      const text =
        body.customBody ||
        [
          `Hi ${body.customerName},`,
          ``,
          `Your payment of ${currencySymbol} ${(body.amount || 0).toFixed(2)} has been received and confirmed.`,
          ``,
          `Your product will be sent to you shortly. You will be informed with tracking details once it ships.`,
          ``,
          `Order Reference: ${body.txRef}`,
          ``,
          `Thank you for your order!`,
          ``,
          `— ${businessName}`,
        ].join("\n");

      const result = await sendEmail({
        to: body.email,
        subject,
        body: text,
        html: body.html,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: "Unknown notification type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Payment Notify] Error:", error);
    return NextResponse.json(
      { success: false, error: "Notification failed" },
      { status: 500 }
    );
  }
}
