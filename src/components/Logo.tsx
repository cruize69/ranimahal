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
 * Detail this fine needs room. Below roughly 40px she turns to mush, so
 * anywhere that small — the favicon, the section ornament — uses `Boteh`
 * instead, which is the curl of her hair reduced to one shape.
 */

type LogoProps = {
  className?: string;
  /** Accessible name; pass null where an adjacent wordmark already names it. */
  title?: string | null;
  priority?: boolean;
};

export function Logo({ className = "", title = "Rani Mahal", priority = false }: LogoProps) {
  return (
    <Image
      src="/logo/apsara.png"
      alt={title ?? ""}
      width={1100}
      height={1301}
      priority={priority}
      aria-hidden={title ? undefined : true}
      className={className}
    />
  );
}

/**
 * The reduction: her hair's curl as a single boteh — the paisley, and read the
 * other way a flame. Carries the brand where the medallion cannot: favicon,
 * section dividers, anything under 40px. Inherits `currentColor`.
 */
export function Boteh({ className = "", title = null }: Omit<LogoProps, "priority">) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
    >
      <path
        d="M63 6
           C82 20 92 44 87 64
           C82 85 63 97 43 94
           C23 91 9 73 12 53
           C15 35 29 20 49 13
           C42 27 41 40 46 51
           C52 64 65 68 74 61
           C82 54 84 41 78 30
           C74 23 68 13 63 6 Z"
      />
    </svg>
  );
}
