// Flutterwave Payment Integration Utility
// Docs: https://developer.flutterwave.com/docs/integration-guides/inline-checkout

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

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
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
  meta?: {
    product_id: string;
    quantity: number;
  };
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

// Product details
export const PRODUCT = {
  name: "Male Vitamine - Premium Performance Supplement",
  price: 850, // R 850.00
  currency: "ZAR",
  id: "male-vitamine-001",
};

// Generate a unique transaction reference
export function generateTxRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `MV-${timestamp}-${random}`.toUpperCase();
}

// Check if Flutterwave script is loaded
export function isFlutterwaveReady(): boolean {
  return typeof window !== "undefined" && typeof window.FlutterwaveCheckout === "function";
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
    script.onerror = () => reject(new Error("Failed to load Flutterwave script"));
    document.head.appendChild(script);
  });
}

// Initiate payment
export async function initiatePayment(customer: {
  email: string;
  name: string;
  phone?: string;
}): Promise<void> {
  await loadFlutterwaveScript();

  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

  if (!publicKey || publicKey === "FLWPUBK_TEST-your-public-key-here") {
    return;
  }

  const txRef = generateTxRef();

  const config: FlutterwaveConfig = {
    public_key: publicKey,
    tx_ref: txRef,
    amount: PRODUCT.price,
    currency: PRODUCT.currency,
    payment_options: "card,banktransfer,eft",
    customer: {
      email: customer.email,
      name: customer.name,
      phone_number: customer.phone,
    },
    customizations: {
      title: "Male Vitamine",
      description: PRODUCT.name,
      logo: `${window.location.origin}/product-image.webp`,
    },
    callback: (response) => {
      // Verify payment on server side
      if (response.status === "successful") {
        verifyPayment(response.data.id, response.data.tx_ref);
      }
    },
    onclose: () => {
      console.log("Payment modal closed");
    },
    meta: {
      product_id: PRODUCT.id,
      quantity: 1,
    },
  };

  window.FlutterwaveCheckout(config);
}

// Verify payment on the backend
export async function verifyPayment(
  transactionId: number,
  txRef: string
): Promise<{ verified: boolean; data?: unknown }> {
  try {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, txRef }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return { verified: false };
  }
}
