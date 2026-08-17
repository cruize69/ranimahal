// Fetches the canonical catering packages from the ordering system
// (ranimahal.food) — same pattern as src/lib/orderingMenu.ts's
// getOrderingMenu(), and for the same reason: that deployment is the
// single source of truth (lib/menu.js's CATERING_PACKAGES), so this site
// never hand-copies prices/minimums that would inevitably drift.

export type CateringTier = {
  itemId: string;
  label: string | null;
  price: number;
  minimum: number;
};

export type CateringPackage = {
  name: string;
  blurb: string;
  items: string[];
  photo: string | null;
  tiers: CateringTier[];
};

export type CateringData = {
  packages: CateringPackage[];
  orderMinimum: number;
};

const CATERING_API = process.env.ORDERING_API_URL
  ? process.env.ORDERING_API_URL.replace(/\/menu$/, "/catering-packages")
  : "https://ranimahal.food/api/catering-packages";

const PACKAGE_PHOTOS: Record<string, string> = {
  Essentials: "/catering/essentials.jpg",
  Signature: "/catering/signature.jpg",
  "Rani Feast": "/catering/rani-feast.jpg",
};

// Minimal fallback if the live fetch fails — kept in sync by hand only as
// a last resort; the real numbers always come from CATERING_API above.
const FALLBACK: CateringData = {
  packages: [
    {
      name: "Essentials",
      blurb: "Office lunches, small team meetings & casual gatherings",
      items: [
        "Samosa or Vegetable Pakora",
        "Chicken Tikka Masala or Chicken Makhni + Palak Paneer",
        "Dal Maharani Makhni",
        "Basmati Rice",
        "Garlic Naan",
        "Raita",
      ],
      photo: "/catering/essentials.jpg",
      tiers: [{ itemId: "catering-essentials", label: null, price: 19.99, minimum: 15 }],
    },
    {
      name: "Signature",
      blurb: "Private parties, milestone celebrations & corporate galas",
      items: [
        "Samosa + Chicken Malai Kabab",
        "3 mains + Palak Paneer",
        "Dal Maharani Makhni",
        "Basmati Rice (or Chicken Biryani, +$2/person)",
        "Garlic + Onion Naan",
        "Raita + Mango Chutney",
      ],
      photo: "/catering/signature.jpg",
      tiers: [
        { itemId: "catering-signature", label: "Poultry & Veg", price: 27.99, minimum: 20 },
        { itemId: "catering-signature-seafood", label: "With Seafood", price: 34.99, minimum: 20 },
        { itemId: "catering-signature-lamb", label: "With Lamb", price: 39.99, minimum: 20 },
      ],
    },
    {
      name: "Rani Feast",
      blurb: "Weddings, grand celebrations & the ultimate royal tandoor experience",
      items: [
        "Tandoori Chicken or Chicken Tikka starter",
        "4 mains including a seafood option",
        "Chicken or Vegetable Biryani",
        "Dal Maharani Makhni",
        "Garlic, Onion + Peshwari Naan",
        "Raita, Mango Chutney + Chef's Special Salad",
      ],
      photo: "/catering/rani-feast.jpg",
      tiers: [
        { itemId: "catering-feast", label: "No Lamb", price: 44.95, minimum: 25 },
        { itemId: "catering-feast-lamb", label: "With Lamb", price: 49.95, minimum: 25 },
      ],
    },
  ],
  orderMinimum: 299.85,
};

export async function getCateringPackages(): Promise<CateringData> {
  try {
    const res = await fetch(CATERING_API, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.packages) && typeof data?.orderMinimum === "number") {
        const enrichedPackages = data.packages.map((pkg: CateringPackage) => ({
          ...pkg,
          photo: pkg.photo || PACKAGE_PHOTOS[pkg.name] || "/catering/essentials.jpg",
        }));
        return { packages: enrichedPackages, orderMinimum: data.orderMinimum };
      }
    }
  } catch {
    // Fall back below if the remote API is unavailable
  }
  return FALLBACK;
}
