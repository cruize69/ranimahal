// Fetches the canonical Family Meal / Group Meal bundles from the ordering
// system (ranimahal.food) — same pattern as cateringPackages.ts's
// getCateringPackages() and orderingMenu.ts's getOrderingMenu(), and for
// the same reason: that deployment is the single source of truth
// (ranimahal-backend's lib/feasts.js), so this site never hand-copies
// names/prices/items that would inevitably drift.

export type FeastItem = {
  baseId: string;
  name: string;
  qty: number;
};

export type Feast = {
  id: string;
  name: string;
  feeds: string;
  price: number;
  aLaCarteTotal: number;
  heroImage: string;
  flagship: boolean;
  items: FeastItem[];
};

const FEASTS_API = process.env.ORDERING_API_URL
  ? process.env.ORDERING_API_URL.replace(/\/menu$/, "/feasts")
  : "https://ranimahal.food/api/feasts";

// Minimal fallback if the live fetch fails — kept in sync by hand only as a
// last resort; the real numbers always come from FEASTS_API above.
const FALLBACK: Feast[] = [
  {
    id: "family-meal",
    name: "The Family Meal",
    feeds: "3–4",
    price: 99.99,
    aLaCarteTotal: 114.75,
    heroImage: "/feasts/family-feast.jpg",
    flagship: true,
    items: [
      { baseId: "item-rani-offering", name: "Rani Ki Offering", qty: 1 },
      { baseId: "item-ctm", name: "Chicken Tikka Masala", qty: 1 },
      { baseId: "item-rogan", name: "Lamb Rogan Josh", qty: 1 },
      { baseId: "item-palak-paneer", name: "Palak Paneer", qty: 1 },
      { baseId: "item-dal-maharani", name: "Dal Maharani Makhni", qty: 1 },
      { baseId: "item-garlic-naan", name: "Garlic Naan", qty: 2 },
      { baseId: "item-onion-naan", name: "Onion Naan", qty: 1 },
      { baseId: "item-raita", name: "Raita", qty: 1 },
    ],
  },
  {
    id: "group-meal",
    name: "The Group Meal",
    feeds: "6–8",
    price: 189.99,
    aLaCarteTotal: 217.0,
    heroImage: "/feasts/grand-feast.jpg",
    flagship: false,
    items: [
      { baseId: "item-rani-offering", name: "Rani Ki Offering", qty: 1 },
      { baseId: "item-mixed-app", name: "Mixed Appetizers", qty: 1 },
      { baseId: "item-ctm", name: "Chicken Tikka Masala", qty: 2 },
      { baseId: "item-rogan", name: "Lamb Rogan Josh", qty: 1 },
      { baseId: "item-palak-paneer", name: "Palak Paneer", qty: 1 },
      { baseId: "item-biriyani-c", name: "Chicken Biriyani", qty: 1 },
      { baseId: "item-tandoori-medley", name: "Tandoori Medley", qty: 1 },
      { baseId: "item-dal-maharani", name: "Dal Maharani Makhni", qty: 1 },
      { baseId: "item-garlic-naan", name: "Garlic Naan", qty: 3 },
      { baseId: "item-onion-naan", name: "Onion Naan", qty: 2 },
      { baseId: "item-naan", name: "Naan", qty: 1 },
      { baseId: "item-raita", name: "Raita", qty: 2 },
    ],
  },
];

export async function getFeasts(): Promise<Feast[]> {
  try {
    const res = await fetch(FEASTS_API, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.feasts)) {
        return data.feasts;
      }
    }
  } catch {
    // Fall back to canonical local bundle definition if remote API is unavailable
  }
  return FALLBACK;
}

/** Builds the ordering app's ?add= cart-preload param from a feast's exact
 * items — landing the customer there with the bundle already in cart,
 * priced at the bundle rate at checkout (see api/feasts.js for why this
 * works without the marketing site needing to know anything about
 * bundle-pricing logic itself). */
export function feastAddParam(feast: Feast): string {
  return feast.items.map((it) => `${it.baseId}:${it.qty}`).join(",");
}
