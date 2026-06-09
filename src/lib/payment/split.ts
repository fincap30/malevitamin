// Split-payment calculator — SINGLE SOURCE OF TRUTH.
//
// Imported by both the client (src/lib/flutterwave.ts) and the server
// (payment verification route / services). Previously this logic was
// duplicated in two places and could drift; keep all split math here.
//
// PAYMENT LOGIC:
// 1. Customer pays total = product price + delivery fee.
// 2. Flutterwave deducts its fee from the total.
// 3. Owner and Partner split the PRODUCT portion (after fees) by percentage.
// 4. The delivery fee goes ENTIRELY to the partner (who handles fulfilment).
//
// Example: R 850 product, speed delivery (R 119) => R 969 total
//   - Flutterwave fee (2.9% + R1): ~R 29.10
//   - Settlement: ~R 939.90
//   - Delivery to partner: R 119.00
//   - Split pool: R 939.90 - R 119.00 = R 820.90
//   - Owner (25%): R 205.23
//   - Partner (75% + delivery): R 615.68 + R 119.00 = R 734.68

import type { DeliveryOption, SplitBreakdown } from "./types";

/** Flutterwave South Africa local-card fee estimate: 2.9% + R1. */
export const FLUTTERWAVE_FEE_RATE = 0.029;
export const FLUTTERWAVE_FEE_FLAT = 1;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Product price (Rands) derived from NEXT_PUBLIC_AMOUNT (cents). */
export function getProductPrice(): number {
  return Number(process.env.NEXT_PUBLIC_AMOUNT || 85000) / 100;
}

/** Delivery fee (Rands) for the selected option, from env (cents). */
export function getDeliveryFee(deliveryOption: DeliveryOption = "normal"): number {
  const normalFee = Number(process.env.DELIVERY_FEE_NORMAL || 8900) / 100;
  const speedFee = Number(process.env.DELIVERY_FEE_SPEED || 11900) / 100;
  return deliveryOption === "speed" ? speedFee : normalFee;
}

/** Owner split percentage (defaults to 25). */
export function getOwnerPercentage(): number {
  return Number(process.env.SPLIT_OWNER_PERCENTAGE || 25);
}

export function getOwnerLabel(): string {
  return process.env.SPLIT_OWNER_LABEL || "Owner";
}

export function getPartnerLabel(): string {
  return process.env.SPLIT_PARTNER_LABEL || "JVL";
}

/** Estimate the payment-gateway fee for a given total. */
export function estimateGatewayFee(totalAmount: number): number {
  return totalAmount * FLUTTERWAVE_FEE_RATE + FLUTTERWAVE_FEE_FLAT;
}

/**
 * Calculate the settlement breakdown for an order.
 *
 * @param totalAmount  Total amount charged to the customer (product + delivery).
 * @param deliveryOption  "normal" | "speed".
 */
export function calculateSplitBreakdown(
  totalAmount: number,
  deliveryOption: DeliveryOption = "normal"
): SplitBreakdown {
  const flutterwaveFee = estimateGatewayFee(totalAmount);
  const afterFeeAmount = totalAmount - flutterwaveFee;

  const deliveryFee = getDeliveryFee(deliveryOption);
  const productPrice = totalAmount - deliveryFee;

  // The percentage split applies only to the product pool (after fees),
  // never to the delivery fee.
  const splitPool = afterFeeAmount - deliveryFee;

  const ownerPercentage = getOwnerPercentage();
  const ownerShare = splitPool * (ownerPercentage / 100);
  const partnerGrossShare = splitPool * ((100 - ownerPercentage) / 100);
  const partnerNetShare = partnerGrossShare + deliveryFee;

  const splits = [
    {
      label: getOwnerLabel(),
      percentage: ownerPercentage,
      amount: round2(ownerShare),
      note: `${ownerPercentage}% of product after fees`,
    },
    {
      label: getPartnerLabel(),
      percentage: 100 - ownerPercentage,
      amount: round2(partnerGrossShare),
      note: `${100 - ownerPercentage}% of product + delivery (R ${deliveryFee.toFixed(2)})`,
    },
  ];

  return {
    totalAmount: round2(totalAmount),
    productPrice: round2(productPrice),
    flutterwaveFee: round2(flutterwaveFee),
    afterFeeAmount: round2(afterFeeAmount),
    deliveryFee: round2(deliveryFee),
    splitPool: round2(splitPool),
    ownerShare: round2(ownerShare),
    partnerGrossShare: round2(partnerGrossShare),
    partnerNetShare: round2(partnerNetShare),
    settlementAmount: round2(afterFeeAmount),
    splits,
  };
}

/**
 * Compute the expected total a customer should be charged for the given
 * delivery option. Used server-side to validate the gateway-reported amount
 * (prevents the client from dictating the price).
 */
export function getExpectedTotal(deliveryOption: DeliveryOption = "normal"): number {
  return round2(getProductPrice() + getDeliveryFee(deliveryOption));
}
