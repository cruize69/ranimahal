"use client";

import { useEffect, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";

export type HeroPhoto = { src: string; alt: string };

type HomeHeroProps = {
  photos: HeroPhoto[];
  /** Seconds each photo holds before crossfading to the next. */
  photoDuration?: number;
  children: React.ReactNode;
};

/** The home hero: a slow crossfade through the restaurant's food photography. */
export function HomeHero({ photos, photoDuration = 6, children }: HomeHeroProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, photoDuration * 1000);
    return () => window.clearInterval(id);
  }, [photos.length, photoDuration]);

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink">
      {photos.map((p, i) => (
        <EditorialImage
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          hoverZoom={false}
          className={`object-cover ken-burns transition-opacity duration-[1800ms] ease-out ${
            i === photoIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-ink from-20% via-ink/85 via-55% to-ink/25" />
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-ink via-ink/70 via-40% to-transparent" />

      <Reveal className="relative z-10 mx-auto max-w-[90rem] w-full px-5 sm:px-10 pb-14 sm:pb-20 pt-32">
        {children}
      </Reveal>
    </section>
  );
}
