/**
 * Cloudflare Worker: Reverse Proxy
 * Routes malevitamin.co.za → malevitamin.space-z.ai
 * 
 * This worker rewrites the Host header so the z.ai platform's
 * load balancer accepts the request and serves your site.
 */

const TARGET_HOST = 'malevitamin.space-z.ai';
const TARGET_ORIGIN = 'https://malevitamin.space-z.ai';

// Paths that should redirect to the custom domain (SEO: avoid duplicate content)
const REDIRECT_PATHS = new Set(['/sitemap.xml', '/robots.txt']);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const originalHost = url.hostname;

    // Build the target URL
    const targetUrl = new URL(url.pathname + url.search, TARGET_ORIGIN);

    // Clone headers and set the correct Host for the z.ai ALB
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.set('Host', TARGET_HOST);
    proxyHeaders.set('X-Forwarded-Host', originalHost);
    proxyHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
    proxyHeaders.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
    
    // Remove Cloudflare-specific headers that leak internal info
    for (const header of [
      'cf-connecting-ip', 'cf-ipcountry', 'cf-ray',
      'cf-visitor', 'cf-worker', 'cf-cache-status'
    ]) {
      proxyHeaders.delete(header);
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Build the proxied request
    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      redirect: 'manual',
    });

    try {
      const response = await fetch(proxiedRequest);
      const responseHeaders = new Headers(response.headers);

      // Rewrite Location headers that reference the target back to our domain
      const location = responseHeaders.get('location');
      if (location) {
        responseHeaders.set('location', location.replace(TARGET_HOST, originalHost));
      }

      // Rewrite Content-Security-Policy to allow our domain
      const csp = responseHeaders.get('content-security-policy');
      if (csp) {
        responseHeaders.set('content-security-policy', csp.replace(TARGET_HOST, originalHost));
      }

      // Add CORS headers for API requests
      if (url.pathname.startsWith('/api/')) {
        responseHeaders.set('Access-Control-Allow-Origin', '*');
      }

      // Security headers
      responseHeaders.set('X-Proxy-Version', '1.0');

      // Remove problematic headers
      responseHeaders.delete('strict-transport-security'); // Cloudflare handles HSTS

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Proxy error', message: err.message }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
