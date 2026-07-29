"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import type { GalleryImage } from "@/content/gallery";

type ImageLightboxProps = {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
};

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const image = images[index];

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/97 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 shrink-0">
        <p className="text-sm text-muted truncate max-w-[60%]">{image.alt}</p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted tabular-nums">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="p-2 text-bone hover:text-saffron transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-5 sm:px-16 pb-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous photo"
          className="absolute left-3 sm:left-6 z-10 p-3 text-bone/60 hover:text-saffron transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 6 L8 12 L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative w-full h-full max-w-6xl mx-auto">
          <EditorialImage
            src={image.src}
            alt={image.alt}
            fill
            quality={95}
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next photo"
          className="absolute right-3 sm:right-6 z-10 p-3 text-bone/60 hover:text-saffron transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 6 L16 12 L10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
