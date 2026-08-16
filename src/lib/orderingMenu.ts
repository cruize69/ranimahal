// Fetches the canonical menu from the ordering system (ranimahal.food) — that
// deployment is the single source of truth for items, prices, descriptions,
// and category grouping. This site only layers presentation on top (section
// photography, allergy/rice notes) — see src/content/menu.ts.
//
// Next.js dedupes identical fetch() calls within a single request, so it's
// safe for multiple Server Components to call getOrderingMenu() independently
// without triggering repeat network requests.

import { MENU_ITEMS as FALLBACK_ITEMS, SECTIONS as FALLBACK_SECTIONS } from "@/lib/canonicalMenu";

export type OrderingBadge = "bestseller" | "chef" | "spicy" | null;
export type OrderingSpiceProfile = "adjustable" | "mild" | "hot" | "none";

export type OrderingItem = {
  id: string;
  name: string;
  price: number;
  desc: string;
  badge: OrderingBadge;
  spiceProfile: OrderingSpiceProfile;
  veg: boolean;
  image?: string | null;
};

export type OrderingSubsection = { label: string; ids: string[] };

export type OrderingSection = {
  id: string;
  eyebrow: string;
  title: string;
  note: string;
  subsections: OrderingSubsection[];
};

export type OrderingMenu = {
  items: OrderingItem[];
  itemMap: Record<string, OrderingItem>;
  sections: OrderingSection[];
};

const ORDERING_API = process.env.ORDERING_API_URL || "https://ranimahal.food/api/menu";

export async function getOrderingMenu(): Promise<OrderingMenu> {
  try {
    const res = await fetch(ORDERING_API, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data: { items: OrderingItem[]; sections: OrderingSection[] } = await res.json();
      // The response shape isn't guaranteed — a 200 with an unexpected body
      // (misconfigured ORDERING_API_URL, upstream API change) previously
      // threw on data.items.map() from inside this ok-branch, which is
      // AFTER the point where the try/catch's fallback would normally
      // engage, taking down every page that renders the menu instead of
      // degrading to FALLBACK_ITEMS. Validate first so a bad response
      // falls through to the same catch-driven fallback as a network error.
      if (!Array.isArray(data?.items) || !Array.isArray(data?.sections)) {
        throw new Error("Ordering API returned an unexpected menu shape");
      }
      return {
        items: data.items,
        itemMap: Object.fromEntries(data.items.map((i) => [i.id, i])),
        sections: data.sections,
      };
    }
  } catch {
    // Fall back to canonical local menu definition if remote API is unavailable
  }

  const items = FALLBACK_ITEMS as OrderingItem[];
  const sections = FALLBACK_SECTIONS as OrderingSection[];

  return {
    items,
    itemMap: Object.fromEntries(items.map((i) => [i.id, i])),
    sections,
  };
}
