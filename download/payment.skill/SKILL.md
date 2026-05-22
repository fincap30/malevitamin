# Payment Skill

Split payment system using Flutterwave. Automatically divides payments between multiple recipients after deducting Flutterwave transaction fees, sends customer confirmations via WhatsApp and email.

## When to Use This Skill

Use this skill whenever the user needs to:
- Accept payments online with Flutterwave
- Split payments between multiple parties (e.g., owner gets 25%, partner gets 75%)
- Send WhatsApp/email confirmations after payment
- Build a checkout flow for any product or service

## CRITICAL: Always Ask the User for Split Configuration

When using this skill on a new site, you MUST ask the user:

1. **"How should payments be split?"** — Get the percentage breakdown and recipient names
   - Example: "25% to me, 75% to JVL" or "50/50 between me and my partner"
   
2. **"What are the Flutterwave subaccount IDs for each recipient?"** — If they don't have them yet, help them create subaccounts

3. **"What is the product name, price, and currency?"** — This goes into the .env configuration

4. **"Do you have a WhatsApp agent endpoint for notifications?"** — If yes, add the URL. If not, leave it empty (notifications will be logged)

NEVER hardcode split percentages — always configure via environment variables so they can be changed without touching code.

## Architecture

```
Customer pays R 850.00
    │
    ▼
Flutterwave Checkout (inline popup)
    │
    ▼
Flutterwave deducts transaction fee (≈2.9% + R1 for South Africa)
    │
    ▼
Remaining amount is split according to .env configuration:
    ├── 25% → Owner subaccount (settled automatically)
    └── 75% → Partner subaccount (settled automatically)
    │
    ▼
Server-side verification → Customer confirmation:
    ├── WhatsApp message: "Payment confirmed, product will be sent"
    └── Email: "Payment confirmed, you'll be informed with tracking"
```

## Step-by-Step Build Instructions

### Step 1: Ask the User for Configuration

Before writing any code, ask:
- Split percentages and recipient names
- Product name, price (in cents), currency
- Whether they have Flutterwave subaccount IDs already
- Whether they have a WhatsApp notification agent

### Step 2: Create the .env Configuration

```env
# Flutterwave Payment Gateway
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx

# Business Info
NEXT_PUBLIC_BUSINESS_NAME=Your Business Name
NEXT_PUBLIC_BUSINESS_EMAIL=payments@yourbusiness.co.za
NEXT_PUBLIC_CURRENCY=ZAR
NEXT_PUBLIC_AMOUNT=85000

# Split Payment Configuration
# Percentages must add up to 100
SPLIT_OWNER_PERCENTAGE=25
SPLIT_PARTNER_PERCENTAGE=75

# Split Labels (shown in confirmation messages and logs)
SPLIT_OWNER_LABEL=Owner
SPLIT_PARTNER_LABEL=JVL

# For 3+ recipients, add:
# SPLIT_PARTNER_2_PERCENTAGE=25
# SPLIT_PARTNER_2_LABEL=Partner 2
# FLUTTERWAVE_PARTNER_2_SUBACCOUNT_ID=RS_xxxxx

# Flutterwave Subaccount IDs (create once via API or Dashboard)
FLUTTERWAVE_OWNER_SUBACCOUNT_ID=RS_xxxxx
FLUTTERWAVE_PARTNER_SUBACCOUNT_ID=RS_xxxxx

# WhatsApp Notification Agent (leave empty to log instead of send)
WHATSAPP_API_URL=
WHATSAPP_API_KEY=

# Email Notification Service (leave empty to log instead of send)
EMAIL_API_URL=
```

### Step 3: Create Flutterwave Subaccounts

Each recipient needs a Flutterwave subaccount. Create them ONCE:

**Option A: Using the setup script**
```bash
npx tsx scripts/setup-subaccounts.ts
```

