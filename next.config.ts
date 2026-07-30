import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The source photos top out at ~1190px wide, so anything above 1200 is
    // pure upscaling — and every extra variant is another slow cold fetch
    // from the current host (which times out at 3840). Raise this ceiling
    // once higher-resolution originals are available.
    // Request the largest variant the source files support; bump when higher-res
    // originals are uploaded (see src/content/images.ts).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512, 640, 750],
    // EditorialImage defaults to quality=92 for sharper food photography;
    // Next 16 requires every quality value actually in use to be allow-listed
    // here or it silently falls back to 75.
    qualities: [75, 92],
    // Cache generated variants for 31 days so the slow origin is hit rarely.
    minimumCacheTTL: 2678400,
    // A few generated SVG placeholders remain where no real photo exists yet.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        // Photography is currently served from the existing ranimahalny.com
        // site. See src/content/images.ts — move these to your own storage
        // before the old host is retired.
        protocol: "https",
        hostname: "www.ranimahalny.com",
        pathname: "/assets/img/**",
      },
      {
        // TODO: replace with the exact hostname from your Vercel Blob store
        // (Vercel dashboard -> Storage -> Blob -> store settings).
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
