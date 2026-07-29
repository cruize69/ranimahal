import type { ReactNode } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  /** Optional full-bleed hero image behind the header copy. */
  image?: { src: string; alt: string };
};

export function PageHeader({ eyebrow, title, lead, children, image }: PageHeaderProps) {
  if (image) {
    return (
      <section className="relative min-h-[50svh] flex items-end overflow-hidden border-b border-line">
        <EditorialImage
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <Reveal className="relative z-10 mx-auto max-w-[90rem] w-full px-5 sm:px-10 pt-32 pb-14 sm:pb-20">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl max-w-3xl mb-5">{title}</h1>
          {lead && <p className="text-lg text-muted max-w-xl leading-relaxed">{lead}</p>}
          {children}
        </Reveal>
      </section>
    );
  }

  return (
    <div className="border-b border-line pt-16 sm:pt-18">
      <Reveal className="mx-auto max-w-[90rem] px-5 sm:px-10 pt-16 pb-14 sm:pt-24 sm:pb-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-4xl sm:text-6xl max-w-3xl mb-5">{title}</h1>
        {lead && <p className="text-lg text-muted max-w-xl leading-relaxed">{lead}</p>}
        {children}
      </Reveal>
    </div>
  );
}
