import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <Reveal className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-4xl sm:text-6xl max-w-3xl mb-5">{title}</h1>
        {lead && <p className="text-lg text-muted max-w-xl leading-relaxed">{lead}</p>}
        {children}
      </Reveal>
    </div>
  );
}
