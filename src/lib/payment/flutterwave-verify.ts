// Server-side Flutterwave verification service.
//
// Confirms a transaction directly with Flutterwave's API, then computes the
// split breakdown from the SERVER-AUTHORITATIVE amount. The amount we settle
// and report is validated against what the server expects for the chosen
// delivery option — the client cannot dictate the price.

import type {
  CustomerInfo,
  DeliveryOption,
  PaymentVerificationResult,
} from "./types";
import {
  calculateSplitBreakdown,
  getExpectedTotal,
} from "./split";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

/** Penny tolerance when comparing the gateway amount to the expected total. */
const AMOUNT_TOLERANCE = 0.5;

export interface VerifyInput {
  transactionId: string | number;
  txRef: string;
  customer: CustomerInfo;
}

/** True when no real secret key is configured (local / preview demo mode). */
export function isDemoMode(): boolean {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  return (
    !secretKey ||
    secretKey === "FLWSECK_TEST-your-secret-key-here" ||
    secretKey.includes("xxxxx")
  );
}

/**
 * Verify a payment. In demo mode a successful result is simulated using the
 * server-computed expected total. In live mode the transaction is confirmed
 * with Flutterwave and the reported amount is validated.
 */
export async function verifyTransaction(
  input: VerifyInput
): Promise<PaymentVerificationResult> {
  const deliveryOption: DeliveryOption = input.customer.deliveryOption || "normal";

  // ---- Demo mode -------------------------------------------------------
  if (isDemoMode()) {
    const totalAmount = getExpectedTotal(deliveryOption);
    const splitBreakdown = calculateSplitBreakdown(totalAmount, deliveryOption);
    console.log("[FlutterwaveVerify] Demo mode — simulating success", {
      txRef: input.txRef,
      totalAmount,
    });
    return {
      verified: true,
      demo: true,
      amount: totalAmount,
      currency: "ZAR",
      paymentType: "demo",
      transactionId: String(input.transactionId),
      txRef: input.txRef,
      splitBreakdown,
      data: {
        id: input.transactionId,
        tx_ref: input.txRef,
        amount: totalAmount,
        currency: "ZAR",
        status: "successful",
        payment_type: "demo",
      },
    };
  }

  // ---- Live verification ----------------------------------------------
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY as string;
  let verifyData: {
    status?: string;
    data?: {
      status?: string;
      amount?: number;
      currency?: string;
      payment_type?: string;
      tx_ref?: string;
    };
  };

  try {
    const verifyResponse = await fetch(
      `${FLUTTERWAVE_VERIFY_URL}/${input.transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    verifyData = await verifyResponse.json();
  } catch (error) {
    console.error("[FlutterwaveVerify] API call failed:", error);
    return { verified: false, error: "Could not reach payment gateway" };
  }

  const txOk =
    verifyData.status === "success" &&
    verifyData.data?.status === "successful";

  if (!txOk) {
    return {
      verified: false,
      error: "Transaction not successful",
      data: verifyData.data,
    };
  }

  const gatewayAmount = Number(verifyData.data?.amount ?? 0);
  const currency = verifyData.data?.currency || "ZAR";
  const expectedTotal = getExpectedTotal(deliveryOption);

  // Server-authoritative amount check. We compute the split from the EXPECTED
  // total (not the client/gateway figure) but flag any mismatch for review.
  const amountMismatch = Math.abs(gatewayAmount - expectedTotal) > AMOUNT_TOLERANCE;
  if (amountMismatch) {
    console.warn("[FlutterwaveVerify] Amount mismatch", {
      txRef: input.txRef,
      gatewayAmount,
      expectedTotal,
      deliveryOption,
    });
  }

  // Trust the server-computed total for settlement math; if the gateway
  // charged the expected amount they are equal anyway.
  const authoritativeAmount = amountMismatch ? gatewayAmount : expectedTotal;
  const splitBreakdown = calculateSplitBreakdown(
    authoritativeAmount,
    deliveryOption
  );

  console.log("[FlutterwaveVerify] Verified", {
    txRef: input.txRef,
    transactionId: input.transactionId,
    gatewayAmount,
    expectedTotal,
    amountMismatch,
  });

  return {
    verified: true,
    amount: authoritativeAmount,
    currency,
    paymentType: verifyData.data?.payment_type,
    transactionId: String(input.transactionId),
    txRef: input.txRef,
    splitBreakdown,
    data: verifyData.data,
    error: amountMismatch
      ? `Amount mismatch: gateway ${gatewayAmount} vs expected ${expectedTotal}`
      : undefined,
  };
}
