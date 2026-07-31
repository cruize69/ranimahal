// Editorial copy for Home / About. Replace freely — prose, not data shape.
// The founding year lives in restaurant.ts (single source of truth); these
// strings just reference it so it can't drift out of sync between pages.

import { restaurant } from "@/content/restaurant";

export const homeCopy = {
  // Split so the h1 can set "Fine Indian Cuisine" in the display face and the
  // rest as a lighter second line. Both halves stay inside the <h1>.
  heroHeadingLead: "Fine Indian Cuisine",
  heroHeadingRest: `nothing rushed since ${restaurant.openedYear}`,
  heroSubhead:
    "Whole spices ground in-house, sauces simmered for hours, and bread fired to order in a clay tandoor past 900°F.",
};

export const aboutCopy = {
  heading: "Our Story",
  paragraphs: [
    `Rani Mahal — "Queen's Palace" — opened on Mamaroneck Avenue in ${restaurant.openedYear} with a simple aim: bring the depth and warmth of North Indian cooking to Westchester, without shortcuts.`,
    "Our kitchen builds every dish from whole spices, ground and blended in-house, and finishes our tandoori classics in a clay oven fired well past 900°F. Sauces are simmered for hours, not minutes; breads are made to order.",
    "The dining room borrows its arches and geometric line work from Mughal palace architecture — the same visual language on our menus — as a quieter way of pointing to where the food comes from.",
  ],
  chefHeading: "In the Kitchen",
  // TODO: replace with real chef bio.
  chefBio:
    "Our kitchen team draws on generations of family recipes from Punjab and Hyderabad, adapted over years of service to Rani Mahal's regulars.",
};
