---
Task ID: 3
Agent: Main Agent
Task: Implement JVL payment skill with bank accounts, delivery fees, and JVL order notifications

Work Log:
- Updated .env with:
  - TJ Schoeman bank details (Capitec, 2084281365)
  - JVL bank details (Standard Bank, 253215811, Menlyn)
  - Delivery fees (R89 normal, R119 speed)
  - JVL_NOTIFICATION_PHONE configuration
- Rewrote src/lib/flutterwave.ts with new JVL split logic:
  - TJ gets 25% of GROSS amount (clean, no deductions)
  - JVL gets remaining after TJ's share and Flutterwave fee
  - Delivery fee deducted from JVL's share
  - Added DeliveryOption type and DELIVERY config
  - Added deliveryAddress and deliveryOption to initiatePayment and verifyPayment
- Rewrote src/components/payment-modal.tsx:
  - Added delivery address field (required)
  - Added delivery speed selector (Normal R89 / Speed R119)
  - Updated confirmation screens with delivery details
  - Split breakdown now shows TJ clean + JVL net after costs
- Rewrote src/app/api/payment/verify/route.ts:
  - Added JVL WhatsApp notification with full order details
  - Customer gets: payment confirmed + delivery address + tracking promise
  - JVL gets: customer name, phone, address, product, delivery option, payment split
  - Both notifications go through /api/payment/notify → WhatsApp Gateway
- Updated payment.skill/SKILL.md with:
  - JVL-specific payment logic (25% TJ clean, JVL bears costs)
  - Bank account details for both parties
  - Delivery fee configuration
  - Example WhatsApp messages for both customer and JVL
  - Split calculation examples
- Tested JVL WhatsApp notification — message delivered successfully
- Build verified clean with all routes working

Stage Summary:
- JVL payment skill fully implemented
- Payment logic: TJ gets 25% clean, JVL gets remainder minus Flutterwave fee and delivery
- JVL receives WhatsApp with order details for shipping
- Customer receives WhatsApp with delivery confirmation
- Delivery options: Normal (R89, 5-7 days) or Speed (R119, 2-3 days)
- Delivery address collected at checkout and forwarded to JVL
- Bank details stored in .env for Flutterwave subaccount creation
