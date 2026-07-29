/**
 * Rani Mahal mark — a rani framed by a Mughal ogee arch, with a hamsa (swan)
 * at her feet. Drawn from the Raja Ravi Varma-style painting that hangs in the
 * dining room (see the Damayanti-and-the-swan canvas in the gallery), which is
 * the restaurant's most distinctive physical object and the reason the name
 * means "Queen's Palace".
 *
 * Two variants, because a figure this detailed collapses below ~40px:
 *   crest — arch + rani + swan. Use at 48px and up.
 *   mark  — arch + rani only. Use in the header, favicon, anywhere small.
 *
 * Both inherit `currentColor`, so they work on ink or on bone.
 */

type LogoProps = {
  variant?: "crest" | "mark";
  className?: string;
  /** Rendered as the accessible name; pass null for decorative use. */
  title?: string | null;
};

export function Logo({ variant = "mark", className = "", title = "Rani Mahal" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 128"
      className={className}
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
    >
      {/* Ogee arch — sides bulge out, then sweep back to a soft point. */}
      <path
        d="M13 126 L13 72 C13 54 19 42 32 33 C41 27 47 20 50 10 C53 20 59 27 68 33 C81 42 87 54 87 72 L87 126"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M23 126 L23 73 C23 58 28 48 38 41 C44 36 48 30 50 23 C52 30 56 36 62 41 C72 48 77 58 77 73 L77 126"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.38"
      />

      {/* Hair bun, and the jasmine she wears in it. */}
      <circle cx="65" cy="50" r="10.5" fill="currentColor" />
      <circle cx="72" cy="41" r="3" fill="currentColor" opacity="0.5" />

      {/* Head in profile, facing left — brow, nose, lip, chin. */}
      <path
        d="M55 30
           C44 30 36 39 36 50
           C36 53.5 35 55.5 32.6 57.6
           C30.8 59.2 31.2 61 33.4 61.4
           L37.4 62.2
           C37.4 64.4 37.9 66.2 39 67.6
           C40.8 69.8 44 71.2 47.4 71.4
           L47.4 79
           L61 79
           L61 68.4
           C66 64.6 68.5 58.4 68.5 51
           C68.5 38.8 62.6 30 55 30 Z"
        fill="currentColor"
      />

      {/* Bindi and jhumka, punched out of the silhouette. */}
      <circle cx="40.5" cy="45.5" r="2" fill="var(--color-ink, #080706)" opacity="0.5" />
      <circle cx="53" cy="65" r="2.2" fill="var(--color-ink, #080706)" opacity="0.42" />

      {/* Shoulders and the fall of her sari. */}
      <path
        d="M54 77 C43.5 79.5 37 90 35 108 L72 108 C70 90 64 79.5 54 77 Z"
        fill="currentColor"
      />
      <path
        d="M59.5 82 C67 87 70.5 96 71 105"
        stroke="var(--color-ink, #080706)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.42"
      />

      {variant === "crest" && (
        <g opacity="0.9">
          <path
            d="M23 114 C23 107 28 103 33 105 C29.5 106 28 108.5 28.2 111.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <ellipse cx="27" cy="116" rx="8" ry="4.6" fill="currentColor" />
        </g>
      )}

      <path
        d="M17 122.5 L83 122.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.32"
      />
    </svg>
  );
}
