// Shared payment domain types used across client and server.

export type DeliveryOption = "normal" | "speed";

export type OrderStatus = "pending" | "successful" | "failed" | "demo";

/** A single split line in the settlement breakdown. */
export interface SplitLine {
  label: string;
  percentage: number;
  amount: number;
  note?: string;
}

/**
 * Full settlement breakdown for an order.
 * All amounts are in the major currency unit (e.g. Rands).
 */
export interface SplitBreakdown {
  totalAmount: number;
  productPrice: number;
  flutterwaveFee: number;
  afterFeeAmount: number;
  deliveryFee: number;
  splitPool: number;
  ownerShare: number; // owner % of split pool
  partnerGrossShare: number; // partner % of split pool
  partnerNetShare: number; // partner share + full delivery fee
  settlementAmount: number;
  splits: SplitLine[];
}

/** Customer / order context passed to verification and persistence. */
export interface CustomerInfo {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  deliveryOption: DeliveryOption;
}

/** Result returned by the server verification service. */
export interface PaymentVerificationResult {
  verified: boolean;
  error?: string;
  demo?: boolean;
  amount?: number;
  currency?: string;
  paymentType?: string;
  transactionId?: string;
  txRef?: string;
  splitBreakdown?: SplitBreakdown;
  /** Raw transaction data from the gateway (real mode only). */
  data?: unknown;
}
