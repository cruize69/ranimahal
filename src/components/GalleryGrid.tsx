"use client";

import { useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { ImageLightbox } from "@/components/ImageLightbox";
import { galleryImages, galleryCategories, type GalleryCategory } from "@/content/gallery";

export function GalleryGrid() {
  const [active, setActive] = useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images =
    active === "all" ? galleryImages : galleryImages.filter((img) => img.category === active);

  const filters = [{ id: "all" as const, label: "All" }, ...galleryCategories];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-12">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActive(filter.id)}
            aria-pressed={active === filter.id}
            className={`px-5 py-2.5 text-sm transition-all duration-300 ${
              active === filter.id
                ? "bg-saffron text-ink"
                : "border border-line text-muted hover:text-bone hover:border-bone/40"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div key={active} className="gallery-masonry">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            style={{ animationDelay: `${i * 40}ms` }}
            className="gallery-masonry-item group w-full text-left animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_both] cursor-zoom-in"
          >
            <EditorialImage
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              hoverZoom
              className="w-full h-auto object-cover"
            />
            <span className="sr-only">View full size: {img.alt}</span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
