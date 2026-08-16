// Shared consent state for non-essential (analytics) cookies/scripts.
// CookieConsentBanner (the UI) and GoogleAnalytics (the actual gate) both
// read/write this same key, and both listen for CONSENT_CHANGE_EVENT so a
// choice made in one tab takes effect immediately everywhere — no reload,
// no relying on the native `storage` event alone (that only fires in
// *other* tabs, never the tab that made the change).

const CONSENT_KEY = "rani-cookie-consent";
export const CONSENT_CHANGE_EVENT = "rani-cookie-consent-change";

export type ConsentValue = "accepted" | "declined" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

/** Deletes any GA cookies already set — covers the "accepted, then changed
 * their mind" case, where simply not loading the script again wouldn't
 * retroactively revoke cookies GA already wrote. */
function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_gid" || name.startsWith("_ga"));

  for (const name of names) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  }
}

/** `null` clears the stored choice entirely (used by the Footer's "Cookie
 * Preferences" link to re-show the banner). */
export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  if (value === null) {
    window.localStorage.removeItem(CONSENT_KEY);
  } else {
    window.localStorage.setItem(CONSENT_KEY, value);
  }
  if (value !== "accepted") clearAnalyticsCookies();
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}
