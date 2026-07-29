import { ArchDivider } from "@/components/ArchMotif";
import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="motif-lattice-bg bg-cream-dark/40 border-b border-gold/30">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-20 text-center">
        {eyebrow && (
          <p className="font-display text-maroon tracking-[0.3em] text-xs uppercase mb-3">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl sm:text-5xl mb-5">{title}</h1>
        <ArchDivider className="w-16 h-4 mx-auto mb-5 text-gold" />
        {children}
      </div>
    </div>
  );
}
