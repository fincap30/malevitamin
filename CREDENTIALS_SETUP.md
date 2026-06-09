# Credentials & Environment Setup Guide

This guide explains every environment variable the **Male Vitamin** app uses, where
to obtain each value, how to configure them for local development, and the security
rules everyone on the project must follow.

> **Golden rule:** real secrets live **only** in your local, git-ignored `.env` file
> (or your host's secret manager). They are **never** committed to git, pasted into
> chat/issues, or stored in the `download/` folder.

---

## 1. Quick start

```bash
# 1. Copy the template
cp .env.example .env

# 2. Open .env and fill in the real values (see the table below)
#    Use TEST keys while developing.

# 3. Install dependencies and generate the Prisma client
bun install        # or: npm install
bun run db:generate

# 4. Run the dev server
bun run dev        # http://localhost:3000
```

`.env` is already listed in `.gitignore`, so it will not be committed. Confirm with:

```bash
git check-ignore .env      # should print ".env"
git status                 # .env should NOT appear
```

---

## 2. Which credentials are needed

Variables are grouped by feature. Only the **Core** group is required to boot the app;
the others enable payments and notifications.

### Core (required to run)

| Variable | Purpose | Example / Notes |
|---|---|---|
| `DATABASE_URL` | Prisma DB connection | `file:./db/custom.db` for local SQLite |
| `NEXT_PUBLIC_BUSINESS_NAME` | Product/brand name shown in UI | `Male Vitamin` |
| `NEXT_PUBLIC_AMOUNT` | Product price in **cents** | `85000` = R 850.00 |
| `NEXT_PUBLIC_CURRENCY` | Currency code | `ZAR` |
| `DELIVERY_FEE_NORMAL` / `DELIVERY_FEE_SPEED` | Delivery fees in cents | `8900` / `11900` |

### Payments — Flutterwave

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Public key (sent to the browser) |
| `FLUTTERWAVE_SECRET_KEY` | Secret key (server-only, used for verification) |
| `FLUTTERWAVE_OWNER_SUBACCOUNT_ID` | Subaccount for settlement recipient #1 |
| `FLUTTERWAVE_PARTNER_SUBACCOUNT_ID` | Subaccount for settlement recipient #2 |
| `SPLIT_OWNER_PERCENTAGE` / `SPLIT_PARTNER_PERCENTAGE` | Split ratios |
| `SPLIT_*_LABEL`, `SPLIT_PARTNER_2_*`, `SPLIT_PARTNER_3_*` | Optional extra split recipients |

### Bank details (settlement / notification copy) — sensitive PII

| Variable | Purpose |
|---|---|
| `OWNER_BANK`, `OWNER_ACCOUNT_NAME`, `OWNER_ACCOUNT_NUMBER`, `OWNER_BRANCH` | Recipient #1 bank info |
| `OWNER_PHONE`, `OWNER_SALE_EMAIL` | Owner notification targets |
| `PARTNER_BANK`, `PARTNER_ACCOUNT_NAME`, `PARTNER_ACCOUNT_NUMBER`, `PARTNER_BRANCH` | Recipient #2 bank info |

### Notifications — WhatsApp gateway

| Variable | Purpose |
|---|---|
| `WHATSAPP_GATEWAY_URL` | Gateway endpoint |
| `WHATSAPP_GATEWAY_KEY` | Bearer token for the gateway |
| `WHATSAPP_PRODUCT_NAME` | Registered product/site name |
| `JVL_PHONE_NICO`, `JVL_PHONE_ANA`, `JVL_PHONE_CHALYN`, `JVL_PHONE_JACQUES` | Partner WhatsApp recipients (international format `+27...`) |

### Notifications — Email

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | SMTP credentials for nodemailer (`/api/send-email`) |
| `JVL_SALE_EMAIL` | Partner sale-notification email |
| `EMAIL_API_URL` | Optional alternative to SMTP |

### Deployment — Cloudflare (optional)

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_EMAIL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_KEY` | Cloudflare API auth |
| `CLOUDFLARE_WORKER_NAME`, `CLOUDFLARE_WORKERS_DEV_ROUTE` | Worker proxy config |

> If a notification/payment service is left blank, the app degrades gracefully and
> logs the action instead of sending it (useful for local development).

---

## 3. Where to obtain each credential

### Flutterwave (payments)
1. Sign in at **https://dashboard.flutterwave.com/**.
2. Go to **Settings → API Keys**.
3. Copy the **Public Key** → `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` and the
   **Secret Key** → `FLUTTERWAVE_SECRET_KEY`.
   - Use the **Test** keys (`FLWPUBK_TEST…` / `FLWSECK_TEST…`) for development.
   - Switch to **Live** keys only in production.
4. To create split subaccounts: **Settings → Subaccounts → Create Subaccount**
   (add each recipient's bank). Copy the subaccount IDs into
   `FLUTTERWAVE_OWNER_SUBACCOUNT_ID` / `FLUTTERWAVE_PARTNER_SUBACCOUNT_ID`.
   The helper script `scripts/setup-subaccounts.ts` can automate this.

### SMTP email
- **Gmail:** enable 2-Step Verification, then create an **App Password**
  at **https://myaccount.google.com/apppasswords**. Use:
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=<your gmail>`,
  `SMTP_PASS=<app password>`.
- **Hostinger / other providers:** find SMTP settings in your hosting/email control
  panel (Email → Configuration). Typical secure port is `465`.

### WhatsApp gateway
- Obtain the `WHATSAPP_GATEWAY_URL`, `WHATSAPP_GATEWAY_KEY`, and registered
  `WHATSAPP_PRODUCT_NAME` from your WhatsApp gateway provider's dashboard/admin.
  The product name must match the value registered with the gateway.

### Cloudflare (optional, deployment only)
1. Sign in at **https://dash.cloudflare.com/**.
2. **Account ID:** shown on the right of your account's overview page.
3. **API token/key:** **My Profile → API Tokens** (create a scoped token) — prefer a
   scoped API **token** over the global API key.

### Database
- Local development: keep the default `DATABASE_URL="file:./db/custom.db"` (SQLite).
- Production: point it at your managed database connection string.

---

## 4. Local setup checklist

- [ ] `cp .env.example .env`
- [ ] Fill in `DATABASE_URL` and the product/delivery values
- [ ] Add Flutterwave **TEST** keys
- [ ] (Optional) add SMTP / WhatsApp values to test notifications
- [ ] `bun install && bun run db:generate`
- [ ] `bun run dev` and open http://localhost:3000
- [ ] Confirm `git status` does **not** list `.env`

---

## 5. Security best practices

1. **Never commit secrets.** `.env` and any `*CREDENTIALS*` / `*.secret` files are
   git-ignored. Only `.env.example` (placeholders) belongs in the repo.
2. **Use TEST keys in development**, LIVE keys only in production environments.
3. **Set secrets via your host's manager** in production (Vercel/Cloudflare/Docker
   env vars, etc.) — do not ship a `.env` file to servers in git.
4. **Rotate immediately on exposure.** If a secret is ever committed, pushed, or
   shared, revoke/regenerate it right away — removing the file later is not enough,
   because it remains in git history.
5. **Least privilege.** Use scoped API tokens (not global keys) wherever the provider
   supports it; grant only the permissions the app needs.
6. **Keep secrets out of logs, screenshots, and chat.** Do not paste keys into issues,
   PRs, or the `download/` folder.
7. **Limit who has access** to live credentials, and keep an inventory so they can be
   rotated when someone leaves the project.
8. **Treat bank details as sensitive PII** — they live in env vars, never hard-coded.

---

## 6. If a secret leaks

1. **Revoke/rotate** the affected credential in its provider dashboard now.
2. Generate a replacement and update your local `.env` and production secret store.
3. If it was committed, **purge it from git history** (e.g. `git filter-repo` or BFG),
   then force-push — deleting the file in a new commit does **not** remove it from
   history.
4. Review provider audit logs for any unauthorized use.
