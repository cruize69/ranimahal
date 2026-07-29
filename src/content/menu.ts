// THE COMPLETE RANI MAHAL MENU — 131 items across 13 sections.
//
// GENERATED, DO NOT HAND-EDIT CASUALLY. Source of truth is the live EdgeServ
// ordering system: https://webmenu.edgeservpos.com/ranimahal/data/digital.json
// (base64-encoded JSON). Names, prices, and descriptions are exactly as the
// restaurant has them there, so the site can never disagree with the cart.
// Re-run the generator in the scratchpad to refresh after a menu change.
//
// `tags` are derived heuristically from the restaurant's own wording
// (e.g. "very spicy" -> spicy, a meat-free section -> veg). They are a
// convenience for filtering, not an allergen guarantee.

import { photo } from "@/content/images";

export type MenuTag =
  | "veg"
  | "spicy"
  | "mild"
  | "child-friendly"
  | "low-fat"
  | "tandoor";

export type MenuItem = {
  name: string;
  /** Dollars. Format at render time, never store a formatted string. */
  price: number;
  description: string;
  tags: MenuTag[];
};

export type MenuGroup = {
  name: string;
  /** Kitchen note shown under the group heading, if any. */
  note: string;
  items: MenuItem[];
};

export type MenuSection = {
  id: string;
  name: string;
  image: { src: string; alt: string };
  groups: MenuGroup[];
};

