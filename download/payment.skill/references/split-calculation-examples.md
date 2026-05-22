# Split Calculation Examples

## How the Split Works

1. Customer pays the full amount
2. Flutterwave deducts its transaction fee
3. The remaining settlement amount is split between recipients
4. Each recipient's share = settlement × (their percentage / 100)

## South Africa (ZAR) — Local Card

### R 850.00 with 25/75 split

| Item | Amount |
|------|--------|
| Customer pays | R 850.00 |
| Flutterwave fee (2.9% + R1) | -R 25.65 |
| **Settlement amount** | **R 824.35** |
| Owner receives (25%) | R 206.09 |
| Partner receives (75%) | R 618.26 |

**Verification:** R 206.09 + R 618.26 = R 824.35 ✅

### R 850.00 with 50/50 split

| Item | Amount |
|------|--------|
| Customer pays | R 850.00 |
| Flutterwave fee (2.9% + R1) | -R 25.65 |
| **Settlement amount** | **R 824.35** |
| Owner receives (50%) | R 412.18 |
| Partner receives (50%) | R 412.18 |

### R 1,500.00 with 40/35/25 three-way split

| Item | Amount |
|------|--------|
| Customer pays | R 1,500.00 |
| Flutterwave fee (2.9% + R1) | -R 44.50 |
| **Settlement amount** | **R 1,455.50** |
| Owner receives (40%) | R 582.20 |
| Partner 1 receives (35%) | R 509.43 |
| Partner 2 receives (25%) | R 363.88 |

**Verification:** R 582.20 + R 509.43 + R 363.88 = R 1,455.51 ✅ (R0.01 rounding)

## South Africa (ZAR) — International Card

### R 850.00 with 25/75 split

| Item | Amount |
|------|--------|
| Customer pays | R 850.00 |
| Flutterwave fee (4.8%) | -R 40.80 |
| **Settlement amount** | **R 809.20** |
| Owner receives (25%) | R 202.30 |
| Partner receives (75%) | R 606.90 |

## Nigeria (NGN) — Local Card

### ₦50,000 with 25/75 split

| Item | Amount |
|------|--------|
| Customer pays | ₦50,000.00 |
| Flutterwave fee (2.0%) | -₦1,000.00 |
| **Settlement amount** | **₦49,000.00** |
| Owner receives (25%) | ₦12,250.00 |
| Partner receives (75%) | ₦36,750.00 |

## Kenya (KES) — Local Card

### KES 10,000 with 30/70 split

| Item | Amount |
|------|--------|
| Customer pays | KES 10,000.00 |
| Flutterwave fee (3.2%) | -KES 320.00 |
| **Settlement amount** | **KES 9,680.00** |
| Owner receives (30%) | KES 2,904.00 |
| Partner receives (70%) | KES 6,776.00 |

## Rounding

The split calculations use JavaScript's standard floating-point arithmetic. For display:
- Round to 2 decimal places using `Math.round(amount * 100) / 100`
- Small rounding differences (R0.01) are normal and expected
- Flutterwave handles the actual settlement amounts, which may differ slightly from estimates

## Fee Summary by Country

| Country | Currency | Local Cards | International Cards | Mobile Money |
|---------|----------|------------|-------------------|-------------|
| South Africa | ZAR | 2.9% + R1 | 4.8% | — |
| Nigeria | NGN | 2.0% | 4.8% | — |
| Ghana | GHS | 2.6% | 4.8% | 2% |
| Kenya | KES | 3.2% | 4.8% | 2.9% |
| Uganda | UGX | 3.0% | 4.8% | 2% |
| Tanzania | TZS | 3.2% | 4.8% | 2.4% |

> Note: A 7.5% VAT applies on the Flutterwave transaction fee for split payments.
