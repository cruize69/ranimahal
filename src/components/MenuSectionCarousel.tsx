"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";

type CarouselImage = { src: string; alt: string };

type MenuSectionCarouselProps = {
  images: CarouselImage[];
  sectionName: string;
  /** Milliseconds each photo holds before auto-advancing. */
  duration?: number;
};

/**
 * Crossfading photo carousel for a menu section banner. Auto-advances on a
 * timer, but the timer always restarts from whenever `index` last changed —
 * so a manual click buys the visitor the full `duration` before it moves on
 * its own again, rather than being overridden a moment later.
 */
export function MenuSectionCarousel({ images, sectionName, duration = 5000 }: MenuSectionCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), duration);
    return () => window.clearTimeout(id);
  }, [index, count, duration]);

  if (count === 0) return null;

  return (
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <EditorialImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 64rem, 100vw"
          className={`object-cover transition-opacity duration-[1200ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={`Previous ${sectionName} photo`}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-bone/70 hover:text-saffron opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 6 L8 12 L14 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={`Next ${sectionName} photo`}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-bone/70 hover:text-saffron opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 6 L16 12 L10 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${sectionName} photo ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-saffron" : "w-1.5 bg-bone/50 hover:bg-bone/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
