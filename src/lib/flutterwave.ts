// Flutterwave Split Payment Integration — JVL Payment Skill
// Handles payment initialization, split configuration, verification, and notifications
//
// PAYMENT LOGIC:
// 1. Customer pays product price (e.g., R 850)
// 2. Flutterwave deducts transaction fee → JVL bears this cost
// 3. TJ gets 25% of GROSS amount (clean, no deductions)
// 4. JVL gets 75% of GROSS amount MINUS Flutterwave fee MINUS delivery fee
// 5. JVL receives WhatsApp with customer name, address, product, delivery details
//
// Docs: https://developer.flutterwave.com/v3.0/docs/split-payments

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
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Male Vitamine",
  price: Number(process.env.NEXT_PUBLIC_AMOUNT || 85000) / 100, // cents to rands
  currency: process.env.NEXT_PUBLIC_CURRENCY || "ZAR",
  id: "male-vitamine-001",
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
 * Flutterwave splits the SETTLEMENT amount (after their fee) between subaccounts.
 */
function buildSubaccounts(): FlutterwaveSubaccount[] {
  const recipients = getSplitRecipients();

  if (recipients.length === 0) return [];

  if (recipients.length === 1) {
    return [
      {
        id: recipients[0].subaccountId,
        transaction_charge_type: "percentage",
        transaction_charge: recipients[0].percentage / 100,
      },
    ];
  }

  // Multiple recipients — use split ratio (e.g., 25/75 → ratio 1:3)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const percentages = recipients.map((r) => r.percentage);
  const commonDivisor = percentages.reduce((acc, val) => gcd(acc, val));

  return recipients.map((r) => ({
    id: r.subaccountId,
    transaction_split_ratio: r.percentage / commonDivisor,
  }));
}

/**
 * Calculate the expected split breakdown.
 *
 * JVL PAYMENT LOGIC:
 * 1. Flutterwave deducts its fee from the total
 * 2. TJ gets 25% of the GROSS amount (clean — no deductions)
 * 3. JVL gets the REMAINING after TJ's share and Flutterwave fee
 * 4. Delivery fee is deducted from JVL's share (JVL pays shipping)
 *
 * Example: R 850.00 product, normal delivery (R 89)
 *   - Flutterwave fee: R 25.65
 *   - TJ (25% of gross): R 212.50
 *   - JVL (remaining): R 850 - R 212.50 - R 25.65 = R 611.85
 *   - JVL net after delivery: R 611.85 - R 89.00 = R 522.85
 */
export function calculateSplitBreakdown(
  totalAmount: number,
  deliveryOption: DeliveryOption = "normal"
): {
  totalAmount: number;
  flutterwaveFee: number;
  ownerShare: number; // TJ's 25% clean
  partnerGrossShare: number; // JVL's share before delivery
  deliveryFee: number;
  partnerNetShare: number; // JVL's share after delivery
  settlementAmount: number;
  splits: { label: string; percentage: number; amount: number; note?: string }[];
} {
  // Flutterwave SA fee: 2.9% + R1 (local card estimate)
  const flutterwaveFee = totalAmount * 0.029 + 1;

  // Owner (TJ) gets 25% of GROSS — clean, no deductions
  const ownerPercentage = Number(process.env.SPLIT_OWNER_PERCENTAGE || 25);
  const ownerShare = totalAmount * (ownerPercentage / 100);

  // JVL gets the remaining after TJ's share and Flutterwave fee
  const partnerGrossShare = totalAmount - ownerShare - flutterwaveFee;

  // Delivery fee (deducted from JVL's share)
  const deliveryFee =
    deliveryOption === "speed" ? DELIVERY.speedFee : DELIVERY.normalFee;

  // JVL net after delivery
  const partnerNetShare = partnerGrossShare - deliveryFee;

  // Settlement amount (what Flutterwave actually distributes)
  const settlementAmount = totalAmount - flutterwaveFee;

  const splits = [
    {
      label: process.env.SPLIT_OWNER_LABEL || "Owner",
      percentage: ownerPercentage,
      amount: ownerShare,
      note: "Clean — no deductions",
    },
    {
      label: process.env.SPLIT_PARTNER_LABEL || "Partner",
      percentage: 100 - ownerPercentage,
      amount: partnerNetShare,
      note: `After Flutterwave fee (-R ${flutterwaveFee.toFixed(2)}) and delivery (-R ${deliveryFee.toFixed(2)})`,
    },
  ];

  return {
    totalAmount,
    flutterwaveFee,
    ownerShare,
    partnerGrossShare,
    deliveryFee,
    partnerNetShare,
    settlementAmount,
    splits,
  };
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
  const subaccounts = buildSubaccounts();

  const config: FlutterwaveConfig = {
    public_key: publicKey,
    tx_ref: txRef,
    amount: PRODUCT.price,
    currency: PRODUCT.currency,
    payment_options: "card,banktransfer,eft,mobilemoney",
    customer: {
      email: customer.email,
      name: customer.name,
      phone_number: customer.phone,
    },
    customizations: {
      title: PRODUCT.name,
      description: `Payment for ${PRODUCT.name}`,
      logo: `${window.location.origin}/product-image.webp`,
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
    meta: {
      product_id: PRODUCT.id,
      quantity: 1,
      customer_phone: customer.phone,
      customer_address: customer.address,
      delivery_option: customer.deliveryOption,
      split_config: getSplitRecipients().map((r) => ({
        label: r.label,
        percentage: r.percentage,
      })),
    },
  };

  if (subaccounts.length > 0) {
    console.log(
      "[Flutterwave] Initiating split payment:",
      getSplitRecipients().map((r) => `${r.label}: ${r.percentage}%`)
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
