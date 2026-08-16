"use client";

// GA4, not Vercel Web Analytics — Vercel's own analytics is billed once
// usage exceeds its free tier, and free analytics is the actual goal here.
// GA4 is free at any volume. Renders nothing (and loads nothing) unless
// NEXT_PUBLIC_GA_MEASUREMENT_ID is set AND the visitor has explicitly
// accepted analytics cookies via CookieConsentBanner — GA4 sets tracking
// cookies (_ga, _gid), so it must not fire before consent under GDPR/
// ePrivacy. Re-checks on every consent change (accept, decline, or the
// Footer's "Cookie Preferences" reopening the choice) so it starts or
// stops immediately, no page reload needed either way.
import { useEffect, useState } from "react";
import Script from "next/script";
import { getConsent, CONSENT_CHANGE_EVENT } from "@/lib/cookieConsent";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const check = () => setAccepted(getConsent() === "accepted");
    check();
    window.addEventListener(CONSENT_CHANGE_EVENT, check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, check);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (!gaId || !accepted) return null;

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
