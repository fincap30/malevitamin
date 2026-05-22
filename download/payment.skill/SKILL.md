# Payment Skill — JVL Payment System

Split payment system using Flutterwave with automatic distribution after deducting Flutterwave fees and delivery costs. Sends customer confirmations via WhatsApp and email. Sends order details to JVL for shipping.

## When to Use This Skill

Use this skill whenever the user needs to:
- Accept payments online with Flutterwave
- Split payments between TJ (25% clean) and JVL (75% minus costs)
- Send WhatsApp/email confirmations after payment
- Forward delivery details to JVL for shipping
- Build a checkout flow for any JVL product or service

## CRITICAL: Always Ask the User for Configuration

When using this skill on a new site, you MUST ask the user:

1. **"What is the product name, price, and currency?"**
2. **"What should the WhatsApp product name be?"** (lowercase, for the gateway registration)
3. **"What are the delivery fees?"** (normal and speed, if different from default R89/R119)
4. **"What is the JVL notification phone number?"** (for order details + shipping)

The 25/75 split between TJ and JVL is STANDARD for all JVL sites. Do not change it unless explicitly asked.

## Payment Logic (IMPORTANT)

The split works as follows:

```
Customer pays: R 850.00
    │
    ▼
Flutterwave deducts fee (≈2.9% + R1 = R 25.65)
    │  ← JVL bears this cost
    ▼
TJ gets 25% of GROSS: R 212.50 (CLEAN — no deductions)
    │
    ▼
JVL gets the remaining: R 850 - R 212.50 - R 25.65 = R 611.85
    │
    ▼
JVL deducts delivery fee:
    ├── Normal: -R 89.00 → JVL net: R 522.85
    └── Speed:  -R 119.00 → JVL net: R 492.85
```

**Key rules:**
1. TJ gets 25% of the PRODUCT PRICE — clean, no deductions
2. JVL bears the Flutterwave transaction fee
3. JVL bears the delivery fee (customer does NOT pay extra for delivery)
4. JVL receives order details via WhatsApp (name, address, product, delivery option)

## Bank Accounts (for Flutterwave Subaccounts)

These are used for ALL JVL sites:

### TJ Schoeman (Owner — 25%)
- Bank: Capitec
- Account Name: TJ Schoeman
- Account Number: 2084281365

### JVL Headquarters (Partner — 75%)
- Bank: Standard Bank
- Account Name: JVL Headquarters PTY Ltd
- Account Number: 253215811
- Branch: Menlyn

## Step-by-Step Build Instructions

### Step 1: Register on WhatsApp Gateway

```bash
curl --request POST 'https://runtime.codewords.ai/run/wa_universal_gateway_438e963b/sites/register' \
  --header 'Authorization: Bearer ***REMOVED-WHATSAPP-GATEWAY-KEY***' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "yoursitename",
    "webhook_url": "https://yoursite.co.za/api/whatsapp-webhook"
  }'
```

### Step 2: Create the .env Configuration

```env
# Flutterwave Payment Gateway
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx

# Business Info
NEXT_PUBLIC_BUSINESS_NAME=Your Product Name
NEXT_PUBLIC_BUSINESS_EMAIL=orders@yoursite.co.za
NEXT_PUBLIC_CURRENCY=ZAR
NEXT_PUBLIC_AMOUNT=85000

# ──── SPLIT PAYMENT ────
SPLIT_OWNER_PERCENTAGE=25
SPLIT_PARTNER_PERCENTAGE=75
SPLIT_OWNER_LABEL=TJ Schoeman
SPLIT_PARTNER_LABEL=JVL

# ──── BANK DETAILS ────
OWNER_BANK=Capitec
OWNER_ACCOUNT_NAME=TJ Schoeman
OWNER_ACCOUNT_NUMBER=2084281365

PARTNER_BANK=Standard Bank
PARTNER_ACCOUNT_NAME=JVL Headquarters PTY Ltd
PARTNER_ACCOUNT_NUMBER=253215811
PARTNER_BRANCH=Menlyn

# Flutterwave Subaccount IDs
FLUTTERWAVE_OWNER_SUBACCOUNT_ID=RS_xxxxx
FLUTTERWAVE_PARTNER_SUBACCOUNT_ID=RS_xxxxx

# ──── DELIVERY ────
DELIVERY_FEE_NORMAL=8900
DELIVERY_FEE_SPEED=11900
DELIVERY_CURRENCY=ZAR

# ──── JVL NOTIFICATION ────
JVL_NOTIFICATION_PHONE=+27XXXXXXXXX

# ──── WHATSAPP GATEWAY ────
WHATSAPP_GATEWAY_URL=https://runtime.codewords.ai/run/wa_universal_gateway_438e963b
WHATSAPP_GATEWAY_KEY=***REMOVED-WHATSAPP-GATEWAY-KEY***
WHATSAPP_PRODUCT_NAME=yoursitename

EMAIL_API_URL=
```

### Step 3: Create Flutterwave Subaccounts

