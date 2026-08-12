"use client";

// GA4, not Vercel Web Analytics — Vercel's own analytics is billed once
// usage exceeds its free tier, and free analytics is the actual goal here.
// GA4 is free at any volume. Renders nothing (and loads nothing) unless
// NEXT_PUBLIC_GA_MEASUREMENT_ID is set in the environment.
import Script from "next/script";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