export const menu: MenuSection[] = [
  {
    id: "vegetarian-appetizers",
    name: "VEGETARIAN APPETIZERS",
    image: { src: photo("30.JPG"), alt: "Samosas with shredded salad" },
    groups: [
      {
        name: "Apps",
        note: "",
        items: [
          {
            name: "Samosa",
            price: 7.95,
            description: "A triangular pastry stuffed with potatoes, green peas and spices.",
            tags: ["veg"],
          },
          {
            name: "Pakora",
            price: 6.5,
            description: "Medium spiced vegetable fritters made with onion, potato, spinach and cauliflower.",
            tags: ["veg"],
          },
          {
            name: "Mixed Appetizers",
            price: 10.95,
            description: "Assorted samosa, mixed pakoras and papad.",
            tags: ["veg"],
          },
          {
            name: "Papad",
            price: 3.95,
            description: "Thin lentil wafer with cracked black pepper.",
            tags: ["veg"],
          },
          {
            name: "Masala Dosa",
            price: 11.95,
            description: "Thin rice crepe filled with spiced potato and peas, served with coconut chutney and sumber.",
            tags: ["veg"],
          },
          {
            name: "Ragada Patties",
            price: 10.95,
            description: "Spiced potato patties layered with chickpeas and herbs.",
            tags: ["veg"],
          },
          {
            name: "Gobi Manchurian",
            price: 11.95,
            description: "Cauliflower florets tossed in a garlic-tomato sauce and medium spices.",
            tags: ["veg"],
          },
        ],
      },
    ],
  },
  {
    id: "non-vegetarian-appetizers",
    name: "NON VEGETARIAN APPETIZERS",
    image: { src: photo("31.JPG"), alt: "Chili chicken with cucumber and lemon" },
    groups: [
      {
        name: "Apps",
        note: "",
        items: [
          {
            name: "Meat Samosa",
            price: 8.5,
            description: "Triangular pastry stuffed with ground lamb and fresh house seasoning.",
            tags: [],
          },
          {
            name: "Seek Kabab App",
            price: 11.95,
            description: "Kashmiri style minced lamb with aromatic herbs and spices, wrapped around a skewer and roasted in the Tandoor clay oven.",
            tags: ["tandoor"],
          },
          {
            name: "Shrimp Bagari",
            price: 13.95,
            description: "Shrimp tempered with mustard seeds, curry leaves, and cooked in a tomato sauce and topped with caramelized onions.",
            tags: [],
          },
          {
            name: "Rani Ki Offering",
            price: 13.95,
            description: "A selection of appetizers including chicken kabab, seek kabab, chicken tikka, shrimp tikka, papad and chicken wings.",
            tags: [],
          },
          {
            name: "Keema Dosa",
            price: 13.95,
            description: "Thin rice crepe filled with ground lamb and fresh house coconut chutney and sumber.",
            tags: [],
          },
          {
            name: "Chicken Malai Kabab App",
            price: 11.95,
            description: "Chunks of chicken marinated in ginger, garlic, white peppers, and yogurt. (Mild) (Child Friendly)",
            tags: ["mild", "child-friendly"],
          },
        ],
      },
    ],
  },
  {
    id: "soups-and-salads",
    name: "SOUPS AND SALADS",
    image: { src: photo("27.JPG"), alt: "Saag — slow-cooked spinach with fresh tomato" },
    groups: [
      {
        name: "Apps",
        note: "",
        items: [
          {
            name: "Mulligatawny Soup",
            price: 5.95,
            description: "Traditional soup made with lentils, vegetables, herbs & ground spices.",
            tags: ["veg"],
          },
          {
            name: "Tomato Soup",
            price: 5.95,
            description: "Cream of fresh tomatoes, garnished with roasted bread croutons & fresh ground spices.",
            tags: ["veg"],
          },
          {
            name: "Chefs Salad",
            price: 7.95,
            description: "Tomato, cucumber, green pepper, onion & carrot with homemade dressing.",
            tags: ["veg"],
          },
          {
            name: "Chicken Soup",
            price: 5.95,
            description: "Flavored with onion, ginger, garlic and garnished with coriander leaves.",
            tags: [],
          },
        ],
      },
    ],
  },
  {
    id: "vegetarian",
    name: "VEGETARIAN",
    image: { src: photo("10.jpg"), alt: "Mixed vegetables in a copper karahi" },
    groups: [
      {
        name: "Entrees",
        note: "All Entrees are served with aromatic Basmati Rice. We use Canola oil in all of our foods. If you have any allergies, please note in the Special Instructions box.",
        items: [
          {
            name: "Sabji Lawjawab",
            price: 17.95,
            description: "Fresh mixed vegetables cooked with tomatoes, ginger, and bay leaves (Low Fat)",
            tags: ["veg", "low-fat"],
          },
          {
            name: "Broccoli Jalferazy",
            price: 17.95,
            description: "Fresh broccoli cooked with onions, tomatoes, ginger, garlic, and bell pepper",
            tags: ["veg"],
          },
          {
            name: "Aloo Gobi",
            price: 17.95,
            description: "Cauliflower, potato & tomato cooked in a delicately spiced light gravy.",
            tags: ["veg", "mild"],
          },
          {
            name: "Baingan Bhurtha",
            price: 17.95,
            description: "Eggplant broiled over charcoal, peeled. mashed & sauteed with chopped onions.",
            tags: ["veg"],
          },
          {
            name: "Chana Masala",
            price: 17.95,
            description: "Chickpeas cooked with medium spiced tomatoes, onions, ginger & garlic.",
            tags: ["veg"],
          },
          {
            name: "Sabji Masala",
            price: 17.95,
            description: "Mixed vegetables cooked in a medium spiced creamy tomato sauce.",
            tags: ["veg"],
          },
          {
            name: "Bhindi Mafaz",
            price: 17.95,
            description: "Deep fried okra with fresh coconut, ginger, onion, garlic & curry leaves.",
            tags: ["veg"],
          },
          {
            name: "Palak Paneer",
            price: 17.95,
            description: "Homemade cheese cubes cooked with delicately spiced spinach gravy.",
            tags: ["veg", "mild"],
          },
          {
            name: "Malai Kofta",
            price: 18.95,
            description: "Minced cottage cheese, potato balls stuffed with nuts & fruits cooked in mildly spiced creamy cashew & almond sauce.",
            tags: ["veg", "mild"],
          },
          {
            name: "Shani Paneer Tikka Masala",
            price: 21.95,
            description: "Chunks of cottage cheese dipped in tomato cream sauce enriched with fresh green spices.",
            tags: ["veg"],
          },
          {
            name: "Aloo Gobi Palak",
            price: 17.95,
            description: "Spinach cooked with potatoes & cauliflower.",
            tags: ["veg"],
          },
          {
            name: "Rani Ki Avial",
            price: 17.95,
            description: "Eggplant, squash, potatoes, yams & carrots in a coconut sauce tempered with fresh curry leaves.",
            tags: ["veg"],
          },
          {
            name: "Navaratan Korma",
            price: 18.95,
            description: "An assortment of vegetables cooked in a mildly spiced creamy cashew & almond sauce.",
            tags: ["veg", "mild"],
          },
          {
            name: "Vegetable Biriyani",
            price: 17.95,
            description: "Aromatic basmati rice cooked Hydrabadi style with a selection of vegetables, spices & a touch of saffron.",
            tags: ["veg"],
          },
          {
            name: "Mushroom Masala",
            price: 18.95,
            description: "Fresh mushrooms cooked in a tomato cream sauce with garlic, ginger and bell pepper.",
            tags: ["veg"],
          },
          {
            name: "Mutter Paneer",
            price: 18.95,
            description: "Fresh home-style cottage cheese cooked gently with fresh garden peas and blended with spices.",
            tags: ["veg"],
          },
          {
            name: "Chana Sag",
            price: 18.95,
            description: "Chickpeas cooked in a medium spiced spinach gravy.",
            tags: ["veg"],
          },
        ],
      },
    ],
  },
  {
    id: "chicken",
    name: "CHICKEN",
    image: { src: photo("29.JPG"), alt: "Butter chicken in a creamy tomato gravy" },
    groups: [
      {
        name: "Entrees",
        note: "All Entrees are served with aromatic Basmati Rice. We use Canola oil in all of our foods. If you have any allergies, please note in the Special Instructions box.",
        items: [
          {
            name: "Chicken Korma",
            price: 20.95,
            description: "Skinless chicken blended with mild spices in a creamy cashew nut sauce.",
            tags: ["mild"],
          },
          {
            name: "Chicken Tikka Sagwala",
            price: 20.95,
            description: "White meat chicken, medium spiced, with tomatoes & creamy spinach sauce.",
            tags: [],
          },
          {
            name: "Chicken Tikka Masala",
            price: 21.95,
            description: "Boneless white meat chicken simmered in a tomato cream sauce with garlic, ginger & bell pepper.",
            tags: [],
          },
          {
            name: "Chicken Makhni",
            price: 20.95,
            description: "Tandoori chicken cooked with chopped tomatoes, green pepper, butter & flavored with spices.",
            tags: ["tandoor"],
          },
          {
            name: "Chicken Vindaloo",
            price: 20.95,
            description: "Chicken cooked with potatoes in a very spicy sauce.",
            tags: ["spicy"],
          },
          {
            name: "Chicken Madras",
            price: 20.95,
            description: "Boneless chicken cooked in a tangy coconut stew flavored with ginger & curry leaves.",
            tags: [],
          },
          {
            name: "Chicken Curry",
            price: 20.95,
            description: "Skinless chicken cooked in tradition Kashmiri masala.",
            tags: [],
          },
          {
            name: "Chicken Jalfreazy",
            price: 20.95,
            description: "Boneless white meat cooked with onions, tomatoes & bell pepper.",
            tags: [],
          },
          {
            name: "Chicken Do Paiza",
            price: 20.95,
            description: "Boneless chicken cooked with garlic, ginger, seasoned onions & bell pepper.",
            tags: [],
          },
          {
            name: "Chicken Biriyani",
            price: 20.95,
            description: "Aromatic long grain Basmati rice cooked with chicken, dry mixed fruits, nuts, blended herbs, spices and fragrant saffron.",
            tags: [],
          },
          {
            name: "Chicken Bhuna",
            price: 20.95,
            description: "Boneless chicken cooked with garlic, ginger, onions, bell peppers & tomatoes served in gravy.",
            tags: [],
          },
          {
            name: "Chicken Kanda Curry",
            price: 20.95,
            description: "Chunks of boneless white meat chicken cooked in coconut milk with spices, onions, tomatoes, and curry leaves.",
            tags: [],
          },
        ],
      },
      {
        name: "Lunch Special",
        note: "",
        items: [
          {
            name: "Non - Veg Style",
            price: 18.95,
            description: "Choice of plain Naan, Appetizer, one Non-Veg entree, and Rice Pudding",
            tags: [],
          },
          {
            name: "Veggie Lovers",
            price: 16.95,
            description: "Choice of plain Naan, Appetizer, one Veg entree, and Rice Pudding",
            tags: [],
          },
        ],
      },
    ],
  },
  {
    id: "lamb",
    name: "LAMB",
    image: { src: photo("21.JPG"), alt: "Red curry finished with onion and cilantro" },
    groups: [
      {
        name: "Entrees",
        note: "All Entrees are served with aromatic Basmati Rice. We use Canola oil in all of our foods. If you have any allergies, please note in the Special Instructions box.",
        items: [
          {
            name: "Lamb Phaal",
            price: 26.95,
            description: "Lamb cooked with a blend of chilies, onions, tomatoes, and spices.",
            tags: ["spicy"],
          },
          {
            name: "Lamb Vindaloo",
            price: 26.95,
            description: "Boneless lamb cooked with potatoes in a hot spicy sauce.",
            tags: ["spicy"],
          },
          {
            name: "Goat Curry",
            price: 28.95,
            description: "cooked with tomato's onion ginger garlic and bayleaf (North Indian style)",
            tags: [],
          },
          {
            name: "Lamb Korma",
            price: 26.95,
            description: "Lamb blended with mild spices, in a creamy cashew nut sauce.",
            tags: ["mild"],
          },
          {
            name: "Lamb Sag",
            price: 26.95,
            description: "Boneless chunks of lamb in a delicately spiced spinach sauce.",
            tags: ["mild"],
          },
          {
            name: "Lamb Rogan Josh",
            price: 25.95,
            description: "Tender cubes of lamb cooked in traditional Kashmiri masala (paprika, royal cumin, cardamom, clove & onion gravy).",
            tags: [],
          },
          {
            name: "Lamb Do Paiza",
            price: 26.95,
            description: "Lamb prepared with a lot of fresh chopped onions & seasonings (garlic, ginger, coriander & medium spices).",
            tags: [],
          },
          {
            name: "Lamb Madras",
            price: 26.95,
            description: "Lamb cooked in a tangy coconut stew flavored with ginger & curry leaves.",
            tags: [],
          },
          {
            name: "Kadai Lamb",
            price: 26.95,
            description: "Tender cubes of lamb cooked with bell pepper, tomatoes & onions tempered with hot chilies & ground spices.",
            tags: [],
          },
          {
            name: "Boti Kabab Masala",
            price: 28.95,
            description: "Lamb kabab slow cooked in the tandoor clay oven & then simmered in a tomato sauce with garlic, ginger & bell pepper.",
            tags: ["tandoor"],
          },
          {
            name: "Lamb Biriyani",
            price: 26.95,
            description: "Cubes of lamb cooked with saffron rice, mixed dry fruits, nuts, pistachios & ghee.",
            tags: [],
          },
          {
            name: "Lamb Chops",
            price: 33.95,
            description: "Lamb chops marinated in mixed spices and baked in a clay oven.",
            tags: [],
          },
        ],
      },
    ],
  },
  {
    id: "tandoori",
    name: "TANDOORI",
    image: { src: photo("25.JPG"), alt: "Tandoori chicken with red onion and lemon" },
    groups: [
      {
        name: "Entrees",
        note: "All Entrees are served with aromatic Basmati Rice. We use Canola oil in all of our foods. If you have any allergies, please note in the Special Instructions box.",
        items: [
          {
            name: "Tandoori Chicken",
            price: 19.95,
            description: "Skinless chicken marinated in yogurt, ginger & flavored with freshly ground spices then baked in a clay oven.",
            tags: ["tandoor"],
          },
          {
            name: "Chicken Tikka",
            price: 20.95,
            description: "Chicken breast marinated in yogurt, ginger & flavored with fresh ground spices then cooked in a clay oven.",
            tags: [],
          },
          {
            name: "Lamb Tikka",
            price: 26.95,
            description: "Cubes of lamb marinated in yogurt, fresh lemon juice, garlic, ginger & spices & roasted in a clay oven.",
            tags: [],
          },
          {
            name: "Tandoori Fish",
            price: 24.95,
            description: "Marinated king fish slow cooked in the tandoor clay oven.",
            tags: ["tandoor"],
          },
          {
            name: "Shrimp Tandoori",
            price: 24.95,
            description: "Jumbo shrimp marinated in yogurt, ginger, garlic, delicately flavored with spices & baked in a tandoori oven.",
            tags: ["tandoor"],
          },
          {
            name: "Tandoori Medley",
            price: 27.95,
            description: "Lamb Tikka, chicken kebab, tandoori shrimp, seek kebab and tandoori chicken.",
            tags: ["tandoor"],
          },
          {
            name: "Tandoori Lobster",
            price: 39.95,
            description: "Marinated succulent lobster slow cooked in the tandoor clay oven.(One piece)",
            tags: ["tandoor"],
          },
          {
            name: "Paneer Tikka",
            price: 21.95,
            description: "Homemade cottage cheese in a subtle cardamom marinade; grilled to perfection in the tandoori clay oven.",
            tags: ["tandoor"],
          },
        ],
      },
    ],
  },
  {
    id: "seafood",
    name: "SEAFOOD",
    image: { src: photo("22.JPG"), alt: "Shrimp in a delicate cream sauce" },
    groups: [
      {
        name: "Entrees",
        note: "All Entrees are served with aromatic Basmati Rice. We use Canola oil in all of our foods. If you have any allergies, please note in the Special Instructions box.",
        items: [
          {
            name: "Shrimp Korma",
            price: 24.95,
            description: "Jumbo shrimp gently simmered in coconut milk, blended with mild spices and a creamy cashew nut sauce.",
            tags: ["mild"],
          },
          {
            name: "Tandoori Shrimp Masala",
            price: 24.95,
            description: "Shrimp tikka slow cooked in the tandoor clay oven and then simmered in a tomato cream sauce with garlic, ginger and bell pepper.",
            tags: ["tandoor"],
          },
          {
            name: "Shrimp Bhuna",
            price: 24.95,
            description: "Jumbo shrimp cooked with garlic, ginger, onions, bell peppers and tomatoes served in gravy.",
            tags: [],
          },
          {
            name: "Shrimp Manglorian",
            price: 24.95,
            description: "Jumbo shrimp cooked in a tangy coconut stew flavored with ginger and curry leaves.",
            tags: [],
          },
          {
            name: "Manglorian Fish Curry",
            price: 20.95,
            description: "Fish cooked in a tangy coconut stew with ginger & curry leaves.",
            tags: [],
          },
          {
            name: "Shrimp Vindaloo",
            price: 24.95,
            description: "A Goan specialty, shrimp cooked with potato in a very hot sauce.",
            tags: ["spicy"],
          },
          {
            name: "Shrimp Malai",
            price: 24.95,
            description: "Jumbo shrimp marinated in a mild garlic, ginger, cashew almond cream sauce and then cooked in the tandoor clay oven.",
            tags: ["tandoor"],
          },
          {
            name: "Shrimp Biriyani",
            price: 24.95,
            description: "Jumbo shrimp cooked with saffron rice, almonds, pistachios & coriander leaves.",
            tags: [],
          },
          {
            name: "Shrimp Sag",
            price: 24.95,
            description: "Jumbo shrimp cooked in a mild spinach sauce.",
            tags: [],
          },
        ],
      },
    ],
  },
  {
    id: "medley",
    name: "MEDLEY",
    image: { src: photo("20.JPG"), alt: "Creamy tomato curry with scallions" },
    groups: [
      {
        name: "Entrees",
        note: "All Entrees are served with aromatic Basmati Rice. We use Canola oil in all of our foods. If you have any allergies, please note in the Special Instructions box.",
        items: [
          {
            name: "Korma Medley",
            price: 28.95,
            description: "Simmered in coconut milk, blended with mild spices, and a creamy cashew nut sauce.",
            tags: ["mild"],
          },
          {
            name: "Dhaba Medley",
            price: 28.95,
            description: "Prepared first in the tandoori oven, and later cooked with ginger, onions, tomatoes, and curry leaves.",
            tags: ["tandoor"],
          },
          {
            name: "Masala Medley",
            price: 28.95,
            description: "Tomato cream sauce with garlic, ginger and bell pepper. The “favorite tikka-masala sauce”",
            tags: [],
          },
          {
            name: "Madras Medley",
            price: 28.95,
            description: "Tangy coconut stew flavored with ginger and curry leaves.",
            tags: [],
          },
          {
            name: "Lamb Vindaloo",
            price: 27.95,
            description: "Boneless lamb cooked with potatoes in a hot spicy sauce.",
            tags: ["spicy"],
          },
          {
            name: "Bhuna Medley",
            price: 28.95,
            description: "Cooked with garlic, ginger, onion, bell peppers and tomatoes served in a thick gravy sauce.",
            tags: [],
          },
          {
            name: "Sag Medley",
            price: 28.95,
            description: "Creamy spinach sauce",
            tags: [],
          },
          {
            name: "Biriyani Medley",
            price: 28.95,
            description: "Aromatic long grain Basmati rice cooked with dry mixed fruits, nuts, blended herbs, spices and fragrant saffron.",
            tags: [],
          },
        ],
      },
    ],
  },
  {
    id: "side-dishes",
    name: "SIDE DISHES",
    image: { src: photo("4a.jpg"), alt: "Vegetable karahi with fresh peppers" },
    groups: [
      {
        name: "Options",
        note: "",
        items: [
          {
            name: "Rice",
            price: 5.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Mixed Pickles",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Mango Chutney",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Raita",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Hot Sauce",
            price: 4.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Masala Sauce",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Dal Maharani Makhani",
            price: 13.95,
            description: "Black lentil",
            tags: ["veg"],
          },
          {
            name: "Dal Tarka",
            price: 13.95,
            description: "Yellow lentil",
            tags: ["veg"],
          },
        ],
      },
    ],
  },
  {
    id: "breads",
    name: "BREADS",
    image: { src: photo("26.JPG"), alt: "Naan fresh from the tandoor" },
    groups: [
      {
        name: "Options",
        note: "",
        items: [
          {
            name: "Nan",
            price: 4.95,
            description: "Unleavened Indian bread baked in the tandoori clay oven.",
            tags: ["veg", "tandoor"],
          },
          {
            name: "Onion Nan",
            price: 5.5,
            description: "Unleavened bread stuffed with chopped onions, green pepper and red pepper.",
            tags: ["veg"],
          },
          {
            name: "Garlic Nan",
            price: 5.5,
            description: "Unleavened bread stuffed with ground garlic and cilantro.",
            tags: ["veg"],
          },
          {
            name: "Rani Ki Special Nan",
            price: 6.25,
            description: "Bread stuffed with minced chicken tikka and coriander leaves.",
            tags: [],
          },
          {
            name: "Peshwari Nan",
            price: 6.25,
            description: "Unleavened bread stuffed with nuts, raisins, and cherry.",
            tags: ["veg"],
          },
          {
            name: "Poori",
            price: 6.25,
            description: "A puffed whole wheat bread.",
            tags: ["veg"],
          },
          {
            name: "Chapathi",
            price: 5.5,
            description: "Thin dry whole wheat bread.",
            tags: ["veg"],
          },
          {
            name: "Aloo Paratha",
            price: 7.25,
            description: "Paratha stuffed with potatoes, ginger, garlic and coriander leaves.",
            tags: ["veg"],
          },
          {
            name: "Keema Paratha",
            price: 8.5,
            description: "Paratha stuffed with lamb, ginger, garlic, onion & tomato.",
            tags: [],
          },
        ],
      },
    ],
  },
  {
    id: "beverages",
    name: "BEVERAGES",
    image: { src: photo("7a.jpg"), alt: "Appetizers with wine poured" },
    groups: [
      {
        name: "Cold Bevs",
        note: "",
        items: [
          {
            name: "Coke",
            price: 2.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Diet Coke",
            price: 2.75,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Sprite",
            price: 2.75,
            description: "",
            tags: ["veg"],
          },
          {
            name: "GInger Ale",
            price: 2.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Club Soda",
            price: 2.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Tonic",
            price: 2.25,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Cranberry Juice",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Apple Juice",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Orange Juice",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Redpom",
            price: 3.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Pineapple Juice",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Mango Lassi",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Salt Lassi",
            price: 6,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Numbu Pani",
            price: 6,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Poland Spring",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Sweet T Lassi",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Milk",
            price: 3.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Ice Tea",
            price: 3.25,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Mango Juice",
            price: 4.5,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Chocolate Milk",
            price: 3.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Strawberry Lassi",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Snapple",
            price: 3.95,
            description: "",
            tags: ["veg"],
          },
        ],
      },
    ],
  },
  {
    id: "dessert",
    name: "DESSERT",
    image: { src: photo("28.JPG"), alt: "Golden korma with peppers and cashew" },
    groups: [
      {
        name: "Dessert",
        note: "",
        items: [
          {
            name: "Rice Pudding",
            price: 4.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Rasamalai",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Gulab Jumun",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Mango Ice Cream",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Coconut Ice Cream",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Kulfi",
            price: 5.95,
            description: "",
            tags: ["veg"],
          },
          {
            name: "Free Dessert",
            price: 4.95,
            description: "",
            tags: ["veg"],
          },
        ],
      },
    ],
  },
];

