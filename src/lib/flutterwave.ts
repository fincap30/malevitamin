// Flutterwave Split Payment Integration
// Handles payment initialization, split configuration, and verification
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
/*  SPLIT CONFIGURATION                                                */
/* ------------------------------------------------------------------ */

interface SplitRecipient {
  subaccountId: string;
  percentage: number;
  label: string;
}

/**
 * Build the list of split recipients from environment variables.
 *
 * Configure in .env:
 *   SPLIT_OWNER_PERCENTAGE=25
 *   SPLIT_PARTNER_PERCENTAGE=75
 *   FLUTTERWAVE_OWNER_SUBACCOUNT_ID=RS_xxxxx
 *   FLUTTERWAVE_PARTNER_SUBACCOUNT_ID=RS_xxxxx
 *
 * For 3+ recipients, add:
 *   SPLIT_PARTNER_2_PERCENTAGE=25
 *   FLUTTERWAVE_PARTNER_2_SUBACCOUNT_ID=RS_xxxxx
 */
function getSplitRecipients(): SplitRecipient[] {
  const recipients: SplitRecipient[] = [];

  // Owner (you)
  const ownerSub = process.env.FLUTTERWAVE_OWNER_SUBACCOUNT_ID;
  const ownerPct = Number(process.env.SPLIT_OWNER_PERCENTAGE || 0);
  if (ownerSub && ownerPct > 0) {
    recipients.push({
      subaccountId: ownerSub,
      percentage: ownerPct,
      label: "Owner",
    });
  }

  // Partner 1
  const partnerSub = process.env.FLUTTERWAVE_PARTNER_SUBACCOUNT_ID;
  const partnerPct = Number(process.env.SPLIT_PARTNER_PERCENTAGE || 0);
  if (partnerSub && partnerPct > 0) {
    recipients.push({
      subaccountId: partnerSub,
      percentage: partnerPct,
      label: "Partner",
    });
  }

  // Partner 2 (optional, for 3-way splits)
  const partner2Sub = process.env.FLUTTERWAVE_PARTNER_2_SUBACCOUNT_ID;
  const partner2Pct = Number(process.env.SPLIT_PARTNER_2_PERCENTAGE || 0);
  if (partner2Sub && partner2Pct > 0) {
    recipients.push({
      subaccountId: partner2Sub,
      percentage: partner2Pct,
      label: "Partner 2",
    });
  }

  return recipients;
}

/**
 * Build the Flutterwave subaccounts array for split payment.
 *
 * How Flutterwave processes this:
 * 1. Customer pays the full amount
 * 2. Flutterwave deducts its transaction fee
 * 3. The remaining settlement is split between subaccounts
 *
 * For a 25/75 split on R 850.00 with ~R25.65 Flutterwave fee:
 *   - Settlement: R 824.35
 *   - Owner (25%): R 206.09
 *   - Partner (75%): R 618.26
 */
function buildSubaccounts(): FlutterwaveSubaccount[] {
  const recipients = getSplitRecipients();

  if (recipients.length === 0) {
    // No split configured — full amount goes to main account
    return [];
  }

  if (recipients.length === 1) {
    // Single recipient — use percentage charge type
    return [
      {
        id: recipients[0].subaccountId,
        transaction_charge_type: "percentage",
        transaction_charge: recipients[0].percentage / 100,
      },
    ];
  }

  // Multiple recipients — use split ratio
  // Convert percentages to ratios (e.g., 25/75 → ratio 1:3)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const percentages = recipients.map((r) => r.percentage);
  const commonDivisor = percentages.reduce((acc, val) => gcd(acc, val));

  return recipients.map((r) => ({
    id: r.subaccountId,
    transaction_split_ratio: r.percentage / commonDivisor,
  }));
}

/**
 * Calculate the expected split breakdown for display/logging purposes.
 * This is an estimate — actual split may vary based on Flutterwave fees.
 */
export function calculateSplitBreakdown(totalAmount: number): {
  flutterwaveFee: number;
  settlementAmount: number;
  splits: { label: string; percentage: number; amount: number }[];
} {
  // Flutterwave SA fee: 2.9% + R1 (local card estimate)
  const flutterwaveFee = totalAmount * 0.029 + 1;
  const settlementAmount = totalAmount - flutterwaveFee;
  const recipients = getSplitRecipients();

  const splits = recipients.map((r) => ({
    label: r.label,
    percentage: r.percentage,
    amount: settlementAmount * (r.percentage / 100),
  }));

  return { flutterwaveFee, settlementAmount, splits };
}

/* ------------------------------------------------------------------ */
/*  PAYMENT FUNCTIONS                                                  */
/* ------------------------------------------------------------------ */

// Generate a unique transaction reference
export function generateTxRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `MV-${timestamp}-${random}`.toUpperCase();
}

// Check if Flutterwave script is loaded
export function isFlutterwaveReady(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.FlutterwaveCheckout === "function"
  );
}

// Load Flutterwave inline script
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

// Check if running in demo mode
export function isDemoMode(): boolean {
  const key = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
  return !key || key.includes("your-public-key-here") || key.includes("TEST-xxxxx");
}

/**
 * Initialize a split payment via Flutterwave inline checkout.
 *
 * The subaccounts array tells Flutterwave how to split the money.
 * Flutterwave handles the actual division and settlement automatically.
 */
export async function initiatePayment(customer: {
  email: string;
  name: string;
  phone?: string;
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
    callback: (response) => {
      if (response.status === "successful") {
        verifyPayment(response.data.id, response.data.tx_ref);
      }
    },
    onclose: () => {
      console.log("Payment modal closed by customer");
    },
    meta: {
      product_id: PRODUCT.id,
      quantity: 1,
      split_config: getSplitRecipients().map((r) => ({
        label: r.label,
        percentage: r.percentage,
      })),
    },
  };

  if (subaccounts.length > 0) {
    console.log(
      "Flutterwave: Initiating split payment",
      getSplitRecipients().map((r) => `${r.label}: ${r.percentage}%`)
    );
  }

  window.FlutterwaveCheckout(config);
}

/**
 * Verify payment on the backend and log split details.
 */
export async function verifyPayment(
  transactionId: number,
  txRef: string
): Promise<{
  verified: boolean;
  splitBreakdown?: ReturnType<typeof calculateSplitBreakdown>;
  data?: unknown;
}> {
  try {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, txRef }),
    });

    const result = await response.json();

    if (result.verified) {
      const breakdown = calculateSplitBreakdown(
        result.data?.amount || PRODUCT.price
      );
      console.log("Payment verified. Split breakdown:", breakdown);
      return { verified: true, splitBreakdown: breakdown, data: result.data };
    }

    return { verified: false };
  } catch (error) {
    console.error("Payment verification failed:", error);
    return { verified: false };
  }
}
