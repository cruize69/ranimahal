import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PhotoHero } from "@/components/PhotoHero";
import { restaurant } from "@/content/restaurant";
import { galleryHero } from "@/content/media";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photos from ${restaurant.name}, an Indian restaurant in ${restaurant.address.city}, NY — dishes, dining room, and drinks.`,
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Gallery", url: `${restaurant.url}/gallery` },
        ]}
      />
      <PhotoHero
        src={galleryHero.src}
        alt={galleryHero.alt}
        overlay="soft"
        minHeight="min-h-[55svh]"
      >
        <div>
          <p className="eyebrow mb-4">Gallery</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl max-w-3xl">
            A taste of the room
          </h1>
        </div>
      </PhotoHero>

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <GalleryGrid />
      </div>
    </>
  );
}
