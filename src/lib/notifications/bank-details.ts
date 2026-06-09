// Bank-account details for settlement, sourced from environment variables.
//
// Previously these were hardcoded inside message/email builders, which meant a
// change of bank required a code edit. They now read from env with the current
// production values as documented fallbacks so behaviour is unchanged.

export interface BankDetails {
  bank: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

/** Partner (JVL) settlement account — receives 75% of product + delivery. */
export function getPartnerBankDetails(): BankDetails {
  return {
    bank: process.env.PARTNER_BANK || "Standard Bank",
    accountName: process.env.PARTNER_ACCOUNT_NAME || "JVL Headquarters PTY Ltd",
    accountNumber: process.env.PARTNER_ACCOUNT_NUMBER || "253215811",
    branch: process.env.PARTNER_BRANCH || "Menlyn",
  };
}

/** Owner settlement account — receives 25% of product after fees. */
export function getOwnerBankDetails(): BankDetails {
  return {
    bank: process.env.OWNER_BANK || "Capitec",
    accountName: process.env.OWNER_ACCOUNT_NAME || "Theunis J Schoeman",
    accountNumber: process.env.OWNER_ACCOUNT_NUMBER || "2399132838",
    branch: process.env.OWNER_BRANCH || "470010",
  };
}

/** Human-readable delivery label for the selected option. */
export function deliveryLabel(deliveryOption: string): string {
  return deliveryOption === "speed" ? "Speed (2-3 days)" : "Normal (5-7 days)";
}
