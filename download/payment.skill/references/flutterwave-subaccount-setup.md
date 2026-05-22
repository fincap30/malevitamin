# Flutterwave Subaccount Setup Guide

## Overview

Subaccounts are Flutterwave's way of splitting payments automatically. You create a subaccount for each recipient, then reference those subaccounts during payment initialization. Flutterwave handles the split and settlement — no manual transfers needed.

## Creating Subaccounts

### Via API (Programmatic)

```bash
# Create subaccount for a recipient
curl --request POST 'https://api.flutterwave.com/v3/subaccounts' \
  --header 'Authorization: Bearer FLWSECK_TEST-your-secret-key' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "account_bank": "050001",
    "account_number": "0690000037",
    "business_name": "John Doe",
    "business_mobile": "08012345678",
    "business_email": "john@example.com",
    "country": "ZA",
    "split_type": "percentage",
    "split_value": 0.25
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Subaccount created",
  "data": {
    "id": 12345,
    "account_number": "0690000037",
    "account_bank": "050001",
    "business_name": "John Doe",
    "subaccount_id": "RS_FB312AA6C2C84A13421F3079E714F2CB",
    "split_type": "percentage",
    "split_value": 0.25
  }
}
```

Save the `subaccount_id` (starts with `RS_`) to your `.env` file.

### Via Dashboard (Manual)

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to Settings → Subaccounts
3. Click "Add Subaccount"
4. Enter bank details for each recipient
5. Copy the generated subaccount ID

### Via Setup Script

```bash
npx tsx scripts/setup-subaccounts.ts
```

This script will:
1. Prompt for each recipient's bank details
2. Call the Flutterwave API to create subaccounts
3. Output the subaccount IDs to add to `.env`

## Bank Codes Reference (South Africa)

| Bank | Code |
|------|------|
| ABSA | 632005 |
| Capitec | 470010 |
| FNB | 250655 |
| Nedbank | 198765 |
| Standard Bank | 051001 |
| Investec | 580105 |

## Managing Subaccounts

### List All Subaccounts
```bash
curl --request GET 'https://api.flutterwave.com/v3/subaccounts' \
  --header 'Authorization: Bearer FLWSECK_TEST-your-secret-key'
```

### Update a Subaccount
```bash
curl --request PUT 'https://api.flutterwave.com/v3/subaccounts/12345' \
  --header 'Authorization: Bearer FLWSECK_TEST-your-secret-key' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "business_name": "John Doe Updated",
    "account_bank": "250655",
    "account_number": "0690000037"
  }'
```

### Delete a Subaccount
```bash
curl --request DELETE 'https://api.flutterwave.com/v3/subaccounts/12345' \
  --header 'Authorization: Bearer FLWSECK_TEST-your-secret-key'
```

## Important Notes

1. **Bank details are stored with Flutterwave, not in your code** — This is more secure. If bank details change, update the subaccount in Flutterwave's dashboard, not in your codebase.

2. **Subaccount IDs are permanent** — Once created, the `RS_` ID doesn't change even if you update the bank details.

3. **Split type on subaccount vs. split in payment** — The `split_type` and `split_value` on the subaccount are defaults. The payment initialization can override these with `transaction_charge_type` and `transaction_charge` or `transaction_split_ratio`.

4. **Verification** — Subaccounts may need to be verified by Flutterwave before they can receive settlements. Check the verification status in your dashboard.

5. **Currency** — Make sure the subaccount's bank account accepts the currency you're charging in. For South Africa, the bank account should accept ZAR.
