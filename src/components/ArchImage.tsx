"use client";

import { useId } from "react";
import { EditorialImage } from "@/components/EditorialImage";

/**
 * A photograph cropped into a Mughal ogee arch.
 *
 * "Mahal" means palace, and the arch is the one form every Mughal palace is
 * built from — so it is the house shape here, not decoration borrowed at
 * random. Kutir up the street frames its photography in a cusped arch too,
 * which is fair proof the form reads locally; theirs is a printed border laid
 * over a rectangle, ours crops the image itself, so the photo takes the shape
 * rather than sitting behind it.
 *
 * The path is in objectBoundingBox units, so one definition scales to any
 * aspect ratio without redrawing.
 */

const ARCH_PATH =
  "M0 1 L0 0.55 C0 0.36 0.07 0.22 0.22 0.13 C0.33 0.06 0.42 0.03 0.5 0 C0.58 0.03 0.67 0.06 0.78 0.13 C0.93 0.22 1 0.36 1 0.55 L1 1 Z";

type ArchImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  hoverZoom?: boolean;
};

export function ArchImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  hoverZoom = true,
}: ArchImageProps) {
  const id = useId().replace(/:/g, "");

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ clipPath: `url(#${id})` }}>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={ARCH_PATH} />
          </clipPath>
        </defs>
      </svg>
      <EditorialImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        hoverZoom={hoverZoom}
        className="object-cover"
      />
    </div>
  );
}

/** The same arch as a hairline outline, for empty frames and ornament. */
export function ArchOutline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 128 L2 72 C2 47 11 29 30 17 C44 8 55 4 50 2 C45 4 56 8 70 17 C89 29 98 47 98 72 L98 128"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
