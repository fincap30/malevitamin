# WhatsApp Notification Integration Guide

## Overview

The payment system sends WhatsApp notifications to customers after every verified payment. The notification confirms the payment amount and tells the customer their product will be sent with tracking details to follow.

## Current Architecture

When a payment is verified:
1. The verify API (`/api/payment/verify`) calls the notify API (`/api/payment/notify`)
2. The notify API checks if `WHATSAPP_API_URL` is configured
3. If configured, sends the message to the WhatsApp agent
4. If not configured, logs the message (for development)

## Connecting Your WhatsApp Agent

When you have a WhatsApp agent ready:

### Step 1: Set the Environment Variables

```env
WHATSAPP_API_URL=https://your-whatsapp-agent.example.com/send
WHATSAPP_API_KEY=your-api-key-if-needed
```

### Step 2: Expected Agent API Contract

Your WhatsApp agent should accept POST requests with this body:

```json
{
  "phone": "+27821234567",
  "message": "✅ *Male Vitamine - Payment Confirmed!*\n\nHi John,\n\nYour payment of *R 850.00* has been received and confirmed.\n\n📦 Your product will be sent to you shortly. You will be informed with tracking details once it ships.\n\nReference: MV-ABC123\n\nThank you for your order!\n\n— Male Vitamine",
  "customerName": "John",
  "amount": 850,
  "currency": "ZAR",
  "txRef": "MV-ABC123",
  "transactionId": 123456789
}
```

### Step 3: Supported WhatsApp Agents

The system works with any WhatsApp Business API provider:

- **Twilio WhatsApp API**
- **MessageBird**
- **360dialog**
- **Wati**
- **Custom WhatsApp Business API endpoint**
- **Any agent that accepts the JSON format above**

### Step 4: Phone Number Format

The customer's phone number is captured during checkout and passed to the WhatsApp agent. Make sure:
- Numbers include the country code (e.g., `+27` for South Africa)
- The WhatsApp agent can handle the format you're capturing
- The form validates phone numbers (minimum 10 digits)

## Message Template

The default WhatsApp message sent to customers:

```
✅ *{Business Name} - Payment Confirmed!*

Hi {Customer Name},

Your payment of *{Currency Symbol} {Amount}* has been received and confirmed.

📦 Your product will be sent to you shortly. You will be informed with tracking details once it ships.

Reference: {Transaction Reference}

Thank you for your order!

— {Business Name}
```

## Customizing the Message

Edit the `buildWhatsAppMessage()` function in `/src/app/api/payment/verify/route.ts` to customize the message template for your business.

## Testing Without WhatsApp

During development, leave `WHATSAPP_API_URL` empty. All notifications will be logged to the console with the full message content. This lets you verify the message format before connecting your WhatsApp agent.
