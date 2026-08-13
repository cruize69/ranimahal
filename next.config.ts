import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
