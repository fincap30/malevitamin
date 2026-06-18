// Flutterwave Split Payment Integration — JVL Payment Skill
// Handles payment initialization, split configuration, verification, and notifications
//
// PAYMENT LOGIC:
// 1. Customer pays product price (e.g., R 850)
// 2. Flutterwave deducts transaction fee
// 3. Both parties split the AFTER-FEE amount 25/75
// 4. Delivery fee is added to JVL's share (JVL collects from customer)
// 5. JVL receives WhatsApp with customer name, address, product, delivery details
//
// Example: R 850 product, speed delivery (R 119)
//   - Flutterwave fee: R 25.65
//   - After fee: R 824.35
//   - Owner (25% of after-fee): R 206.09
//   - JVL (75% of after-fee): R 618.26 + R 119.00 delivery = R 737.26

// Split-payment math lives in one place (src/lib/payment/split.ts) so the
// client and server can never drift apart. Re-exported below for existing
// importers of this module.
import { calculateSplitBreakdown } from "./payment/split";
export { calculateSplitBreakdown };

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    name: string;
    phone_number?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  subaccounts: FlutterwaveSubaccount[];
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
  meta?: Record<string, unknown>;
}

export interface FlutterwaveSubaccount {
  id: string;
  transaction_charge_type?: "percentage" | "flat" | "flat_subaccount";
  transaction_charge?: number;
  transaction_split_ratio?: number;
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
  };
}

export interface PaymentVerificationResult {
  verified: boolean;
  amount?: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryOption?: "normal" | "speed";
  deliveryFee?: number;
  txRef?: string;
  transactionId?: number;
  paymentType?: string;
  splitBreakdown?: ReturnType<typeof calculateSplitBreakdown>;
  data?: unknown;
  demo?: boolean;
}

export type DeliveryOption = "normal" | "speed";

/* ------------------------------------------------------------------ */
/*  PRODUCT CONFIG                                                     */
/* ------------------------------------------------------------------ */

export const PRODUCT = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Male Vitamin",
  price: Number(process.env.NEXT_PUBLIC_AMOUNT || 85000) / 100, // cents to rands
  currency: process.env.NEXT_PUBLIC_CURRENCY || "ZAR",
  id: "male-vitamin-001",
};

/* ------------------------------------------------------------------ */
/*  DELIVERY CONFIG                                                    */
/* ------------------------------------------------------------------ */

export const DELIVERY = {
  normalFee: Number(process.env.DELIVERY_FEE_NORMAL || 8900) / 100, // R 89.00
  speedFee: Number(process.env.DELIVERY_FEE_SPEED || 11900) / 100, // R 119.00
  currency: process.env.DELIVERY_CURRENCY || "ZAR",
};

/* ------------------------------------------------------------------ */
/*  SPLIT CONFIGURATION                                                */
/* ------------------------------------------------------------------ */

interface SplitRecipient {
  subaccountId: string;
  percentage: number;
  label: string;
}

function getSplitRecipients(): SplitRecipient[] {
  const recipients: SplitRecipient[] = [];

  const ownerSub = process.env.FLUTTERWAVE_OWNER_SUBACCOUNT_ID;
  const ownerPct = Number(process.env.SPLIT_OWNER_PERCENTAGE || 0);
  if (ownerSub && ownerPct > 0) {
    recipients.push({
      subaccountId: ownerSub,
      percentage: ownerPct,
      label: process.env.SPLIT_OWNER_LABEL || "Owner",
    });
  }

  const partnerSub = process.env.FLUTTERWAVE_PARTNER_SUBACCOUNT_ID;
  const partnerPct = Number(process.env.SPLIT_PARTNER_PERCENTAGE || 0);
  if (partnerSub && partnerPct > 0) {
    recipients.push({
      subaccountId: partnerSub,
      percentage: partnerPct,
      label: process.env.SPLIT_PARTNER_LABEL || "Partner",
    });
  }

  const partner2Sub = process.env.FLUTTERWAVE_PARTNER_2_SUBACCOUNT_ID;
  const partner2Pct = Number(process.env.SPLIT_PARTNER_2_PERCENTAGE || 0);
  if (partner2Sub && partner2Pct > 0) {
    recipients.push({
      subaccountId: partner2Sub,
      percentage: partner2Pct,
      label: process.env.SPLIT_PARTNER_2_LABEL || "Partner 2",
    });
  }

  const partner3Sub = process.env.FLUTTERWAVE_PARTNER_3_SUBACCOUNT_ID;
  const partner3Pct = Number(process.env.SPLIT_PARTNER_3_PERCENTAGE || 0);
  if (partner3Sub && partner3Pct > 0) {
    recipients.push({
      subaccountId: partner3Sub,
      percentage: partner3Pct,
      label: process.env.SPLIT_PARTNER_3_LABEL || "Partner 3",
    });
  }

  return recipients;
}

