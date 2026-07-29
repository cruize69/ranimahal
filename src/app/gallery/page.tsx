import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { galleryImages } from "@/content/gallery";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photos from ${restaurant.name} — dishes and dining room.`,
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="A Taste of Rani Mahal" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
        {galleryImages.map((img) => (
          <div key={img.src} className="relative aspect-square overflow-hidden group">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </>
  );
}
