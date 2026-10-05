// Serves ./public, and sends every other hostname (www, the old onemorelayer.dev
// subdomain) to https://nitesh.fyi with a permanent redirect.
const CANONICAL_HOST = 'nitesh.fyi';

// Hostnames that should be served as-is: local dev and *.workers.dev previews.
const isDevHost = (host) => host === 'localhost' || host === '127.0.0.1' || host.endsWith('.workers.dev');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname !== CANONICAL_HOST && !isDevHost(url.hostname)) {
      return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
