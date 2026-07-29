/**
 * Rani Mahal mark — a boteh (paisley), the oldest ornament in the Indian
 * decorative vocabulary, drawn here as a single flame.
 *
 * It comes out of the apsara painting in the dining room: the celestial
 * dancer floating in swirling colour, her hair sweeping up and over in one
 * long curl. That curl, abstracted, is a boteh — and read the other way it is
 * the tandoor flame every dish on the menu passes through. One shape, both
 * readings.
 *
 * Deliberately not figurative. A mark has to survive 18px in a browser tab
 * and a single flat colour, which a rendering of the dancer herself does not.
 *
 * Inherits `currentColor`, so it sits on ink or on bone without a variant.
 */

type LogoProps = {
  className?: string;
  /** Accessible name; pass null when the adjacent wordmark already names it. */
  title?: string | null;
};

export function Logo({ className = "", title = "Rani Mahal" }: LogoProps) {
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
