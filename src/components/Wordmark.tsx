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
