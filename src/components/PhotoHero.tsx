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

const overlays = {
  none: "",
  soft: "bg-ink/20",
  bottom: "bg-gradient-to-t from-ink/80 via-ink/25 to-transparent",
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
      {overlay !== "none" && <div className={`absolute inset-0 ${overlays[overlay]}`} />}

      {children && (
        <Reveal className="relative z-10 mx-auto max-w-[90rem] w-full px-5 sm:px-10 pb-14 sm:pb-20 pt-32">
          {children}
        </Reveal>
      )}
    </section>
  );
}
