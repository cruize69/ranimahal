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