/**
 * Build the Flutterwave subaccounts array for split payment.
 *
 * Uses flat charge for Owner so that:
 *   - Owner gets exactly 25% of (product price after Flutterwave fees)
 *   - JVL gets everything else = 75% of (product after fees) + FULL delivery fee
 *
 * This ensures the delivery fee goes entirely to JVL, not split 25/75.
 *
 * Example: R 969 charged (R 850 product + R 119 speed delivery)
 *   - Flutterwave fee: ~R 29.10
 *   - Settlement: ~R 939.90
 *   - Owner flat charge (25% of R 820.90): R 205.23 → to Capitec account
 *   - JVL gets the rest: R 939.90 - R 205.23 = R 734.67 → to Standard Bank
 *     (which = 75% of product R 615.67 + delivery R 119.00)
 */
function buildSubaccounts(deliveryOption: DeliveryOption = "normal"): FlutterwaveSubaccount[] {
  const ownerSubId = process.env.FLUTTERWAVE_OWNER_SUBACCOUNT_ID;
  const partnerSubId = process.env.FLUTTERWAVE_PARTNER_SUBACCOUNT_ID;

  if (!ownerSubId || !partnerSubId) return [];

  const deliveryFee =
    deliveryOption === "speed" ? DELIVERY.speedFee : DELIVERY.normalFee;
  const totalAmount = PRODUCT.price + deliveryFee;

  // Calculate Owner's exact share: 25% of (settlement - delivery)
  // This ensures delivery fee is NOT included in Owner's split
  const flutterwaveFee = totalAmount * 0.029 + 1;
  const settlement = totalAmount - flutterwaveFee;
  const splitPool = settlement - deliveryFee;
  const ownerPercentage = Number(process.env.SPLIT_OWNER_PERCENTAGE || 25);
  const ownerFlatCharge = Math.round(splitPool * (ownerPercentage / 100) * 100) / 100;

  console.log("[Flutterwave] Subaccount split calculation:", {
    totalAmount: `R ${totalAmount.toFixed(2)}`,
    deliveryFee: `R ${deliveryFee.toFixed(2)}`,
    flutterwaveFee: `R ${flutterwaveFee.toFixed(2)}`,
    settlement: `R ${settlement.toFixed(2)}`,
    splitPool: `R ${splitPool.toFixed(2)}`,
    ownerFlatCharge: `R ${ownerFlatCharge.toFixed(2)}`,
    jvlGets: `R ${(settlement - ownerFlatCharge).toFixed(2)}`,
  });

  // Owner gets a flat charge (25% of product after fees)
  // JVL gets everything else (75% of product + ALL delivery)
  return [
    {
      id: ownerSubId,
      transaction_charge_type: "flat",
      transaction_charge: ownerFlatCharge,
    },
    {
      id: partnerSubId,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  PAYMENT FUNCTIONS                                                  */
/* ------------------------------------------------------------------ */

export function generateTxRef(): string {
  const prefix = (process.env.NEXT_PUBLIC_BUSINESS_NAME || "PAY")
    .substring(0, 2)
    .toUpperCase();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

export function isFlutterwaveReady(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.FlutterwaveCheckout === "function"
  );
}

export function loadFlutterwaveScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isFlutterwaveReady()) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Flutterwave script"));
    document.head.appendChild(script);
  });
}

export function isDemoMode(): boolean {
  const key = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
  return !key || key.includes("your-public-key-here") || key.includes("TEST-xxxxx");
}

/**
 * Initialize a split payment via Flutterwave inline checkout.
 *
 * After payment, the callback triggers verification which:
 * 1. Confirms the payment amount
 * 2. Sends WhatsApp to customer ("Payment confirmed, product will be sent")
 * 3. Sends WhatsApp to JVL with order details + delivery address
 * 4. Sends email confirmation to customer
 */
