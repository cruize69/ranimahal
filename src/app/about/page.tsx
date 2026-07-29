import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { EditorialImage } from "@/components/EditorialImage";
import { PhotoHero } from "@/components/PhotoHero";
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
      <PhotoHero
        src={photo("18.jpg")}
        alt="Rani Mahal dining room"
        overlay="bottom"
        priority
        minHeight="min-h-[75svh]"
      >
        <div>
          <p className="eyebrow mb-4">About Us</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl">{aboutCopy.heading}</h1>
        </div>
      </PhotoHero>

      <Reveal className="mx-auto max-w-3xl px-5 sm:px-10 py-20 sm:py-28">
        <p className="font-display text-2xl sm:text-3xl lg:text-4xl leading-snug">{intro}</p>
      </Reveal>

      {/* Kitchen — full-bleed image with text beside on desktop */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[28rem] lg:min-h-[36rem] overflow-hidden group order-1">
          <EditorialImage
            src={photo("8a.jpg")}
            alt="Curry served with naan"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            hoverZoom
            className="object-cover"
          />
        </div>
        <Reveal className="flex items-center px-8 sm:px-14 lg:px-16 py-14 sm:py-20 order-2">
          <div className="max-w-lg">
            <p className="eyebrow mb-4">The Kitchen</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">Nothing rushed</h2>
            <p className="text-lg text-muted leading-relaxed">{kitchenStory}</p>
          </div>
        </Reveal>
      </section>

      {/* The room — reversed split */}
      <section className="grid lg:grid-cols-2">
        <Reveal className="flex items-center px-8 sm:px-14 lg:px-16 py-14 sm:py-20 order-2 lg:order-1">
          <div className="max-w-lg">
            <p className="eyebrow mb-4">The Room</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">Architecture on the menu</h2>
            <p className="text-lg text-muted leading-relaxed mb-10">{motifStory}</p>
            <h3 className="font-display text-2xl mb-3">{aboutCopy.chefHeading}</h3>
            <p className="text-lg text-muted leading-relaxed">{aboutCopy.chefBio}</p>
          </div>
        </Reveal>
        <div className="relative min-h-[28rem] lg:min-h-[36rem] overflow-hidden group order-1 lg:order-2">
          <EditorialImage
            src={photo("23.JPG")}
            alt="Framed painting in the Rani Mahal dining room"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            hoverZoom
            className="object-cover"
          />
        </div>
      </section>

      {/* Wide atmosphere band */}
      <section className="relative h-[50svh] min-h-80 overflow-hidden my-8">
        <EditorialImage
          src={photo("4.jpg")}
          alt="Table set with wine and appetizers"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/30" />
      </section>

      <Reveal as="section" className="mx-auto max-w-3xl px-5 sm:px-10 pb-24 sm:pb-32 text-center">
        <h2 className="text-3xl sm:text-4xl mb-6">Come taste it</h2>
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
