// PLACEHOLDER MENU DATA
// This mirrors the 11-section structure of the existing 98-item print/ordering
// menu, with a few representative items per section so the site is fully
// functional today. Replace the items below with the real menu export from
// the ordering system — the shape (MenuSection / MenuItem) should stay the
// same so no page code needs to change.
//
// Each section carries one `image` — its highlight photo on the menu page.
// Not every dish needs a photo, but every section should have its single
// best shot. Swap the `src` for real photography per README > "Updating
// photos"; keep the 1800x760 (~2.4:1) aspect ratio for the banner crop.

import { photo } from "@/content/images";

export type MenuItem = {
  name: string;
  description: string;
  price: string; // formatted, e.g. "18" or "16/24"
  tags?: Array<"veg" | "vegan" | "gluten-free" | "spicy" | "chef-pick">;
};

export type MenuSectionImage = {
  src: string;
  alt: string;
};

export type MenuSection = {
  id: string;
  name: string;
  description?: string;
  image: MenuSectionImage;
  items: MenuItem[];
};

export const menu: MenuSection[] = [
  {
    id: "starters",
    name: "Starters",
    image: { src: photo("30.JPG"), alt: "Samosas with shredded salad" },
    items: [
      {
        name: "Vegetable Samosa",
        description: "Crisp pastry filled with spiced potatoes and peas, served with tamarind chutney.",
        price: "9",
        tags: ["veg"],
      },
      {
        name: "Chicken 65",
        description: "Fried chicken tossed in curry leaf, ginger, and chili.",
        price: "14",
        tags: ["spicy"],
      },
    ],
  },
  {
    id: "soups-salads",
    name: "Soups & Salads",
    image: { src: photo("27.JPG"), alt: "Saag — slow-cooked spinach with fresh tomato" },
    items: [
      {
        name: "Mulligatawny Soup",
        description: "Lentil soup with vegetables and warm spice.",
        price: "8",
        tags: ["veg"],
      },
      {
        name: "Kachumber Salad",
        description: "Cucumber, tomato, onion, lime, and cilantro.",
        price: "7",
        tags: ["vegan", "gluten-free"],
      },
    ],
  },
  {
    id: "tandoor",
    name: "From the Tandoor",
    description: "Marinated overnight, finished in a clay oven fired to 900°F.",
    image: { src: photo("25.JPG"), alt: "Tandoori chicken with red onion and lemon" },
    items: [
      {
        name: "Tandoori Chicken",
        description: "Half chicken marinated in yogurt and Kashmiri chili.",
        price: "22",
        tags: ["chef-pick", "gluten-free"],
      },
      {
        name: "Seekh Kebab",
        description: "Ground lamb skewers with ginger, garlic, and garam masala.",
        price: "19",
      },
    ],
  },
  {
    id: "vegetarian-entrees",
    name: "Vegetarian Entrées",
    image: { src: photo("10.jpg"), alt: "Mixed vegetables in a copper karahi" },
    items: [
      {
        name: "Paneer Butter Masala",
        description: "House paneer in a tomato-cashew gravy.",
        price: "18",
        tags: ["veg", "chef-pick"],
      },
      {
        name: "Dal Makhani",
        description: "Black lentils simmered overnight with butter and cream.",
        price: "16",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "chicken-entrees",
    name: "Chicken Entrées",
    image: { src: photo("29.JPG"), alt: "Butter chicken in a creamy tomato gravy" },
    items: [
      {
        name: "Butter Chicken",
        description: "Tandoori chicken in a velvety tomato-butter sauce.",
        price: "21",
        tags: ["chef-pick"],
      },
      {
        name: "Chicken Vindaloo",
        description: "Goan-style chicken in a fiery vinegar-chili sauce.",
        price: "20",
        tags: ["spicy"],
      },
    ],
  },
  {
    id: "lamb-goat",
    name: "Lamb & Goat",
    image: { src: photo("21.JPG"), alt: "Red curry finished with onion and cilantro" },
    items: [
      {
        name: "Lamb Rogan Josh",
        description: "Kashmiri-style braised lamb in a fragrant red gravy.",
        price: "24",
      },
      {
        name: "Goat Curry",
        description: "Bone-in goat slow-cooked with whole spices.",
        price: "24",
        tags: ["spicy"],
      },
    ],
  },
  {
    id: "seafood",
    name: "Seafood",
    image: { src: photo("22.JPG"), alt: "Shrimp in a delicate cream sauce" },
    items: [
      {
        name: "Fish Malabar",
        description: "Cod simmered in coconut and curry leaf sauce.",
        price: "23",
        tags: ["gluten-free"],
      },
      {
        name: "Tandoori Shrimp",
        description: "Jumbo shrimp marinated in yogurt and spices, tandoor-grilled.",
        price: "25",
        tags: ["gluten-free"],
      },
    ],
  },
  {
    id: "biryani-rice",
    name: "Biryani & Rice",
    image: { src: photo("17.jpg"), alt: "Curry served with basmati rice and naan" },
    items: [
      {
        name: "Hyderabadi Chicken Biryani",
        description: "Basmati layered with saffron, fried onion, and chicken.",
        price: "20",
        tags: ["chef-pick"],
      },
      {
        name: "Lamb Biryani",
        description: "Basmati layered with saffron, fried onion, and slow-braised lamb.",
        price: "23",
        tags: ["chef-pick"],
      },
      {
        name: "Vegetable Biryani",
        description: "Basmati with seasonal vegetables and whole spices.",
        price: "17",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "breads",
    name: "Breads",
    image: { src: photo("26.JPG"), alt: "Naan fresh from the tandoor" },
    items: [
      {
        name: "Garlic Naan",
        description: "Tandoor-baked leavened bread with roasted garlic.",
        price: "5",
        tags: ["veg"],
      },
      {
        name: "Peshawari Naan",
        description: "Stuffed with dried fruit and nuts.",
        price: "6",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    // The only section with no real photo — there are no dessert shots in the
    // existing asset library. Swap in a real one when it's shot.
    image: { src: "/images/menu-sections/desserts.svg", alt: "Rani Mahal desserts" },
    items: [
      {
        name: "Gulab Jamun",
        description: "Milk dumplings soaked in cardamom-rose syrup.",
        price: "7",
        tags: ["veg"],
      },
      {
        name: "Kulfi",
        description: "Traditional pistachio-cardamom ice cream.",
        price: "7",
        tags: ["veg", "gluten-free"],
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    image: { src: photo("7a.jpg"), alt: "Appetizers with wine poured" },
    items: [
      {
        name: "Mango Lassi",
        description: "Yogurt, mango, and a touch of cardamom.",
        price: "6",
        tags: ["veg", "gluten-free"],
      },
      {
        name: "Masala Chai",
        description: "Black tea simmered with milk and whole spices.",
        price: "4",
        tags: ["veg"],
      },
    ],
  },
];
