import { NextRequest, NextResponse } from "next/server";

import { verifyTransaction } from "@/lib/payment/flutterwave-verify";
import type { CustomerInfo, DeliveryOption } from "@/lib/payment/types";
import {
  isAlreadyProcessed,
  recordOrder,
  updateNotificationStatus,
} from "@/lib/order/order-service";
import {
  notifyOrder,
  notifyPaymentVerified,
} from "@/lib/notifications/notification-service";

/**
 * POST /api/payment/verify
 *
 * Thin orchestration layer. The heavy lifting lives in dedicated services:
 *   - Verification  -> @/lib/payment/flutterwave-verify
 *   - Split math    -> @/lib/payment/split (single source of truth)
 *   - Persistence   -> @/lib/order/order-service
 *   - Notifications -> @/lib/notifications/notification-service
 *
 * Flow: verify -> persist order (BEFORE notifying, so a sale is never lost) ->
 * fan out notifications -> record notification status. Idempotent by txRef.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionId,
      txRef,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      deliveryOption,
    } = body ?? {};

    if (!transactionId || !txRef) {
      return NextResponse.json(
        { verified: false, error: "Missing transactionId or txRef" },
        { status: 400 }
      );
    }

    const customer: CustomerInfo = {
      customerName: customerName || "Customer",
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || undefined,
      customerAddress: customerAddress || "Address not provided",
      deliveryOption: (deliveryOption as DeliveryOption) || "normal",
    };

    // Idempotency — a previously processed transaction is not re-notified.
    if (await isAlreadyProcessed(txRef)) {
      console.log("[Payment Verify] Already processed, skipping:", txRef);
      return NextResponse.json({
        verified: true,
        alreadyProcessed: true,
        txRef,
      });
    }

    // 1. Verify with the gateway (server-authoritative amount + split).
    const result = await verifyTransaction({ transactionId, txRef, customer });

    if (!result.verified || !result.splitBreakdown) {
      return NextResponse.json(
        {
          verified: false,
          error: result.error || "Transaction not successful",
          data: result.data,
        },
        { status: 200 }
      );
    }

    const amount = result.amount ?? result.splitBreakdown.totalAmount;
    const currency = result.currency || "ZAR";

    // 2. Persist the order BEFORE notifying so it is never lost.
    try {
      await recordOrder({
        txRef,
        transactionId: result.transactionId,
        status: result.demo ? "demo" : "successful",
        paymentType: result.paymentType,
        demo: result.demo,
        amount,
        currency,
        customer,
        splitBreakdown: result.splitBreakdown,
      });
    } catch (error) {
      console.error("[Payment Verify] Failed to persist order:", error);
      // Continue — notifications should still go out even if persistence fails.
    }

    // 3. Fan out notifications (best-effort, isolated per channel).
    const summary = await notifyOrder({
      customer,
      amount,
      currency,
      txRef,
      transactionId: result.transactionId,
      split: result.splitBreakdown,
    });

    // 4. Send the customer a discreet WhatsApp payment-confirmation via the
    //    Universal Gateway (best-effort, never blocks the response).
    try {
      const waResult = await notifyPaymentVerified(customer.customerPhone);
      summary.log.push(
        `${waResult.sent ? "OK" : "SKIP"} whatsapp payment-verified -> ${
          waResult.success ? "sent" : waResult.reason ?? "not sent"
        }`
      );
    } catch (error) {
      console.error("[Payment Verify] WhatsApp confirmation failed:", error);
    }

    // 5. Record the notification outcome on the order.
    await updateNotificationStatus(txRef, summary.allSent, summary.log.join("\n"));

    return NextResponse.json({
      verified: true,
      demo: result.demo ?? false,
      data: result.data,
      splitBreakdown: result.splitBreakdown,
      notificationsSent: summary.allSent,
    });
  } catch (error) {
    console.error("[Payment Verify Error]", error);
    return NextResponse.json(
      { verified: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
