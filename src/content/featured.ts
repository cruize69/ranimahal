// Signature dishes featured on the home page. `menuSectionId` must match an
// `id` in src/content/menu.ts so each card can deep-link into the menu.
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
  price: string;
  image: string;
  menuSectionId: string;
};

export const featuredDishes: FeaturedDish[] = [
  {
    name: "Butter Chicken",
    blurb: "Tandoori chicken folded into a velvety tomato-butter sauce.",
    price: "21",
    image: aiConcept("tandoori-chicken-b.png"),
    menuSectionId: "chicken",
  },
  {
    name: "Tandoori Chicken",
    blurb: "Marinated overnight, fired in a clay oven past 900°F.",
    price: "22",
    image: aiConcept("tandoori-chicken-a.png"),
    menuSectionId: "tandoori",
  },
  {
    name: "Tandoori Shrimp",
    blurb: "Jumbo shrimp in a delicate, gently spiced cream sauce.",
    price: "25",
    image: aiConcept("sauce-spoon-spices.png"),
    menuSectionId: "seafood",
  },
  {
    name: "Palak Paneer",
    blurb: "Homemade paneer cubes simmered in a delicately spiced spinach gravy.",
    price: "17.95",
    image: aiConcept("saag-paneer-a.png"),
    menuSectionId: "vegetarian",
  },
];
