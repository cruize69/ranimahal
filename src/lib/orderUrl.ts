// Every outbound link to the ordering site (ranimahal.food) should carry
// UTM params so GA4 there — and the order records themselves, via
// lib/orders.js's utmSource/utmMedium/utmCampaign fields — can attribute
// revenue back to this site instead of showing as unattributed direct
// traffic. `campaign` should identify the specific CTA (e.g. "header_cta",
// "hero_cta", "menu_item_row") so different placements are distinguishable.
import { restaurant } from "@/content/restaurant";

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
