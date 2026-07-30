// Real photography from the existing ranimahalny.com asset library.
// `width`/`height` are the true intrinsic sizes of each source file — they
// drive the masonry column flow and prevent layout shift, so update them if a
// photo is ever re-cropped.
//
// Dish names were identified visually from the photos (the originals have no
// alt text or descriptive filenames). Worth a sanity check with the kitchen.
//
// PREVIEW: a handful of entries below point at aiConcept() — AI concept art,
// not real photos — swapped in specifically because they land in the home
// page's mosaic (first 5 "dishes") or bar strip, to test the darker art
// direction where it's most visible. Swap back to photo() before this ships.

import { photo, aiConcept } from "@/content/images";

export type GalleryCategory = "dishes" | "interior" | "drinks";

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  category: GalleryCategory;
};

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "dishes", label: "Dishes" },
  { id: "interior", label: "The Room" },
  { id: "drinks", label: "At the Table" },
];

export const galleryImages: GalleryImage[] = [
  // — Dishes —
  { src: aiConcept("aloo-gobi.png"), alt: "Concept: aloo gobi, dark studio lighting", width: 588, height: 347, category: "dishes" },
  { src: photo("29.JPG"), alt: "Butter chicken in a creamy tomato gravy", width: 895, height: 724, category: "dishes" },
  { src: aiConcept("saag-paneer-closeup.png"), alt: "Concept: saag paneer close up, dark studio lighting", width: 980, height: 691, category: "dishes" },
  { src: photo("27.JPG"), alt: "Saag — slow-cooked spinach with fresh tomato", width: 998, height: 724, category: "dishes" },
  { src: photo("26.JPG"), alt: "Naan fresh from the tandoor", width: 918, height: 724, category: "dishes" },
  { src: photo("30.JPG"), alt: "Samosas with shredded salad", width: 994, height: 724, category: "dishes" },
  { src: photo("31.JPG"), alt: "Chili chicken with cucumber and lemon", width: 994, height: 724, category: "dishes" },
  { src: photo("21.JPG"), alt: "Red curry finished with onion and cilantro", width: 1190, height: 724, category: "dishes" },
  { src: photo("20.JPG"), alt: "Creamy tomato curry with scallions", width: 1190, height: 724, category: "dishes" },
  { src: photo("28.JPG"), alt: "Golden korma with peppers and cashew", width: 895, height: 724, category: "dishes" },
  { src: photo("1a.jpg"), alt: "Tandoori platter with onion and lemon", width: 1170, height: 660, category: "dishes" },
  { src: photo("2a.jpg"), alt: "Chicken tikka masala with scallions", width: 1170, height: 660, category: "dishes" },
  { src: photo("10.jpg"), alt: "Mixed vegetables in a copper karahi", width: 1170, height: 660, category: "dishes" },
  { src: photo("12a.jpg"), alt: "Peppers and vegetables, close up", width: 1170, height: 660, category: "dishes" },
  { src: photo("4a.jpg"), alt: "Vegetable karahi with fresh peppers", width: 1170, height: 660, category: "dishes" },
  { src: photo("17.jpg"), alt: "Curry served with basmati rice and naan", width: 1170, height: 660, category: "dishes" },
  { src: photo("8a.jpg"), alt: "Curry with naan alongside", width: 1170, height: 660, category: "dishes" },
  { src: photo("3.jpg"), alt: "Curry with naan on the plate", width: 1170, height: 660, category: "dishes" },
  { src: photo("16.jpg"), alt: "Naan with a side salad", width: 1170, height: 660, category: "dishes" },
  { src: photo("5.jpg"), alt: "Fresh naan and salad", width: 1170, height: 660, category: "dishes" },

  // — The room —
  { src: photo("24.JPG"), alt: "Dining room set for service", width: 482, height: 724, category: "interior" },
  { src: photo("23.JPG"), alt: "Framed painting in the dining room", width: 482, height: 724, category: "interior" },
  { src: photo("18.jpg"), alt: "Tables laid with pink linen", width: 1170, height: 660, category: "interior" },
  { src: photo("1.jpg"), alt: "Artwork and awards on the dining room wall", width: 1170, height: 660, category: "interior" },
  { src: photo("7.jpg"), alt: "Painting and awards in the dining room", width: 1170, height: 660, category: "interior" },
  { src: photo("4.jpg"), alt: "Table set with wine and appetizers", width: 1190, height: 846, category: "interior" },

  // — At the table —
  { src: aiConcept("bar-bowls-wine-2.png"), alt: "Concept: curry bowls and wine at the bar, dark studio lighting", width: 588, height: 412, category: "drinks" },
  { src: photo("12.jpg"), alt: "Chili chicken with a glass of red wine", width: 1170, height: 660, category: "drinks" },
  { src: photo("7a.jpg"), alt: "Appetizers with wine poured", width: 1170, height: 660, category: "drinks" },
  { src: photo("8.jpg"), alt: "A table set with wine at Rani Mahal", width: 1170, height: 660, category: "drinks" },
  { src: aiConcept("thali-tray-wide.png"), alt: "Concept: full table spread, dark studio lighting", width: 2000, height: 1422, category: "drinks" },
];