**Option B: Using cURL**
```bash
# Create subaccount for Owner (25%)
curl --request POST 'https://api.flutterwave.com/v3/subaccounts' \
  --header 'Authorization: Bearer FLWSECK_TEST-your-secret-key' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "account_bank": "050001",
    "account_number": "0690000037",
    "business_name": "Your Name",
    "business_mobile": "08012345678",
    "country": "ZA",
    "split_type": "percentage",
    "split_value": 0.25
  }'
```

Save the `subaccount_id` from each response (e.g., `RS_FB312AA6C2C84A13421F3079E714F2CB`) to your `.env`.

### Step 4: Install the Payment Module Files

Copy these files into the Next.js project:

| File | Destination | Purpose |
|------|------------|---------|
| `lib/flutterwave.ts` | `src/lib/flutterwave.ts` | Core payment library with split logic |
| `components/payment-modal.tsx` | `src/components/payment-modal.tsx` | Checkout modal with form + confirmation |
| `app/api/payment/verify/route.ts` | `src/app/api/payment/verify/route.ts` | Server-side payment verification + notifications |
| `app/api/payment/notify/route.ts` | `src/app/api/payment/notify/route.ts` | WhatsApp/email notification handler |
| `scripts/setup-subaccounts.ts` | `scripts/setup-subaccounts.ts` | Helper to create subaccounts |

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

### Step 6: Customize the UI Theme

The PaymentModal uses these CSS custom properties for theming:
- `gold` / `gold-light` — accent color (change in tailwind.config.ts)
- `text-foreground` — text color (adapts to dark/light mode)
- `bg-[#111110]` / `bg-[#0a0a08]` — card backgrounds

Match these to your site's design system.

### Step 7: Connect WhatsApp Agent (When Ready)

When the user provides a WhatsApp agent endpoint:

1. Set `WHATSAPP_API_URL` in `.env` to the agent's endpoint
2. Set `WHATSAPP_API_KEY` if authentication is needed
3. The agent should accept: `{ phone, message, customerName, amount, currency, txRef }`
4. The system will automatically send WhatsApp messages after every verified payment

### Step 8: Go Live Checklist

- [ ] Replace test API keys with live keys (`FLWPUBK_LIVE-` and `FLWSECK_LIVE-`)
- [ ] Create subaccounts with real bank account details
- [ ] Verify subaccount IDs are correct in `.env`
- [ ] Set WHATSAPP_API_URL to your WhatsApp agent
- [ ] Test with a small real transaction
- [ ] Confirm both recipients receive their share in Flutterwave dashboard
- [ ] Verify customer receives WhatsApp confirmation

## Split Calculation

The split is calculated AFTER Flutterwave deducts its transaction fee:

```
Customer pays: R 850.00
Flutterwave fee (2.9% + R1): -R 25.65
Settlement amount: R 824.35

Owner (25%): R 206.09
Partner (75%): R 618.26
```

## Flutterwave Fee Reference

| Country | Local Cards | International Cards |
|---------|------------|-------------------|
| South Africa | 2.9% + ZAR1 | 4.8% |
| Nigeria | 2.0% | 4.8% |
| Ghana | 2.6% | 4.8% |
| Kenya | 3.2% | 4.8% |

## Key Design Decisions

1. **Subaccounts, not manual transfers** — Flutterwave splits at payment time, so money goes directly to each party's bank account. No need to manually initiate transfers after each payment.

2. **Percentage-based splits** — Safer than flat amounts because they work regardless of payment amount. If the product price changes, the split still works correctly.

3. **Phone number required** — WhatsApp is the primary notification channel for order confirmations and shipping updates.

4. **Notification system is pluggable** — WhatsApp and email endpoints are configured via env vars. If not set, notifications are logged (not lost). This lets you develop without WhatsApp and add it later.

5. **Demo mode** — When Flutterwave keys are placeholders, the system simulates the full flow (including notifications) so you can test the UI without real transactions.
