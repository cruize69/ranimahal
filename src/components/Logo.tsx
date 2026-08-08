import Image from "next/image";

/**
 * Rani Mahal's mark: the apsara medallion.
 *
 * She is the celestial dancer painted on the dining room wall — floating in
 * swirling cloud, one arm raised, her hair streaming out past the gold rim of
 * the frame. Supplied as artwork; `scripts/prepare-logo.mjs` lifts her off the
 * white she arrived on so she sits on the site's near-black without a card
 * behind her.
 *
 * Below roughly 40px she turns to mush, so the favicon uses a pre-scaled
 * `icon.png` (32×32) and the apple-touch-icon uses the full medallion at 180px.
 */

type LogoProps = {
  className?: string;
  /** Accessible name; pass null where an adjacent wordmark already names it. */
  title?: string | null;
  priority?: boolean;
  /**
   * Rendered width, so the right variant is fetched. Without it Next assumes
   * full-viewport and ships a 1920px file to fill a 48px header slot.
   */
  sizes?: string;
};

export function Logo({
  className = "",
  title = "Rani Mahal",
  priority = false,
  sizes = "64px",
}: LogoProps) {
  return (
    <Image
      src="/logo/apsara.png"
      alt={title ?? ""}
      width={1100}
      height={1301}
      sizes={sizes}
      priority={priority}
      aria-hidden={title ? undefined : true}
      className={className}
    />
  );
}