export async function initiatePayment(customer: {
  email: string;
  name: string;
  phone: string;
  address: string;
  deliveryOption: DeliveryOption;
  onSuccess?: (result: PaymentVerificationResult) => void;
  onError?: (error: string) => void;
}): Promise<void> {
  await loadFlutterwaveScript();

  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
  if (!publicKey || isDemoMode()) {
    console.warn("Flutterwave: Running in demo mode — no real payment will be processed");
    return;
  }

  const txRef = generateTxRef();
  const subaccounts = buildSubaccounts(customer.deliveryOption);

  // Total amount = product price + delivery fee
  const deliveryFee =
    customer.deliveryOption === "speed" ? DELIVERY.speedFee : DELIVERY.normalFee;
  const totalAmount = PRODUCT.price + deliveryFee;

  const config: FlutterwaveConfig = {
    public_key: publicKey,
    tx_ref: txRef,
    amount: totalAmount,
    currency: PRODUCT.currency,
    payment_options: "card,banktransfer,eft,mobilemoney",
    customer: {
      email: customer.email,
      name: customer.name,
      phone_number: customer.phone,
    },
    customizations: {
      title: PRODUCT.name,
      description: `Payment for ${PRODUCT.name} + delivery`,
      logo: `${window.location.origin}/api/logo`,
    },
    subaccounts,
    callback: async (response) => {
      if (response.status === "successful") {
        console.log("[Flutterwave] Payment successful, verifying...", {
          txRef: response.data.tx_ref,
          amount: response.data.amount,
          currency: response.data.currency,
        });

        const result = await verifyPayment(
          response.data.id,
          response.data.tx_ref,
          {
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            customerAddress: customer.address,
            deliveryOption: customer.deliveryOption,
          }
        );

        if (result.verified) {
          customer.onSuccess?.(result);
        } else {
          customer.onError?.("Payment verification failed");
        }
      } else {
        customer.onError?.("Payment was not successful");
      }
    },
    onclose: () => {
      console.log("Payment modal closed by customer");
    },
    // Flutterwave's inline checkout requires `meta` to be a FLAT object of
    // primitive values (string / number / boolean). Nested objects or arrays
    // trigger an "Invalid meta data passed" error, so the split breakdown is
    // serialised into a single string instead of a nested array.
    meta: {
      product_id: PRODUCT.id,
      quantity: 1,
      customer_phone: customer.phone,
      customer_address: customer.address,
      delivery_option: customer.deliveryOption,
      product_price: PRODUCT.price,
      delivery_fee: deliveryFee,
      split_config: getSplitRecipients()
        .map((r) => `${r.label}:${r.percentage}%`)
        .join(", "),
    },
  };

  if (subaccounts.length > 0) {
    const breakdown = calculateSplitBreakdown(totalAmount, customer.deliveryOption);
    console.log(
      "[Flutterwave] Initiating split payment:",
      `Owner (25% of product after fees): R ${breakdown.ownerShare.toFixed(2)}`,
      `JVL (75% + delivery): R ${breakdown.partnerNetShare.toFixed(2)}`,
      `Total: R ${totalAmount.toFixed(2)} (Product: R ${PRODUCT.price.toFixed(2)} + Delivery: R ${deliveryFee.toFixed(2)})`
    );
  }

  window.FlutterwaveCheckout(config);
}

/**
 * Verify payment on the backend and return full verification result.
 * The backend verifies with Flutterwave's servers, calculates split breakdown,
 * and triggers WhatsApp + email notifications automatically.
 */
export async function verifyPayment(
  transactionId: number,
  txRef: string,
  customerInfo?: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    deliveryOption?: DeliveryOption;
  }
): Promise<PaymentVerificationResult> {
  try {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionId,
        txRef,
        customerName: customerInfo?.customerName,
        customerEmail: customerInfo?.customerEmail,
        customerPhone: customerInfo?.customerPhone,
        customerAddress: customerInfo?.customerAddress,
        deliveryOption: customerInfo?.deliveryOption,
      }),
    });

    const result = await response.json();

    if (result.verified) {
      const breakdown = calculateSplitBreakdown(
        result.data?.amount || PRODUCT.price,
        customerInfo?.deliveryOption || "normal"
      );
      console.log("[Payment] Verified. Split breakdown:", breakdown);
      return {
        verified: true,
        amount: result.data?.amount,
        currency: result.data?.currency,
        customerName: customerInfo?.customerName,
        customerEmail: customerInfo?.customerEmail,
        customerPhone: customerInfo?.customerPhone,
        customerAddress: customerInfo?.customerAddress,
        deliveryOption: customerInfo?.deliveryOption,
        deliveryFee: breakdown.deliveryFee,
        txRef,
        transactionId,
        paymentType: result.data?.payment_type,
        splitBreakdown: breakdown,
        data: result.data,
        demo: result.demo,
      };
    }

    return { verified: false };
  } catch (error) {
    console.error("[Payment] Verification failed:", error);
    return { verified: false };
  }
}
