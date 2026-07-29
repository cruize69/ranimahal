import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { aboutCopy } from "@/content/copy";
import { restaurant } from "@/content/restaurant";
import { photo } from "@/content/images";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${restaurant.name} in ${restaurant.address.city}, NY.`,
};

export default function AboutPage() {
  const [intro, kitchenStory, motifStory] = aboutCopy.paragraphs;

  return (
    <>
      <section className="relative -mt-18 sm:-mt-20 h-[70svh] min-h-96 flex items-end overflow-hidden">
        <Image
          src={photo("18.jpg")}
          alt="Rani Mahal dining room"
          fill
          priority
          sizes="100vw"
          className="object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
        <Reveal className="relative mx-auto max-w-7xl w-full px-5 sm:px-8 pb-14 sm:pb-20">
          <p className="eyebrow mb-4">About Us</p>
          <h1 className="text-4xl sm:text-6xl">{aboutCopy.heading}</h1>
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
        <p className="font-display text-2xl sm:text-3xl leading-snug">{intro}</p>
      </Reveal>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-16 sm:pb-24 grid gap-10 lg:grid-cols-2 items-center">
        <Reveal className="relative aspect-4/5 overflow-hidden rounded-xl">
          <Image
            src={photo("8a.jpg")}
            alt="Curry served with naan"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow mb-3">The Kitchen</p>
          <h2 className="text-3xl sm:text-4xl mb-5">Nothing rushed</h2>
          <p className="text-lg text-muted leading-relaxed">{kitchenStory}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-16 sm:pb-24 grid gap-10 lg:grid-cols-2 items-center">
        <Reveal className="lg:order-2 relative aspect-4/5 overflow-hidden rounded-xl">
          <Image
            src={photo("23.JPG")}
            alt="Framed painting in the Rani Mahal dining room"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delay={120} className="lg:order-1">
          <p className="eyebrow mb-3">The Room</p>
          <h2 className="text-3xl sm:text-4xl mb-5">Architecture on the menu</h2>
          <p className="text-lg text-muted leading-relaxed mb-8">{motifStory}</p>

          <h3 className="font-display text-2xl mb-3">{aboutCopy.chefHeading}</h3>
          <p className="text-lg text-muted leading-relaxed">{aboutCopy.chefBio}</p>
        </Reveal>
      </section>

      <Reveal as="section" className="mx-auto max-w-3xl px-5 sm:px-8 pb-20 sm:pb-28 text-center">
        <h2 className="text-3xl sm:text-4xl mb-5">Come taste it</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
            Order Online
          </Button>
          <Button href="/reservations" variant="secondary" size="lg">
            Reserve a Table
          </Button>
        </div>
      </Reveal>
    </>
  );
}
