import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverse-proxies the ordering app (ranimahal-backend, a separate Vite/
  // Vercel project historically deployed at ranimahal.food) so it's reachable
  // under THIS domain instead of a second one — one public domain, one
  // cookie-consent surface, correct UTM/referrer attribution end to end.
  // Both apps keep running as fully separate deployments; this is a
  // transparent proxy, not a code merge. ranimahal.food itself stays live
  // (unchanged) as a direct address for anything already printed or texted
  // with that URL — it's just no longer the one customers are pointed at.
  //
  // /order and /order/:path* cover every page route the ordering app
  // serves (home/menu/checkout at /order, plus /order/order-success,
  // /order/rewards, /order/catering, etc. — Vercel strips the /order
  // prefix before forwarding, so the origin sees exactly the paths it
  // already expects; see ranixmenu's main.jsx for the corresponding
  // browser-side prefix-stripping it needs to match ROUTES against the
  // real address-bar URL). /api, /assets, and /logo are separate TOP-LEVEL
  // rules (not nested under /order) because the ordering app's own client
  // JS calls them as root-absolute paths (fetch("/api/..."), Vite's build
  // output, the favicon) — those requests come from the BROWSER at
  // whatever the current origin is, not from this proxy, so they need
  // their own un-prefixed rule to still resolve correctly.
  //
  // Staff tools (/manager, /kitchen, /images, /sales, /dashboard) are
  // deliberately NOT proxied here — they stay reachable only at
  // ranimahal.food directly, no need to expose them under the public
  // marketing domain.
  // www.ranimahal.cc was resolving with its own 200 response (same content,
  // no redirect) instead of consolidating onto the apex domain — Google can
  // index both hosts as separate duplicate-content URLs, splitting whatever
  // link equity either accumulates. Next's redirects() run before
  // rewrites()/routing, so this fires first regardless of path.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ranimahal.cc" }],
        destination: "https://ranimahal.cc/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/order", destination: "https://ranimahal.food/" },
      { source: "/order/:path*", destination: "https://ranimahal.food/:path*" },
      { source: "/api/:path*", destination: "https://ranimahal.food/api/:path*" },
      { source: "/assets/:path*", destination: "https://ranimahal.food/assets/:path*" },
      { source: "/logo/:path*", destination: "https://ranimahal.food/logo/:path*" },
    ];
  },
  // Only HSTS was being sent (Vercel adds that itself). Notably absent was
  // any framing protection, so both sites could be iframed by an attacker
  // and overlaid — clickjacking. Referrer-Policy is set explicitly rather
  // than relying on the modern browser default, since the ordering site
  // carries a Stripe session_id in its success URL and that default is the
  // only thing keeping it out of cross-origin Referer headers.
  //
  // script-src/connect-src were added after a security audit found the
  // JSON-LD structured-data script (StructuredData.tsx) injected unescaped
  // remote menu-item text via dangerouslySetInnerHTML — a menu item name
  // containing "</script><script>...")" could have executed. That's fixed
  // at the source (the string is now escaped before injection), but this
  // is defense-in-depth: connect-src in particular blocks the most common
  // actual impact of an XSS bug like that (fetch()/XHR exfiltrating the
  // Clerk session cookie to an attacker domain) even if some other,
  // not-yet-found injection point exists. 'unsafe-inline' on script-src is
  // a real, deliberate gap — GA4's inline gtag() init script
  // (GoogleAnalytics.tsx) needs it, and removing it requires per-request
  // CSP nonces (new middleware plumbing) that deserves its own dedicated
  // change + test pass rather than a same-session bolt-on next to a dozen
  // other fixes.
  //
  // IMPORTANT: this policy also covers the ordering app's pages — it's
  // reverse-proxied under THIS domain (see rewrites() above), and Next's
  // headers() matching applies regardless of whether a route is rendered
  // locally or proxied. Verified live and found (then fixed) resources the
  // ordering app's own client code needs that this site's code doesn't:
  // Google Fonts (its index.html links fonts.googleapis.com directly, not
  // via next/font), Chart.js from a CDN (SalesDashboard, the staff sales
  // tool), a client-side geocoding fetch to nominatim.openstreetmap.org
  // (AddressAutocomplete.jsx), and Sentry's error-ingest endpoint (only
  // active once VITE_SENTRY_DSN is set — was a no-op when this policy was
  // first written, so it wasn't caught until Sentry actually went live and
  // every client-side error report started getting silently CSP-blocked).
  // Any FUTURE external resource either app's
  // client code adds needs a matching entry here or it's silently blocked
  // in production — that failure mode never shows up as a build/lint/type
  // error, only as a browser console CSP violation.
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clerk.accounts.dev https://clerk.ranimahal.cc https://cdnjs.cloudflare.com",
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.clerk.accounts.dev https://clerk.ranimahal.cc https://ranimahal.food https://ranimahal.cc https://nominatim.openstreetmap.org https://*.ingest.us.sentry.io",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Also allows Google Maps: src/app/contact/page.tsx embeds a real
      // maps.google.com iframe for directions, which this CSP was silently
      // blocking (frame-src previously only allowlisted Clerk) — the embed
      // rendered as a blank box with no visible error outside the console.
      "frame-src https://*.clerk.accounts.dev https://clerk.ranimahal.cc https://www.google.com https://maps.google.com",
      // Clerk's client SDK spins up a blob: web worker for session token
      // handling. Without worker-src, CSP falls back to script-src for
      // workers too — which doesn't include the blob: scheme — and Clerk
      // silently failed to initialize its worker in production. Verified
      // live: this was the one thing the pre-deploy build/lint pass
      // couldn't catch, since it only shows up as a browser CSP violation.
      "worker-src 'self' blob:",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        ],
      },
    ];
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512, 640, 750],
    qualities: [75, 92],
    minimumCacheTTL: 2678400,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ranimahalny.com",
        pathname: "/assets/img/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
