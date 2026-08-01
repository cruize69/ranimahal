// Fetches the canonical menu from the ordering system (ranimahal.food) — that
// deployment is the single source of truth for items, prices, descriptions,
// and category grouping. This site only layers presentation on top (section
// photography, allergy/rice notes) — see src/content/menu.ts.
//
// Next.js dedupes identical fetch() calls within a single request, so it's
// safe for multiple Server Components to call getOrderingMenu() independently
// without triggering repeat network requests.

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

const ORDERING_API = "https://ranimahal.food/api/menu";

export async function getOrderingMenu(): Promise<OrderingMenu> {
  const res = await fetch(ORDERING_API, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ordering menu (${res.status})`);
  }
  const data: { items: OrderingItem[]; sections: OrderingSection[] } = await res.json();
  return {
    items: data.items,
    itemMap: Object.fromEntries(data.items.map((i) => [i.id, i])),
    sections: data.sections,
  };
}
