/**
 * Setup Script: Create Flutterwave Subaccounts
 * 
 * Run this ONCE to create subaccounts for each payment recipient.
 * The script will output subaccount IDs to add to your .env file.
 * 
 * Usage:
 *   npx tsx scripts/setup-subaccounts.ts
 * 
 * Or with Node.js (after compiling):
 *   node scripts/setup-subaccounts.js
 */

const FLUTTERWAVE_BASE = "https://api.flutterwave.com/v3";

// Read from environment or set directly
const SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

if (!SECRET_KEY || SECRET_KEY.includes("your-secret-key")) {
  console.error("❌ Error: Set FLUTTERWAVE_SECRET_KEY in your .env file first");
  console.error("   Example: FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx");
  process.exit(1);
}

interface SubaccountConfig {
  label: string;
  bankCode: string;
  accountNumber: string;
  businessName: string;
  businessMobile: string;
  country: string;
  splitType: "percentage" | "flat";
  splitValue: number;
  envVarName: string;
}

// ============================================================
// CONFIGURE YOUR SUBACCOUNTS HERE
// ============================================================
const subaccounts: SubaccountConfig[] = [
  {
    label: "Owner (You) — 25%",
    bankCode: "050002", // FNB — change to your bank
    accountNumber: "4020123456", // Your bank account number
    businessName: "Your Name", // Your name or business name
    businessMobile: "0821234567", // Your phone number
    country: "ZA",
    splitType: "percentage",
    splitValue: 0.25,
    envVarName: "FLUTTERWAVE_OWNER_SUBACCOUNT_ID",
  },
  {
    label: "Partner (JVL) — 75%",
    bankCode: "050002", // FNB — change to JVL's bank
    accountNumber: "4020987654", // JVL's bank account number
    businessName: "JVL",
    businessMobile: "0829876543", // JVL's phone number
    country: "ZA",
    splitType: "percentage",
    splitValue: 0.75,
    envVarName: "FLUTTERWAVE_PARTNER_SUBACCOUNT_ID",
  },
];

async function createSubaccount(config: SubaccountConfig) {
  console.log(`\n📋 Creating subaccount: ${config.label}`);
  console.log(`   Bank: ${config.bankCode}`);
  console.log(`   Account: ${config.accountNumber}`);
  console.log(`   Business: ${config.businessName}`);
  console.log(`   Split: ${config.splitType} — ${config.splitValue}`);

  const response = await fetch(`${FLUTTERWAVE_BASE}/subaccounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_bank: config.bankCode,
      account_number: config.accountNumber,
      business_name: config.businessName,
      business_mobile: config.businessMobile,
      country: config.country,
      split_type: config.splitType,
      split_value: config.splitValue,
    }),
  });

  const data = await response.json();

  if (data.status === "success") {
    console.log(`   ✅ Created! Subaccount ID: ${data.data.subaccount_id}`);
    console.log(`   Bank verified: ${data.data.bank_name}`);
    console.log(`   Account holder: ${data.data.full_name}`);
    return {
      label: config.label,
      envVarName: config.envVarName,
      subaccountId: data.data.subaccount_id,
      bankName: data.data.bank_name,
      fullName: data.data.full_name,
    };
  } else {
    console.error(`   ❌ Failed: ${data.message}`);
    return null;
  }
}

async function main() {
  console.log("🚀 Flutterwave Subaccount Setup");
  console.log("================================\n");

  const results = [];

  for (const config of subaccounts) {
    const result = await createSubaccount(config);
    if (result) {
      results.push(result);
    }
  }

  console.log("\n\n📝 Add these to your .env file:");
  console.log("================================");
  for (const result of results) {
    console.log(`${result.envVarName}=${result.subaccountId}`);
  }

  if (results.length === 0) {
    console.log("\n❌ No subaccounts were created. Check your bank details and API key.");
  } else {
    console.log(
      `\n✅ ${results.length} subaccount(s) created successfully!`
    );
    console.log(
      "   Payments will now be automatically split when these IDs are in your .env"
    );
  }
}

main().catch(console.error);
