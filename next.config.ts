import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVG placeholders live in /public until real photography is uploaded to Vercel Blob.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
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
