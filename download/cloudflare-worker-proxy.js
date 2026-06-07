// Cloudflare Worker: Reverse Proxy for malevitamin.co.za → malevitamin.space-z.ai
// This worker proxies all requests from your custom domain to the space-z.ai deployment

const TARGET_HOST = 'malevitamin.space-z.ai';
const TARGET_ORIGIN = 'https://malevitamin.space-z.ai';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Rewrite the URL to point to the target origin
    const targetUrl = new URL(url.pathname + url.search, TARGET_ORIGIN);
    
    // Create new headers, replacing the Host header with the target
    const newHeaders = new Headers(request.headers);
    newHeaders.set('Host', TARGET_HOST);
    newHeaders.set('X-Forwarded-Host', url.hostname);
    newHeaders.set('X-Real-Host', url.hostname);
    
    // Remove headers that might cause issues
    newHeaders.delete('cf-connecting-ip');
    newHeaders.delete('cf-ipcountry');
    newHeaders.delete('cf-ray');
    newHeaders.delete('cf-visitor');
    
    // Create the proxied request
    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual', // Don't follow redirects automatically
    });
    
    try {
      // Fetch from the target
      const response = await fetch(proxiedRequest);
      
      // Modify the response headers
      const newResponseHeaders = new Headers(response.headers);
      
      // Rewrite any location headers that point to the target back to our domain
      const location = newResponseHeaders.get('location');
      if (location && location.includes(TARGET_HOST)) {
        newResponseHeaders.set('location', location.replace(TARGET_HOST, url.hostname));
      }
      
      // Handle CORS if needed
      newResponseHeaders.set('Access-Control-Allow-Origin', '*');
      
      // Return the modified response
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newResponseHeaders,
      });
    } catch (error) {
      return new Response('Proxy error: ' + error.message, { status: 502 });
    }
  }
};