/** Flat list of every item, for search and counts. */
export const allMenuItems = menu.flatMap((s) =>
  s.groups.flatMap((g) => g.items.map((i) => ({ ...i, sectionId: s.id, sectionName: s.name })))
);

/** Catering is quoted per tray, so these carry no prices. */
export const cateringGroups: { group: string; items: string[] }[] = [
  {
    group: "Veg App",
    items: ["Veg Samosa", "Veg Pakora", "Veg Cutlets", "Papad"],
  },
  {
    group: "Meat App",
    items: ["Chicken Tikka", "Chicken Malai Kebab", "Sheekh Kebab", "Meat Samosa"],
  },
  {
    group: "Shrimp",
    items: ["Shrimp Korma", "Tandoori Shrimp Masala", "Shrimp Bhuna", "Shrimp Manglorian", "Manglorian Fish Curry", "Shrimp Sag", "Shrimp Vindaloo", "Shrimp Biriyani"],
  },
  {
    group: "Chicken",
    items: ["Chicken Tikka Masala", "Chicken Korma", "Chicken Madras", "Chicken Vindaloo", "Tandoori Chicken", "Chicken Tikka Sagwala", "Chicken Sag", "Chicken Biriyani", "Chicken Do Piaza", "Chicken Jalfreazy"],
  },
  {
    group: "Rice",
    items: ["Pulao Rice", "Veg Pulao", "Tamarind Rice", "Coconut Rice", "Tomato Rice", "Lemon Rice"],
  },
  {
    group: "Lamb",
    items: ["Rogan Josh", "Lamb Madras", "Lamb Saag", "Lamb Vindaloo", "Boti Kebab Masala", "Keema Mutter", "Kadai Lamb", "Lamb Do Paiza", "Lamb Biriyani"],
  },
  {
    group: "Bread",
    items: ["Naan", "Garlic Naan", "Onion Kulcha", "Tawa Paratha", "Tandoori Roti", "Peshwari Naan", "Kheema Naan", "Aloo Paratha", "Rani Ki Special Nan"],
  },
  {
    group: "Dessert",
    items: ["Rice Kheer", "Gulab Jamun", "Ras Malai", "Gajar Ka Halwa", "Semiya Payasam"],
  },
  {
    group: "Vegetable",
    items: ["Palak Paneer", "Navaratan Korma", "Chole Peshwari", "Bombay Aloo", "Bhindi Dopiaza", "Avial", "Malai Kofta", "Shahi Paneer", "Channa Saag", "Sabji Masala", "Veg Vindaloo", "Veg Jalfrazi", "Sabji Saag Malai", "Baingen Burtha", "Channa Masala", "Daal Tadka", "Daal Makhani", "Aloo Gobhi"],
  },
];