Create subaccounts for TJ and JVL ONCE using their bank details above:

```bash
# TJ Schoeman (Capitec)
curl --request POST 'https://api.flutterwave.com/v3/subaccounts' \
  --header 'Authorization: Bearer YOUR_SECRET_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "account_bank": "470010",
    "account_number": "2084281365",
    "business_name": "TJ Schoeman",
    "country": "ZA",
    "split_type": "percentage",
    "split_value": 0.25
  }'

# JVL Headquarters (Standard Bank - Menlyn)
curl --request POST 'https://api.flutterwave.com/v3/subaccounts' \
  --header 'Authorization: Bearer YOUR_SECRET_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "account_bank": "051001",
    "account_number": "253215811",
    "business_name": "JVL Headquarters PTY Ltd",
    "business_mobile": "0123456789",
    "country": "ZA",
    "split_type": "percentage",
    "split_value": 0.75
  }'
```

Save the `subaccount_id` (starts with `RS_`) from each response to `.env`.

### Step 4: Install the Payment Module Files

| File | Destination | Purpose |
|------|------------|---------|
| `lib/flutterwave.ts` | `src/lib/flutterwave.ts` | Core payment library with JVL split logic |
| `components/payment-modal.tsx` | `src/components/payment-modal.tsx` | Checkout with delivery address + speed options |
| `app/api/payment/verify/route.ts` | `src/app/api/payment/verify/route.ts` | Verification + JVL/customer notifications |
| `app/api/payment/notify/route.ts` | `src/app/api/payment/notify/route.ts` | WhatsApp gateway handler |
| `app/api/whatsapp-webhook/route.ts` | `src/app/api/whatsapp-webhook/route.ts` | Receives customer replies |

### Step 5: Add the Payment Modal to Your Page

```tsx
import { PaymentModal } from "@/components/payment-modal";

function MyPage() {
  const [showPayment, setShowPayment] = useState(false);
  return (
    <>
      <Button onClick={() => setShowPayment(true)}>Order Now</Button>
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </>
  );
}
```

## WhatsApp Notifications After Payment

After every verified payment, TWO WhatsApp messages are sent:

### 1. Customer Message
```
🔔 malevitamine: Payment Confirmed!

Hi John,

Your payment of *R 850.00* has been received and confirmed.

📦 Your product will be sent to:
123 Main Street, Pretoria

🚚 Delivery: Normal (5-7 days)

You will be informed with tracking details once it ships.

Reference: MV-ABC123

Thank you for your order!
```

### 2. JVL Message (Order Details for Shipping)
```
🔔 malevitamine: NEW ORDER — Male Vitamine

Customer: John Doe
Phone: +27831234567
Address: 123 Main Street, Pretoria

Product: Male Vitamine
Amount: R 850.00
Delivery: Normal 5-7 days (R 89.00)

Reference: MV-ABC123

--- PAYMENT SPLIT ---
TJ (25% clean): R 212.50
Flutterwave fee: -R 25.65
Delivery fee: -R 89.00
JVL (net): R 522.85

Please ship to customer at the above address.
```

## Split Calculation Examples

### R 850.00 — Normal Delivery (R 89)
| Item | Amount |
|------|--------|
| Customer pays | R 850.00 |
| TJ (25% clean) | R 212.50 |
| Flutterwave fee (from JVL) | -R 25.65 |
| Delivery fee (from JVL) | -R 89.00 |
| **JVL net** | **R 522.85** |

### R 850.00 — Speed Delivery (R 119)
| Item | Amount |
|------|--------|
| Customer pays | R 850.00 |
| TJ (25% clean) | R 212.50 |
| Flutterwave fee (from JVL) | -R 25.65 |
| Delivery fee (from JVL) | -R 119.00 |
| **JVL net** | **R 492.85** |

## Checkout Form Fields

The checkout form collects:
1. **Full Name** (required)
2. **Email Address** (required)
3. **WhatsApp / Phone Number** (required — for order updates)
4. **Delivery Address** (required — forwarded to JVL for shipping)
5. **Delivery Speed** — Normal (R 89, 5-7 days) or Speed (R 119, 2-3 days)

## Flutterwave Fee Reference

| Country | Local Cards | International Cards |
|---------|------------|-------------------|
| South Africa | 2.9% + ZAR1 | 4.8% |
| Nigeria | 2.0% | 4.8% |
| Ghana | 2.6% | 4.8% |
| Kenya | 3.2% | 4.8% |

## Go Live Checklist

- [ ] Replace test API keys with live keys
- [ ] Create Flutterwave subaccounts with TJ and JVL bank details
- [ ] Verify subaccount IDs in `.env`
- [ ] Register site on WhatsApp Gateway
- [ ] Set JVL_NOTIFICATION_PHONE to JVL's WhatsApp number
- [ ] Test with a small real transaction
- [ ] Confirm both TJ and JVL receive their share
- [ ] Verify JVL receives WhatsApp with order details
- [ ] Verify customer receives WhatsApp confirmation
