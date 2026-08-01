// Signature dishes featured on the home page. `menuSectionId` must match an
// `id` in the live ordering menu so each card can deep-link into /menu.
// `orderItemId` must match a real item id from the ordering system
// (ranimahal.food/api/menu) — the home page resolves the live price from
// that id at render time rather than hand-typing one here, so this can't
// silently drift from what the "Order this" button actually adds to cart.
// Photos are cropped to 4:5 by the layout — see src/content/images.ts.
//
// PREVIEW ONLY: `image` currently points at aiConcept() placeholders (AI
// concept art, not real photos of these dishes) to test a darker art
// direction. The pairing below is by visual similarity only, not accuracy —
// swap each for a real photo() of the actual dish before this ships.

import { aiConcept } from "@/content/images";

export type FeaturedDish = {
  name: string;
  blurb: string;
  image: string;
  menuSectionId: string;
  orderItemId: string;
};

export const featuredDishes: FeaturedDish[] = [
  {
    name: "Butter Chicken",
    blurb: "Tandoori chicken folded into a velvety tomato-butter sauce.",
    image: aiConcept("tandoori-chicken-b.png"),
    menuSectionId: "chicken",
    orderItemId: "item-makhni", // "Chicken Makhni" — classic butter chicken
  },
  {
    name: "Tandoori Chicken",
    blurb: "Marinated overnight, fired in a clay oven past 900°F.",
    image: aiConcept("tandoori-chicken-a.png"),
    menuSectionId: "tandoori",
    orderItemId: "item-tandoori-chicken",
  },
  {
    name: "Tandoori Shrimp",
    blurb: "Jumbo shrimp in a delicate, gently spiced cream sauce.",
    image: aiConcept("sauce-spoon-spices.png"),
    menuSectionId: "seafood",
    // "Shrimp Malai" — matched on the actual dish (mild cream sauce), not
    // "Shrimp Tandoori" (dry-marinated, no sauce) despite the closer name.
    orderItemId: "item-shrimp-malai",
  },
  {
    name: "Palak Paneer",
    blurb: "Homemade paneer cubes simmered in a delicately spiced spinach gravy.",
    image: aiConcept("saag-paneer-a.png"),
    menuSectionId: "vegetarian",
    orderItemId: "item-palak-paneer",
  },
];
