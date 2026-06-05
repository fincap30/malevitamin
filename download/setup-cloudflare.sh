#!/bin/bash
# ============================================
# Male Vitamin — Cloudflare Setup Script
# ============================================
# 
# PREREQUISITE: You need a Cloudflare API token
# 
# Step 1: Create Cloudflare account at https://dash.cloudflare.com/sign-up
# Step 2: After signing in, go to: https://dash.cloudflare.com/profile/api-tokens
# Step 3: Click "Create Token"
# Step 4: Use "Edit Cloudflare Workers" template
# Step 5: Also add these permissions:
#   - Zone - DNS - Edit
#   - Zone - Zone - Edit  
#   - Zone - SSL and Certificates - Edit
#   - Account - Workers Scripts - Edit
#   - Account - Account Settings - Read
# Step 6: Copy the token and run this script:
#
#   CLOUDFLARE_API_TOKEN=your_token_here bash setup-cloudflare.sh
#

set -e

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: CLOUDFLARE_API_TOKEN not set"
  echo ""
  echo "Usage: CLOUDFLARE_API_TOKEN=your_token bash setup-cloudflare.sh"
  echo ""
  echo "Get your token at: https://dash.cloudflare.com/profile/api-tokens"
  exit 1
fi

export CLOUDFLARE_API_TOKEN
DOMAIN="malevitamin.co.za"
WORKER_NAME="malevitamin-proxy"
TARGET="malevitamin.space-z.ai"

echo "============================================"
echo "☁️  Cloudflare Setup for $DOMAIN"
echo "============================================"
echo ""

# Step 1: Verify API token
echo "Step 1: Verifying API token..."
VERIFY=$(curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

if echo "$VERIFY" | grep -q '"status":"active"'; then
  echo "✅ API token is valid!"
else
  echo "❌ API token is invalid!"
  echo "$VERIFY"
  exit 1
fi

# Get account ID
echo ""
echo "Step 2: Getting account info..."
ACCOUNT_INFO=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

ACCOUNT_ID=$(echo "$ACCOUNT_INFO" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])" 2>/dev/null)

if [ -z "$ACCOUNT_ID" ]; then
  echo "❌ Could not get account ID"
  echo "$ACCOUNT_INFO"
  exit 1
fi

echo "✅ Account ID: $ACCOUNT_ID"

# Step 3: Add domain to Cloudflare
echo ""
echo "Step 3: Adding $DOMAIN to Cloudflare..."
ZONE_RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"name\": \"$DOMAIN\",
    \"type\": \"full\",
    \"account\": {\"id\": \"$ACCOUNT_ID\"}
  }")

if echo "$ZONE_RESULT" | grep -q '"success":true'; then
  ZONE_ID=$(echo "$ZONE_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['id'])" 2>/dev/null)
  echo "✅ Domain added! Zone ID: $ZONE_ID"
  
  # Get nameservers
  NS1=$(echo "$ZONE_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['name_servers'][0])" 2>/dev/null)
  NS2=$(echo "$ZONE_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['name_servers'][1])" 2>/dev/null)
  echo ""
  echo "⚠️  IMPORTANT: Change your nameservers at Hostinger to:"
  echo "   NS1: $NS1"
  echo "   NS2: $NS2"
else
  # Zone might already exist
  ZONE_ID=$(echo "$ZONE_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['result']['id'] if 'result' in d and d['result'] else '')" 2>/dev/null)
  if [ -n "$ZONE_ID" ]; then
    echo "ℹ️  Domain already exists in Cloudflare (Zone ID: $ZONE_ID)"
  else
    echo "❌ Failed to add domain"
    echo "$ZONE_RESULT"
    exit 1
  fi
fi

# Step 4: Add DNS records
echo ""
echo "Step 4: Adding DNS records..."

# A record for @ (dummy, Worker overrides it)
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"@","content":"192.0.2.1","proxied":true,"ttl":1}' | python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ A record' if r['success'] else 'ℹ️  A record: ' + str(r['errors']))"

# CNAME for www
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{\"type\":\"CNAME\",\"name\":\"www\",\"content\":\"$DOMAIN\",\"proxied\":true,\"ttl\":1}" | python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ CNAME record' if r['success'] else 'ℹ️  CNAME: ' + str(r['errors']))"

# Step 5: Upload the Worker
echo ""
echo "Step 5: Uploading Worker..."

WORKER_JS=$(cat /home/z/my-project/download/cloudflare-proxy/worker.js)

curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/javascript" \
  --data "$WORKER_JS" | python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ Worker uploaded!' if r['success'] else '❌ Worker failed: ' + str(r['errors']))"

# Step 6: Add Worker routes
echo ""
echo "Step 6: Adding Worker routes..."

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{\"pattern\":\"$DOMAIN/*\",\"script\":\"$WORKER_NAME\"}" | python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ Route 1 added!' if r['success'] else 'ℹ️  Route 1: ' + str(r['errors']))"

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{\"pattern\":\"www.$DOMAIN/*\",\"script\":\"$WORKER_NAME\"}" | python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ Route 2 added!' if r['success'] else 'ℹ️  Route 2: ' + str(r['errors']))"

# Step 7: Set SSL to Full (strict)
echo ""
echo "Step 7: Setting SSL mode to Full (strict)..."
curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"value":"strict"}' | python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ SSL set to Full (strict)' if r['success'] else 'ℹ️  SSL: ' + str(r['errors']))"

echo ""
echo "============================================"
echo "🎉 Cloudflare setup complete!"
echo "============================================"
echo ""
echo "⚠️  FINAL STEP: Update nameservers at Hostinger"
echo ""
echo "1. Go to https://www.hostinger.co.za/cpanel-login"
echo "2. Find your domain malevitamin.co.za"
echo "3. Change nameservers to:"
echo "   NS1: $NS1"
echo "   NS2: $NS2"
echo ""
echo "4. Wait 5-30 minutes for DNS propagation"
echo "5. Visit https://malevitamin.co.za"
echo ""
echo "Done! 🚀"
