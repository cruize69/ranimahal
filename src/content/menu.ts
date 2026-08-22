// Menu presentation layer — items, prices, descriptions, and section
// grouping all come live from the ordering system (ranimahal.food), fetched
// via getOrderingMenu(). This file only adds what the ordering backend
// doesn't know about: section photography and the veg/spicy/mild filter
// tags derived from the backend's own item flags.
//
// There is deliberately no hand-maintained item list here anymore — a
// second, independently-editable copy of the menu is exactly what caused
// the two sites to drift apart before. If a dish's name, price, or
// description needs to change, it changes in ranimahal-backend's
// lib/menu.js and both sites pick it up automatically (this fetch is
// cached for 1 hour).

import { photo, aiConcept } from "@/content/images";
import { getOrderingMenu, type OrderingItem } from "@/lib/orderingMenu";

export type MenuTag = "veg" | "spicy" | "mild";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  tags: MenuTag[];
  image?: string | null;
};

export type MenuGroup = {
  name: string;
  note: string;
  items: MenuItem[];
};

export type MenuSection = {
  id: string;
  name: string;
  images: { src: string; alt: string }[];
  /** Real footage for this section's banner, when there is any — takes
   * over from the `images` carousel entirely (see SECTION_VIDEOS below
   * and MenuList.tsx's banner render). */
  video?: { src: string; poster: string };
  groups: MenuGroup[];
};

// Section photography — the ordering backend has no concept of photos, so
// this stays locally curated, keyed by the backend's own section ids.
// PREVIEW: most images below are aiConcept() placeholders, not real photos —
// see src/content/images.ts. Swap for real photo() photography per section
// as it becomes available; this key list itself doesn't need to change.
const SECTION_IMAGES: Record<string, { src: string; alt: string }[]> = {
  appetizers: [
    { src: aiConcept("cocktail-samosas-bar.png"), alt: "Concept: samosas and kababs at the bar" },
    { src: photo("30.JPG"), alt: "Samosas with shredded salad" },
    { src: aiConcept("tandoori-chicken-c.png"), alt: "Concept: tandoori chicken tikka" },
  ],
  soups: [
    { src: photo("27.JPG"), alt: "Saag — slow-cooked spinach with fresh tomato" },
    { src: photo("16.jpg"), alt: "Naan with a side salad" },
    { src: photo("5.jpg"), alt: "Fresh naan and salad" },
  ],
  vegetarian: [
    { src: aiConcept("veg-curry-beans.png"), alt: "Concept: mixed vegetable curry" },
    { src: aiConcept("aloo-gobi.png"), alt: "Concept: aloo gobi" },
    { src: photo("4a.jpg"), alt: "Vegetable karahi with fresh peppers" },
  ],
  chicken: [
    { src: aiConcept("butter-chicken-kadai.png"), alt: "Concept: butter chicken" },
    { src: photo("29.JPG"), alt: "Butter chicken in a creamy tomato gravy" },
    { src: photo("2a.jpg"), alt: "Chicken tikka masala with scallions" },
  ],
  lamb: [
    { src: aiConcept("lamb-kadai-naan.png"), alt: "Concept: lamb kadai with naan" },
    { src: aiConcept("lamb-kadai-table.png"), alt: "Concept: lamb kadai" },
    { src: photo("21.JPG"), alt: "Red curry finished with onion and cilantro" },
  ],
  tandoori: [
    { src: aiConcept("tandoori-chicken-a.png"), alt: "Concept: tandoori chicken" },
    { src: photo("1a.jpg"), alt: "Tandoori platter with onion and lemon" },
    { src: aiConcept("tandoori-chicken-b.png"), alt: "Concept: tandoori chicken" },
  ],
  seafood: [
    { src: aiConcept("fish-whole.png"), alt: "Concept: whole grilled fish" },
    { src: aiConcept("table-fish-tandoori.png"), alt: "Concept: whole fish and tandoori chicken table spread" },
    { src: aiConcept("thali-tray-bowls.png"), alt: "Concept: thali tray with tandoori fish and naan" },
  ],
  medley: [
    { src: aiConcept("sauce-spoon-spices.png"), alt: "Concept: curry sauce and whole spices" },
    { src: aiConcept("thali-tray-wide.png"), alt: "Concept: full table spread" },
    { src: photo("17.jpg"), alt: "Curry served with basmati rice and naan" },
  ],
  sides: [
    { src: aiConcept("dal-makhani.png"), alt: "Concept: dal with naan" },
    { src: photo("20.JPG"), alt: "Creamy tomato curry with scallions" },
    { src: photo("10.jpg"), alt: "Mixed vegetables in a copper karahi" },
  ],
  breads: [
    { src: photo("26.JPG"), alt: "Naan fresh from the tandoor" },
    { src: photo("16.jpg"), alt: "Naan with a side salad" },
    { src: photo("5.jpg"), alt: "Fresh naan and salad" },
  ],
  drinks: [
    { src: aiConcept("wine-bottle.png"), alt: "Concept: wine service" },
    { src: aiConcept("bar-table-spread.png"), alt: "Concept: appetizer bowls and wine at the bar" },
    { src: aiConcept("bar-bowls-wine-2.png"), alt: "Concept: curry bowls and wine at the bar" },
  ],
};

// Real footage for a section banner, when there is any — takes over from
// that section's SECTION_IMAGES carousel entirely (see getMenu() below).
// Same file the Family Meals hero uses (public/videos/lamb-tikka.mp4) —
// real lamb seekh kebabs on the grill, a better first impression than the
// lamb section's aiConcept() placeholders above.
const SECTION_VIDEOS: Record<string, { src: string; poster: string }> = {
  lamb: { src: "/videos/lamb-tikka.mp4", poster: "/videos/lamb-tikka-poster.jpg" },
};

function deriveTags(item: OrderingItem): MenuTag[] {
  const tags: MenuTag[] = [];
  if (item.veg) tags.push("veg");
  if (item.spiceProfile === "hot" || item.badge === "spicy") tags.push("spicy");
  else if (item.spiceProfile === "mild") tags.push("mild");
  return tags;
}

export type Menu = {
  sections: MenuSection[];
  itemCount: number;
};

/** Fetches the live ordering menu and shapes it for this site's components. */
export async function getMenu(): Promise<Menu> {
  const { itemMap, sections: orderingSections, items } = await getOrderingMenu();

  const sections: MenuSection[] = orderingSections
    .map((section) => ({
      id: section.id,
      name: section.title,
      images: SECTION_IMAGES[section.id] ?? [],
      video: SECTION_VIDEOS[section.id],
      groups: section.subsections.map((sub) => ({
        name: sub.label,
        note: section.note,
        items: sub.ids
          .map((id) => itemMap[id])
          .filter((item): item is OrderingItem => Boolean(item))
          .map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.desc,
            tags: deriveTags(item),
            image: item.image ?? null,
          })),
      })),
    }))
    // The ordering app's "Family Meals" section deliberately ships with no
    // subsections (lib/menu.js) — it's rendered there with a dedicated
    // bundle-card component instead of the generic item grid. This site's
    // MenuList has no equivalent, so left in, that section rendered as a
    // hero photo + title with nothing underneath. Drop any section with no
    // real items rather than showing an empty banner; a proper Family
    // Meals landing page here is a separate piece of work, not this fix.
    .filter((section) => section.groups.some((g) => g.items.length > 0));

  return { sections, itemCount: items.length };
}
