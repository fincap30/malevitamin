# Neon Postgres — Netlify Setup Guide

The site now uses a **Neon Postgres** database instead of SQLite, so orders and
WhatsApp messages persist on the live site. The database, schema, and tables are
already created. The **only remaining step** is adding two environment variables
to Netlify so the deployed site can reach the database.

> ⚠️ The actual connection strings contain a password and are **not** stored in
> this file (or anywhere in git). Copy them from your local `.env` file, or use
> the values provided to you in chat.

---

## Step 1 — Open your Netlify site settings

1. Log in at <https://app.netlify.com> (use **Log in with email**).
2. Open the **malevitamin** site (domain: `malevitamin.co.za`).
3. Go to **Site configuration → Environment variables**.

## Step 2 — Add two variables

Click **Add a variable → Add a single variable** and add each of these:

| Key            | Value                                                            |
| -------------- | ---------------------------------------------------------------- |
| `DATABASE_URL` | The **pooled** Neon string (host contains `-pooler`)             |
| `DIRECT_URL`   | The **direct** Neon string (same, but **without** `-pooler`)     |

- Set the scope to **All scopes** (Builds, Functions, Runtime).
- The exact values are in your local `.env` file (lines `DATABASE_URL=` and
  `DIRECT_URL=`), and were also given to you in chat.

## Step 3 — Redeploy

1. Go to **Deploys**.
2. Click **Trigger deploy → Deploy site** (or just push any commit).
3. Wait for the build to finish (✅ Published).

## Step 4 — Verify

1. Visit `https://malevitamin.co.za/admin` and log in.
2. Place a test order on the site — it should now appear in the dashboard.
3. The "Database unavailable" warning should be gone.

---

## Notes

- **Pooled vs direct:** `DATABASE_URL` (pooled) is used by the app at runtime —
  it is optimised for many short serverless connections. `DIRECT_URL` (direct)
  is used only by Prisma when running database migrations.
- **Migrations:** the tables were already created in Neon. If you change the
  schema later, run `npx prisma migrate deploy` (or `npx prisma db push`) locally
  to apply changes.
- **Prisma Client on build:** a `postinstall: "prisma generate"` script was added
  so Netlify regenerates the Prisma client automatically on every build.
- **Free tier:** the Neon free plan includes 0.5 GB storage and scales to zero
  when idle — plenty for this store. No credit card required.
- **Neon dashboard:** <https://console.neon.tech> → project **malevitamin**.
