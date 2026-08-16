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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
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
