// PLACEHOLDER GALLERY. Swap `src` for real photography once the shoot assets
// are uploaded to Vercel Blob (see README "Updating photos"). Keep width/height
// accurate — they're used for next/image layout and CLS prevention.

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/dish-1.svg", alt: "Tandoori chicken, plated", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-2.svg", alt: "Butter chicken with rice", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-3.svg", alt: "Lamb rogan josh", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-4.svg", alt: "Vegetable biryani", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-5.svg", alt: "Paneer butter masala", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-6.svg", alt: "Garlic naan fresh from the tandoor", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-7.svg", alt: "Rani Mahal dining room", width: 1200, height: 1200 },
  { src: "/images/gallery/dish-8.svg", alt: "Gulab jamun", width: 1200, height: 1200 },
];
