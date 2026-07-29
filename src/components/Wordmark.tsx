import { Logo } from "@/components/Logo";
import { restaurant } from "@/content/restaurant";

// Yatra One's space glyph is very narrow, so the two words are set as
// separate spans with an explicit gap. Those spans are hidden from assistive
// tech and a properly spaced copy is exposed instead, so screen readers read
// "Rani Mahal" rather than "RaniMahal".
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-wordmark inline-flex gap-[0.28em] whitespace-nowrap ${className}`}>
      <span aria-hidden="true">Rani</span>
      <span aria-hidden="true">Mahal</span>
      <span className="sr-only">Rani Mahal</span>
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
  markClassName = "w-8",
  wordmarkClassName = "text-xl sm:text-2xl",
}: LockupProps) {
  return (
    <span
      className={`inline-flex ${
        stacked ? "flex-col items-center gap-3" : "flex-row items-center gap-3"
      } ${className}`}
    >
      <Logo variant={stacked ? "crest" : "mark"} className={markClassName} title={null} />
      <span className={stacked ? "flex flex-col items-center" : "flex flex-col"}>
        <Wordmark className={wordmarkClassName} />
        {tagline && (
          <span className="eyebrow mt-1 text-[0.6rem]">{restaurant.tagline}</span>
        )}
      </span>
    </span>
  );
}
