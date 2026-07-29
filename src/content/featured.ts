// Signature dishes featured on the home page. `menuSectionId` must match an
// `id` in src/content/menu.ts so each card can deep-link into the menu.
// Photos are real, cropped to 4:5 by the layout — see src/content/images.ts.

import { photo } from "@/content/images";

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
    image: photo("29.JPG"),
    menuSectionId: "chicken-entrees",
  },
  {
    name: "Tandoori Chicken",
    blurb: "Marinated overnight, fired in a clay oven past 900°F.",
    price: "22",
    image: photo("25.JPG"),
    menuSectionId: "tandoor",
  },
  {
    name: "Tandoori Shrimp",
    blurb: "Jumbo shrimp in a delicate, gently spiced cream sauce.",
    price: "25",
    image: photo("22.JPG"),
    menuSectionId: "seafood",
  },
  {
    name: "Paneer Butter Masala",
    blurb: "House-made paneer in a slow-simmered tomato-cashew gravy.",
    price: "18",
    image: photo("20.JPG"),
    menuSectionId: "vegetarian-entrees",
  },
];
