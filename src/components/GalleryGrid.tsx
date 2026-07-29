"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages, galleryCategories, type GalleryCategory } from "@/content/gallery";

export function GalleryGrid() {
  const [active, setActive] = useState<GalleryCategory | "all">("all");

  const images =
    active === "all" ? galleryImages : galleryImages.filter((img) => img.category === active);

  const filters = [{ id: "all" as const, label: "All" }, ...galleryCategories];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActive(filter.id)}
            aria-pressed={active === filter.id}
            className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
              active === filter.id
                ? "bg-saffron text-ink"
                : "border border-line text-muted hover:text-bone hover:border-bone/40"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* `key` on the container restarts the fade when the filter changes. */}
      <div key={active} className="columns-2 lg:columns-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <div
            key={img.src}
            style={{ animationDelay: `${i * 45}ms` }}
            className="group mb-3 sm:mb-4 break-inside-avoid overflow-hidden rounded-lg animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="w-full h-auto object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
