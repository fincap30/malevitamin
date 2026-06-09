// Order service — all database operations for orders live here.
//
// Persisting orders means a sale is never lost just because a downstream
// notification (WhatsApp / email) failed. The verify route should record the
// order BEFORE attempting notifications, then update the notification status.

import { db } from "@/lib/db";
import type { Order } from "@prisma/client";
import type {
  CustomerInfo,
  OrderStatus,
  SplitBreakdown,
} from "@/lib/payment/types";

export interface RecordOrderInput {
  txRef: string;
  transactionId?: string | number;
  status: OrderStatus;
  paymentType?: string;
  demo?: boolean;
  amount: number;
  currency: string;
  customer: CustomerInfo;
  splitBreakdown: SplitBreakdown;
}

function toOrderData(input: RecordOrderInput) {
  const isPaid = input.status === "successful" || input.status === "demo";
  return {
    txRef: input.txRef,
    transactionId:
      input.transactionId != null ? String(input.transactionId) : undefined,
    status: input.status,
    paymentType: input.paymentType,
    demo: input.demo ?? false,
    amount: input.amount,
    currency: input.currency,
    productPrice: input.splitBreakdown.productPrice,
    gatewayFee: input.splitBreakdown.flutterwaveFee,
    deliveryOption: input.customer.deliveryOption,
    deliveryFee: input.splitBreakdown.deliveryFee,
    ownerShare: input.splitBreakdown.ownerShare,
    partnerShare: input.splitBreakdown.partnerNetShare,
    customerName: input.customer.customerName,
    customerEmail: input.customer.customerEmail,
    customerPhone: input.customer.customerPhone,
    customerAddress: input.customer.customerAddress,
    paidAt: isPaid ? new Date() : undefined,
  };
}

/**
 * Create or update an order keyed by txRef (idempotent).
 *
 * Re-verifying the same transaction will update the existing record rather
 * than creating a duplicate, which protects against double processing.
 */
export async function recordOrder(input: RecordOrderInput): Promise<Order> {
  const data = toOrderData(input);
  try {
    return await db.order.upsert({
      where: { txRef: input.txRef },
      create: data,
      update: data,
    });
  } catch (error) {
    console.error("[OrderService] Failed to record order:", error);
    throw error;
  }
}

/** Look up an order by our transaction reference. */
export async function getOrderByTxRef(txRef: string): Promise<Order | null> {
  return db.order.findUnique({ where: { txRef } });
}

/** Returns true if a successful (non-pending) order already exists. */
export async function isAlreadyProcessed(txRef: string): Promise<boolean> {
  const order = await db.order.findUnique({ where: { txRef } });
  return (
    !!order && (order.status === "successful" || order.status === "demo")
  );
}

/** Mark the result of the notification fan-out for an order. */
export async function updateNotificationStatus(
  txRef: string,
  sent: boolean,
  log?: string
): Promise<void> {
  try {
    await db.order.update({
      where: { txRef },
      data: { notificationsSent: sent, notificationLog: log },
    });
  } catch (error) {
    // Never let a status-tracking failure break the payment flow.
    console.error("[OrderService] Failed to update notification status:", error);
  }
}
