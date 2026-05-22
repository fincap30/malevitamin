# WhatsApp Notification Integration Guide

## Overview

The payment system sends WhatsApp notifications to customers after every verified payment using the **Universal WhatsApp Gateway** on CodeWords. This is a shared gateway that any of TJ's sites can plug into, with smart routing to keep conversations isolated per site.

## Universal WhatsApp Gateway

### Key Details

| Property | Value |
|----------|-------|
| Gateway ID | wa_universal_gateway_438e963b |
| Base URL | https://runtime.codewords.ai/run/wa_universal_gateway_438e963b |
| Auth Token | Bearer ***REMOVED-WHATSAPP-GATEWAY-KEY*** |
| Sends from | +27769379301 (Sitewizard) |
| Message format | 🔔 {product}: {message} |
| Smart routing | Replies go ONLY to the site that sent the original message (30-day memory) |

### Currently Registered Sites

- dryeyepro
- callsync
- malevitamine

## How Smart Routing Works

1. Your site sends a message to a customer's phone number with `product: "malevitamine"`
2. The gateway tags that phone number to "malevitamine" (stored for 30 days)
3. When the customer replies, the gateway looks up the tag
4. The reply is forwarded ONLY to the webhook registered under "malevitamine"
5. No cross-site mixing — DryEyePro patients never leak to Male Vitamine

## Registering a New Site

Do this once per site:

```bash
curl --request POST 'https://runtime.codewords.ai/run/wa_universal_gateway_438e963b/sites/register' \
  --header 'Authorization: Bearer ***REMOVED-WHATSAPP-GATEWAY-KEY***' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "yoursitename",
    "webhook_url": "https://yoursite.co.za/api/whatsapp-webhook"
  }'
```

Response: `{"status":"registered","name":"yoursitename","total_sites":3}`

You can register with an empty `webhook_url: ""` and still send messages. Add the webhook later by calling register again with the same name — it updates in place.

## Sending Messages

The payment system sends WhatsApp messages automatically after payment verification. The flow:

1. Customer pays → Payment verified
2. Verify API calls `/api/payment/notify` with `type: "whatsapp"`
3. Notify API calls the Universal Gateway with `{ phone, product, message }`
4. Customer sees: `🔔 malevitamine: Payment Confirmed! ...`

### Manual Send (for testing)

```bash
curl --request POST 'https://runtime.codewords.ai/run/wa_universal_gateway_438e963b' \
  --header 'Authorization: Bearer ***REMOVED-WHATSAPP-GATEWAY-KEY***' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "phone": "+27831234567",
    "product": "malevitamine",
    "message": "Test message from Male Vitamine"
  }'
```

### Send Parameters

| Field | Required | Description |
|-------|----------|-------------|
| phone | Yes | Recipient number. Any format works: +27831234567, 27831234567 |
| product | Yes | Must match your registered site name exactly (lowercase) |
| message | Yes | The notification text |
| cc | No | Optional CC number — gets a copy of the message |

## Receiving Replies

When a customer replies, your webhook at `/api/whatsapp-webhook` receives a POST:

```json
{
  "phone": "+27831234567",
  "message": "Yes I want to book",
  "messageId": "3EB0487AF93A...",
  "timestamp": "2026-05-22T08:15:00Z",
  "from_name": "Johan Botha"
}
```

Your webhook must return: `{"received": true}` (HTTP 200)

If your webhook returns an error (4xx/5xx) or times out (>15s), the gateway logs the failure but doesn't retry.

## Payment Confirmation Message

The default message sent after a verified payment:

```
🔔 malevitamine: Payment Confirmed!

Hi John,

Your payment of *R 850.00* has been received and confirmed.

📦 Your product will be sent to you shortly. You will be informed with tracking details once it ships.

Reference: MV-ABC123

Thank you for your order!
```

Note: The `🔔 malevitamine:` prefix is added automatically by the gateway. The message content should NOT repeat the business name at the top.

## Customizing the Message

Edit the `buildWhatsAppMessage()` function in `/src/app/api/payment/verify/route.ts` to customize the message template for your business.

## Environment Variables

```env
# Required for WhatsApp notifications
WHATSAPP_GATEWAY_URL=https://runtime.codewords.ai/run/wa_universal_gateway_438e963b
WHATSAPP_GATEWAY_KEY=***REMOVED-WHATSAPP-GATEWAY-KEY***
WHATSAPP_PRODUCT_NAME=yoursitename
```

## Gateway Management

| Action | Endpoint | Body |
|--------|----------|------|
| Register / update | POST `/sites/register` | `{"name": "mysite", "webhook_url": "https://..."}` |
| Remove | POST `/sites/remove` | `{"name": "mysite"}` |
| List all | POST `/sites/list` | `{}` |

All endpoints use the base URL + path. Same auth header required.
