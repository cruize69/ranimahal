import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { aboutCopy } from "@/content/copy";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${restaurant.name} in ${restaurant.address.city}, NY.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title={aboutCopy.heading} />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 grid gap-12 sm:grid-cols-5 items-start">
        <div className="sm:col-span-3 space-y-6 font-body text-lg leading-relaxed text-ink/80">
          {aboutCopy.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <h2 className="font-display text-2xl text-maroon pt-6">{aboutCopy.chefHeading}</h2>
          <p>{aboutCopy.chefBio}</p>
        </div>

        <div className="sm:col-span-2 relative aspect-[4/5] overflow-hidden">
          <Image
            src="/images/about.svg"
            alt="Rani Mahal kitchen"
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
