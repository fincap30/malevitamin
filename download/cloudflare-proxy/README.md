# Male Vitamin — Cloudflare Reverse Proxy

This Cloudflare Worker proxies `malevitamin.co.za` → `malevitamin.space-z.ai` so your custom domain works even though the z.ai platform doesn't natively support custom domains.

## Quick Setup (5 minutes)

### Step 1: Create Cloudflare Account (free)
1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account

### Step 2: Add Your Domain
1. In Cloudflare dashboard, click **"Add a site"**
2. Enter `malevitamin.co.za`
3. Select the **Free plan**
4. Cloudflare will scan existing DNS records — review them

### Step 3: Update Nameservers
1. Cloudflare will give you 2 nameservers (e.g., `amy.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
2. Go to your domain registrar (Hostinger) → DNS settings
3. Change the nameservers from:
   - `lunar.dns-parking.com`
   - `solar.dns-parking.com`
   To the Cloudflare nameservers
4. Wait for propagation (usually 5-30 minutes, up to 24 hours)

### Step 4: Configure DNS in Cloudflare
In Cloudflare DNS settings, add these records:

| Type  | Name | Content                    | Proxy |
|-------|------|----------------------------|-------|
| A     | @    | 192.0.2.1 (dummy)         | ☁️ On |
| CNAME | www  | malevitamin.co.za          | ☁️ On |

> The A record is a dummy — the Worker overrides everything. The orange cloud (proxy) MUST be on.

### Step 5: Deploy the Worker

**Option A: Via Cloudflare Dashboard (easiest)**
1. Go to Workers & Pages → Create Worker
2. Name it `malevitamin-proxy`
3. Paste the contents of `worker.js` into the editor
4. Click **Save and Deploy**

**Option B: Via Wrangler CLI**
```bash
npm install
npx wrangler login
npx wrangler deploy
```

### Step 6: Add Worker Route
1. Go to your domain → Workers Routes
2. Click **Add route**
3. Route: `malevitamin.co.za/*`
4. Worker: `malevitamin-proxy`
5. Click **Save**
6. Add another route: `www.malevitamin.co.za/*` → `malevitamin-proxy`

### Step 7: Configure SSL
1. Go to your domain → SSL/TLS
2. Set encryption mode to **Full (strict)**

## Verification
After setup, visit:
- https://malevitamin.co.za — should show your site
- https://www.malevitamin.co.za — should show your site

## How It Works
```
User → malevitamin.co.za → Cloudflare (DNS proxy) → Worker rewrites Host header → malevitamin.space-z.ai → z.ai ALB → Your site
```

The Worker changes the `Host` header from `malevitamin.co.za` to `malevitamin.space-z.ai` so the z.ai load balancer routes the request to your project.

## GitHub Deployment
1. Push this folder to a GitHub repo
2. In Cloudflare dashboard → Workers & Pages → Create → Connect to Git
3. Select your repo
4. It will auto-deploy on every push
