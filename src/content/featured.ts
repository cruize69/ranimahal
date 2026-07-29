// Signature dishes featured on the home page. `menuSectionId` must match an
// `id` in src/content/menu.ts so each card can deep-link into the menu.
// Images are 4:5 portrait crops — see README > "Updating photos".

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
    image: "/images/signature/butter-chicken.svg",
    menuSectionId: "chicken-entrees",
  },
  {
    name: "Tandoori Chicken",
    blurb: "Marinated overnight, fired in a clay oven past 900°F.",
    price: "22",
    image: "/images/signature/tandoori-chicken.svg",
    menuSectionId: "tandoor",
  },
  {
    name: "Lamb Biryani",
    blurb: "Basmati layered with saffron, fried onion, and braised lamb.",
    price: "23",
    image: "/images/signature/lamb-biryani.svg",
    menuSectionId: "biryani-rice",
  },
  {
    name: "Paneer Butter Masala",
    blurb: "House-made paneer in a slow-simmered tomato-cashew gravy.",
    price: "18",
    image: "/images/signature/paneer-tikka.svg",
    menuSectionId: "vegetarian-entrees",
  },
];
