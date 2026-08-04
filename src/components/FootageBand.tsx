import { Reveal } from "@/components/Reveal";

type FootageBandProps = {
  src: string;
  poster: string;
  caption: string;
  /** Scale factor — only needed for a portrait-shot clip being cropped into
   * this landscape band (existing footage was all shot phone-in-hand,
   * vertical). A clip shot in landscape, roughly 16:9, needs none of this:
   * leave `zoom` and `objectPosition` at their defaults and it should drop
   * straight in with little or no cropping. */
  zoom?: number;
  /** CSS object-position — pairs with `zoom` for portrait source footage
   * that needs aiming at a specific band of the frame (e.g. "50% 60%" to
   * favor something lower in a tall portrait shot). Leave at the default
   * center for landscape footage. */
  objectPosition?: string;
  contrast?: number;
  saturate?: number;
  brightness?: number;
  /** Tailwind height classes — the band is short and full-bleed by design,
   * not a second hero moment. */
  heightClassName?: string;
};

/** A short, full-bleed looping-video accent between page sections — real
 * footage as ambient texture, not a focal moment. Single clip, never swaps
 * src, so none of the multi-clip crossfade autoplay concerns in HomeHero
 * apply here: a plain `autoPlay + loop` is fully reliable for one clip.
 */
export function FootageBand({
  src,
  poster,
  caption,
  zoom,
  objectPosition = "50% 50%",
  contrast = 1.1,
  saturate = 1.05,
  brightness = 1,
  heightClassName = "h-48 sm:h-60 lg:h-72",
}: FootageBandProps) {
  return (
    <section className={`relative overflow-hidden bg-ink ${heightClassName}`}>
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          transform: zoom ? `scale(${zoom})` : undefined,
          objectPosition,
          filter: `contrast(${contrast}) saturate(${saturate}) brightness(${brightness})`,
        }}
      />
      {/* Soft dissolve into the section above — no blur. A blurred strip
          creates a seam of its own (an abrupt jump from unblurred to fully
          blurred right at the strip's own edge) and the flame licks up
          close enough to the top of frame to be visibly smeared by it. A
          gradient alone softens the cut without touching the footage. */}
      <div className="absolute inset-x-0 top-0 h-10 sm:h-14 bg-gradient-to-b from-ink/70 to-transparent" />
      {/* Soft dissolve into the section below, doing double duty as the
          caption's legibility scrim. Reaches *true* full ink opacity right
          at the bottom edge — not a tinted approximation of it — so there's
          no visible color step where the section actually ends. Still no
          blur, for the same reason as the top seam. */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink via-ink/45 via-40% to-transparent" />
      <Reveal className="absolute bottom-0 inset-x-0 px-5 sm:px-10 pb-6 sm:pb-8">
        <p className="font-display text-lg sm:text-2xl lg:text-3xl max-w-xl leading-snug">{caption}</p>
      </Reveal>
    </section>
  );
}
