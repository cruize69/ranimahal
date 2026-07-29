// PLACEHOLDER GALLERY. Swap `src` for real photography (see README >
// "Updating photos"). Keep width/height accurate — they drive the masonry
// layout and prevent layout shift.

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
  { id: "drinks", label: "Drinks & Sweets" },
];

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/dish-1.svg", alt: "Tandoori chicken, plated", width: 1200, height: 1500, category: "dishes" },
  { src: "/images/gallery/dish-2.svg", alt: "Butter chicken with basmati", width: 1200, height: 900, category: "dishes" },
  { src: "/images/gallery/dish-3.svg", alt: "Lamb rogan josh", width: 1200, height: 1200, category: "dishes" },
  { src: "/images/gallery/dish-4.svg", alt: "Vegetable biryani", width: 1200, height: 1500, category: "dishes" },
  { src: "/images/gallery/dish-5.svg", alt: "Paneer butter masala", width: 1200, height: 900, category: "dishes" },
  { src: "/images/gallery/dish-6.svg", alt: "Garlic naan from the tandoor", width: 1200, height: 1200, category: "dishes" },
  { src: "/images/gallery/interior-1.svg", alt: "Rani Mahal dining room", width: 1200, height: 900, category: "interior" },
  { src: "/images/gallery/interior-2.svg", alt: "Bar seating nook", width: 1200, height: 1500, category: "interior" },
  { src: "/images/gallery/exterior-1.svg", alt: "Rani Mahal on Mamaroneck Ave", width: 1200, height: 900, category: "interior" },
  { src: "/images/gallery/drinks-1.svg", alt: "Mango lassi", width: 1200, height: 1500, category: "drinks" },
  { src: "/images/gallery/drinks-2.svg", alt: "Masala chai", width: 1200, height: 1200, category: "drinks" },
  { src: "/images/gallery/dessert-1.svg", alt: "Gulab jamun", width: 1200, height: 900, category: "drinks" },
];
