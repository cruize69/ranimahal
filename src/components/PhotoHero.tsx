import type { ReactNode } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";

type PhotoHeroProps = {
  src: string;
  alt: string;
  /** 0–100. Keep overlays light so photography stays vivid. */
  overlay?: "none" | "soft" | "bottom";
  priority?: boolean;
  children?: ReactNode;
  className?: string;
  /** Minimum height — defaults to nearly full viewport. */
  minHeight?: string;
};

// The restaurant's photography is bright and flash-lit on white plates, so a
// light scrim is not enough to carry text. `bottom` holds the lower half at
// near-full ink where the copy sits, and releases toward the top so the dish
// still reads. `soft` is for decorative bands with no text over them.
const overlays = {
  none: "",
  soft: "bg-ink/25",
  bottom: "bg-gradient-to-t from-ink from-20% via-ink/85 via-55% to-ink/25",
};

export function PhotoHero({
  src,
  alt,
  overlay = "bottom",
  priority = false,
  children,
  className = "",
  minHeight = "min-h-[100svh]",
}: PhotoHeroProps) {
  return (
    <section
      className={`relative ${minHeight} flex items-end overflow-hidden ${className}`}
    >
      <EditorialImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        hoverZoom={false}
        className="object-cover ken-burns"
      />
      {overlay !== "none" && (
        <>
          <div className={`absolute inset-0 ${overlays[overlay]}`} />
          {/* On wide screens the copy block is tall and its top rises out of
              the bottom gradient, so it also gets a horizontal scrim anchored
              to the column it actually occupies. */}
          {overlay === "bottom" && (
            <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-ink via-ink/70 via-40% to-transparent" />
          )}
        </>
      )}

      {children && (
        <Reveal className="relative z-10 mx-auto max-w-[90rem] w-full px-5 sm:px-10 pb-14 sm:pb-20 pt-32">
          {children}
        </Reveal>
      )}
    </section>
  );
}
