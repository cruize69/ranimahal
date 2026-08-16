"use client";

import { setConsent } from "@/lib/cookieConsent";

/** Clears the stored consent choice, which re-shows CookieConsentBanner via
 * the shared consent-change event it listens for — the only way to change
 * or review the choice once it's been made. */
export function CookiePreferencesLink() {
  return (
    <button
      type="button"
      onClick={() => setConsent(null)}
      className="hover:text-saffron transition-colors"
    >
      Cookie Preferences
    </button>
  );
}
