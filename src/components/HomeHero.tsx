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
   * dissolving from one clip to the next in an endless loop. */
  videos?: HeroVideo[];
  photos?: HeroPhoto[];
  /** Seconds each photo holds before crossfading to the next. */
  photoDuration?: number;
  children: React.ReactNode;
};

// How long before a clip's natural end the dissolve into the next one
// starts, and how long that dissolve takes to complete.
const CROSSFADE_S = 1;
const CROSSFADE_MS = CROSSFADE_S * 1000;

function gradeStyle(video: HeroVideo): React.CSSProperties {
  return {
    transform: video.zoom ? `scale(${video.zoom})` : undefined,
    filter: `contrast(${video.contrast ?? 1.1}) saturate(${video.saturate ?? 1.05}) brightness(${
      video.brightness ?? 1
    })`,
  };
}

/** The home hero: real footage if there is any, otherwise a slow crossfade
 * through the restaurant's food photography.
 *
 * Only one <video> element is ever actually playing at a time. An earlier
 * version ran two permanent, simultaneously-live <video> slots and
 * crossfaded their opacity — but a video whose src changes while it's the
 * hidden slot doesn't reliably resume autoplay by the time it's needed again
 * a few seconds later, even with a key-forced remount, and it would freeze
 * on frame 0 right as it became visible. Here the "incoming" layer is just a
 * static <img> of the next clip's poster frame — no autoplay or readiness
 * concerns at all, since it's always instantly paintable. The dissolve is
 * the current video fading out while that poster fades in (true overlap,
 * never a black gap); once that finishes, the video element remounts onto
 * the next clip and snaps straight back to full opacity with no transition,
 * which is invisible because it starts on that exact same poster frame.
 */
export function HomeHero({ videos = [], photos = [], photoDuration = 6, children }: HomeHeroProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const hasVideo = videos.length > 0;
  const multiClip = videos.length > 1;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [dissolving, setDissolving] = useState(false);
  const nextIdx = multiClip ? (currentIdx + 1) % videos.length : currentIdx;

  const videoRef = useRef<HTMLVideoElement>(null);
  // Guards against onTimeUpdate firing the dissolve more than once for the
  // same clip — it fires many times a second while playing.
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasVideo || photos.length === 0) return;
    const id = window.setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, photoDuration * 1000);
    return () => window.clearInterval(id);
  }, [photos.length, photoDuration, hasVideo]);

  useEffect(() => {
    hasTriggeredRef.current = false;
  }, [currentIdx]);

  useEffect(() => {
    if (!hasVideo || !videoRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) videoRef.current.pause();
  }, [hasVideo, currentIdx]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = videos[currentIdx]?.playbackRate ?? 1;
  }, [currentIdx, videos]);

  const handleTimeUpdate = () => {
    if (!multiClip || hasTriggeredRef.current) return;
    const el = videoRef.current;
    if (!el || !el.duration) return;
    if (el.duration - el.currentTime <= CROSSFADE_S) {
      hasTriggeredRef.current = true;
      setDissolving(true);
      window.setTimeout(() => {
        setCurrentIdx((i) => (i + 1) % videos.length);
        setDissolving(false);
      }, CROSSFADE_MS);
    }
  };

  const current = videos[currentIdx];
  const next = videos[nextIdx];

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink">
      {hasVideo && current ? (
        <>
          {multiClip && next && (
            <img
              src={next.poster}
              alt=""
              aria-hidden
              style={{
                ...gradeStyle(next),
                opacity: dissolving ? 1 : 0,
                transition: dissolving ? `opacity ${CROSSFADE_MS}ms ease-in-out` : "none",
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <video
            // Forces a full remount whenever the active clip changes — this
            // always happens while the element is at opacity 1 already
            // showing the outgoing clip's *last* frame, then immediately
            // snaps to the new clip's poster frame with no transition, which
            // reads as continuous because the poster overlay above was
            // already showing that exact same image a moment ago.
            key={current.src}
            ref={videoRef}
            src={current.src}
            poster={current.poster}
            autoPlay
            loop={!multiClip}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            style={{
              ...gradeStyle(current),
              opacity: dissolving ? 0 : 1,
              transition: dissolving ? `opacity ${CROSSFADE_MS}ms ease-in-out` : "none",
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </>
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
