"use client";

import { useEffect, useRef, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";

export type HeroPhoto = { src: string; alt: string };
export type HeroVideo = {
  src: string;
  poster: string;
  playbackRate?: number;
  /** Scale factor for clips whose framing is too wide/loose as shot. */
  zoom?: number;
  /** Real-time color grade — each clip's own lighting needs its own
   * correction (a shot that's already dark and low-key needs a much
   * lighter touch than one that's flat and evenly lit, or its shadow
   * detail — the flame, here — just crushes to black). Defaults to a
   * gentle, near-neutral grade. */
  contrast?: number;
  saturate?: number;
  brightness?: number;
};

type HomeHeroProps = {
  /** Real footage, when there is any — takes over as the sole background,
   * playing each clip once in turn before advancing to the next. */
  videos?: HeroVideo[];
  photos?: HeroPhoto[];
  /** Seconds each photo holds before crossfading to the next. */
  photoDuration?: number;
  children: React.ReactNode;
};

/** The home hero: real footage if there is any, otherwise a slow crossfade
 * through the restaurant's food photography. */
export function HomeHero({ videos = [], photos = [], photoDuration = 6, children }: HomeHeroProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = videos.length > 0;

  useEffect(() => {
    if (hasVideo || photos.length === 0) return;
    const id = window.setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, photoDuration * 1000);
    return () => window.clearInterval(id);
  }, [photos.length, photoDuration, hasVideo]);

  useEffect(() => {
    if (!hasVideo || !videoRef.current) return;
    // Playback itself is driven by the native `autoPlay` attribute below —
    // far more reliable than an imperative .play() call here, which raced
    // against the `key`-triggered remount (React re-runs this effect before
    // the browser has necessarily loaded enough of the new clip to play,
    // and the resulting promise silently aborts). Pausing and setting
    // playbackRate, by contrast, are always safe to call immediately, so
    // this effect only needs to step in for what autoPlay can't handle:
    // per-clip slow motion, and respecting the visitor's OS-level motion
    // preference (same spirit as the reduced-motion block in globals.css
    // that turns off ken-burns/reveal). The <video poster> still shows a
    // real photo either way.
    videoRef.current.playbackRate = videos[videoIndex].playbackRate ?? 1;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      videoRef.current.pause();
    }
  }, [hasVideo, videoIndex, videos]);

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink">
      {hasVideo ? (
        <video
          // key forces a full remount on every clip change, which resets
          // playback and re-triggers the autoplay effect above — simpler
          // and more reliable than manually calling load()/currentTime=0.
          key={videos[videoIndex].src}
          ref={videoRef}
          poster={videos[videoIndex].poster}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setVideoIndex((i) => (i + 1) % videos.length)}
          // The source footage reads flat/muddy next to the site's own
          // art-directed dark photography — a real-time per-clip color grade
          // closes that gap without needing the source files re-encoded.
          // `zoom` is a per-clip scale on top of object-cover's own crop,
          // for clips shot wider/looser than the framing we actually want.
          style={{
            transform: videos[videoIndex].zoom ? `scale(${videos[videoIndex].zoom})` : undefined,
            filter: `contrast(${videos[videoIndex].contrast ?? 1.1}) saturate(${
              videos[videoIndex].saturate ?? 1.05
            }) brightness(${videos[videoIndex].brightness ?? 1})`,
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videos[videoIndex].src} type="video/mp4" />
        </video>
      ) : (
        photos.map((p, i) => (
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
        ))
      )}

      {/* Lighter than the menu/about scrims deliberately: those were tuned for
          bright, flash-lit photos on white plates. The real tandoor footage
          is already dark on its own — even this scrim was crushing it
          further on top of that, so it's lighter still than the original
          AI-concept-photo version of this same comment described. Just
          enough to carry the text, not to darken the footage itself. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 from-10% via-ink/25 via-50% to-transparent" />
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-ink/70 via-ink/20 via-40% to-transparent" />

      {/* Individual pieces of `children` bring their own staggered
          hero-reveal treatment (see page.tsx) — this is just the layout
          container, not a reveal itself. */}
      <div className="relative z-10 mx-auto max-w-[90rem] w-full px-5 sm:px-10 pb-14 sm:pb-20 pt-32">
        {children}
      </div>
    </section>
  );
}
