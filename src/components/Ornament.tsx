import { Boteh } from "@/components/Logo";

/**
 * A boteh flanked by hairlines — the brand mark doing double duty as a
 * section break, so the ornament on the page and the mark in the header are
 * the same shape rather than two unrelated decorations.
 */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
      <Boteh className="w-3.5 text-saffron/70 shrink-0" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
    </div>
  );
}
