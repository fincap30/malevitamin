# Flutterwave API Reference

## Base URL
```
https://api.flutterwave.com/v3
```

## Authentication
All API calls require a Bearer token in the Authorization header:
```
Authorization: Bearer FLWSECK_TEST-your-secret-key
```

---

## Subaccounts

### Create Subaccount
```
POST /subaccounts
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_bank | string | ✅ | Bank code (see bank codes reference) |
| account_number | string | ✅ | Bank account number |
| business_name | string | ✅ | Business or personal name |
| business_email | string | ❌ | Email for the subaccount |
| business_mobile | string | ❌ | Phone number |
| country | string | ❌ | Country code (ZA, NG, etc.) |
| split_type | string | ❌ | "percentage" or "flat" |
| split_value | number | ❌ | Default split value (0.25 for 25%) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 12345,
    "subaccount_id": "RS_FB312AA6C2C84A13421F3079E714F2CB",
    "account_number": "0690000037",
    "account_bank": "050001",
    "business_name": "John Doe",
    "split_type": "percentage",
    "split_value": 0.25
  }
}
```

### List Subaccounts
```
GET /subaccounts
```

### Fetch Subaccount
```
GET /subaccounts/{id}
```

### Update Subaccount
```
PUT /subaccounts/{id}
```

### Delete Subaccount
```
DELETE /subaccounts/{id}
```

---

## Payment Initialization

### Initialize Payment (Inline Checkout)
```
POST /payments
```

**Key Fields for Split Payment:**
| Field | Type | Description |
|-------|------|-------------|
| tx_ref | string | Unique transaction reference |
| amount | number | Payment amount |
| currency | string | Currency code (ZAR, NGN, etc.) |
| customer.email | string | Customer email |
| customer.name | string | Customer name |
| customer.phone_number | string | Customer phone (for WhatsApp) |
| subaccounts | array | Split configuration (see below) |

**Subaccount Object:**
| Field | Type | Description |
|-------|------|-------------|
| id | string | Subaccount ID (RS_xxxxx) |
| transaction_charge_type | string | "percentage", "flat", or "flat_subaccount" |
| transaction_charge | number | The charge amount (for single subaccount) |
| transaction_split_ratio | number | Split ratio (for multiple subaccounts) |

**Example — Two-way split (25/75):**
```json
{
  "tx_ref": "MV-ABC123",
  "amount": 850,
  "currency": "ZAR",
  "subaccounts": [
    { "id": "RS_owner123", "transaction_split_ratio": 1 },
    { "id": "RS_partner456", "transaction_split_ratio": 3 }
  ]
}
```
(1:3 ratio = 25%:75%)

**Example — Single subaccount:**
```json
{
  "subaccounts": [
    {
      "id": "RS_owner123",
      "transaction_charge_type": "percentage",
      "transaction_charge": 0.25
    }
  ]
}
```
(The remaining 75% goes to the main Flutterwave account)

---

## Transaction Verification

### Verify Transaction
```
GET /transactions/{id}/verify
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 123456789,
    "tx_ref": "MV-ABC123",
    "flw_ref": "FLW-MOCK-xxx",
    "amount": 850,
    "currency": "ZAR",
    "charged_amount": 850,
    "status": "successful",
    "payment_type": "card",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+27821234567"
    },
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Split Payment Details

When a payment has subaccounts, Flutterwave automatically:
1. Deducts the transaction fee from the total amount
2. Splits the settlement amount between subaccounts
3. Settles each share to the respective bank account

The settlement timeline depends on Flutterwave's standard settlement schedule (typically T+1 for local transactions).
