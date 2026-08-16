"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, CONSENT_CHANGE_EVENT } from "@/lib/cookieConsent";

/** The consent prompt itself — GoogleAnalytics.tsx is the actual gate that
 * keeps GA4 from loading, this is just the UI for setting the choice it
 * reads. Shows once, on first visit with no stored choice, and stays
 * pinned until one is made — no auto-dismiss timer, since a compliance
 * prompt shouldn't disappear on its own before the visitor has decided.
 * Also re-appears if the Footer's "Cookie Preferences" link clears the
 * stored choice, via the shared consent-change event both listen for.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(getConsent() === null);
    check();
    window.addEventListener(CONSENT_CHANGE_EVENT, check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, check);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (!visible) return null;

  // z-[60] is deliberately higher than MobileActionBar's z-50 — both are
  // fixed to the bottom edge on mobile, and this compliance prompt should
  // win over it while a choice is still pending, rather than the two
  // illegibly overlapping.
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-surface/95 px-5 py-5 backdrop-blur sm:px-10"
    >
      <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm leading-relaxed text-muted sm:max-w-2xl">
          We use cookies for basic site analytics — nothing sold, nothing beyond understanding how
          the site is used. You can change this anytime from the footer.
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-saffron hover:text-saffron"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="rounded-full bg-saffron px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-saffron-deep"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
