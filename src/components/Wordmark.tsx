import { Logo } from "@/components/Logo";
import { restaurant } from "@/content/restaurant";

// Great Vibes has normal word spacing, so this is plain text — no split-span
// workaround, and the accessible name comes for free.
//
// `leading-none` alone would clip the script's descenders and the flourish
// under the R, hence the roomier line-height and the small bottom padding.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-wordmark whitespace-nowrap leading-[1.35] pb-[0.08em] ${className}`}>
      Rani Mahal
    </span>
  );
}

type LockupProps = {
  className?: string;
  /** Stack the mark above the words — for the footer and splash moments. */
  stacked?: boolean;
  /** Show "Fine Indian Cuisine" under the name. */
  tagline?: boolean;
  markClassName?: string;
  wordmarkClassName?: string;
};

/** Mark + wordmark, the way the brand should normally appear. */
export function Lockup({
  className = "",
  stacked = false,
  tagline = false,
  markClassName = "w-10 sm:w-11",
  wordmarkClassName = "text-2xl sm:text-3xl",
}: LockupProps) {
  return (
    <span
      className={`inline-flex ${
        stacked ? "flex-col items-center gap-3" : "flex-row items-center gap-3"
      } ${className}`}
    >
      <Logo className={`${markClassName} h-auto shrink-0`} title={null} />
      <span className={stacked ? "flex flex-col items-center" : "flex flex-col"}>
        <Wordmark className={wordmarkClassName} />
        {tagline && (
          <span className="eyebrow mt-1 text-[0.6rem]">{restaurant.tagline}</span>
        )}
      </span>
    </span>
  );
}
