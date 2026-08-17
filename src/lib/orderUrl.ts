// Every outbound link to the ordering site (ranimahal.food) should carry
// UTM params so GA4 there — and the order records themselves, via
// lib/orders.js's utmSource/utmMedium/utmCampaign fields — can attribute
// revenue back to this site instead of showing as unattributed direct
// traffic. `campaign` should identify the specific CTA (e.g. "header_cta",
// "hero_cta", "menu_item_row") so different placements are distinguishable.
//
// This is the right default for organic on-site navigation, but it's wrong
// for a visitor who arrived from a REAL ad — orderUrl() has no way to know
// that at render time (most callers are Server Components; the resulting
// href is static HTML by the time it reaches a browser), so it always
// stamps the internal "which widget sent this" label. attributeOrderClick
// (below) is the client-side complement: attached as an onClick on every
// CTA that uses this href, it runs at the actual moment of navigation, when
// the browser DOES know the current page's real URL — if the visitor's own
// URL carries real ad params, it overwrites the internal defaults with
// those before the click completes. Order records and ad ROI reporting
// should reflect "which ad actually paid for this," not "which button
// happened to be clicked."
import { restaurant } from "@/content/restaurant";
import type { MouseEvent } from "react";

export function orderUrl(campaign: string, extra?: Record<string, string>): string {
  const url = new URL(restaurant.links.orderOnline);
  url.searchParams.set("utm_source", "ranimahal_cc");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", campaign);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);
  }
  return url.toString();
}

// Real ad/click-id params worth preserving end to end — must match (or be a
// superset of) UTM_PARAMS in ranimahal-backend's src/utils/analytics.js,
// the actual capture point on the receiving side.
const AD_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

/** Same real-ad-param detection attributeOrderClick uses, exposed for flows
 * that POST directly to an API (the catering direct-checkout form) instead
 * of navigating an <a> — there's no href to rewrite there, so the caller
 * just needs the raw values to include in its request body. Empty object
 * for the common organic/direct case. */
export function getIncomingAdParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const incoming = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const p of AD_PARAMS) {
    const v = incoming.get(p);
    if (v) found[p] = v;
  }
  return found;
}

/** Attach as onClick on any anchor whose href came from orderUrl() — never
 * anything else, since it unconditionally treats the link as an ordering-app
 * URL. Runs client-side only, does nothing (and costs nothing) for the
 * common case of a visitor who arrived organically/directly: it only
 * rewrites the href when the CURRENT page's own URL actually carries real
 * ad params, which only happens once, on whatever page an ad first lands
 * someone on. */
export function attributeOrderClick(e: MouseEvent<HTMLAnchorElement>) {
  if (typeof window === "undefined") return;
  const incoming = new URLSearchParams(window.location.search);
  const found = AD_PARAMS.filter((p) => incoming.has(p) && incoming.get(p));
  if (found.length === 0) return;

  const target = e.currentTarget;
  try {
    const url = new URL(target.href);
    if (url.pathname !== "/order" && !url.pathname.startsWith("/order/")) return; // safety: only ever rewrite ordering-app links
    for (const p of found) url.searchParams.set(p, incoming.get(p)!);
    target.href = url.toString();
  } catch {
    // malformed href — leave it untouched rather than risk breaking navigation
  }
}
