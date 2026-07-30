import Link from "next/link";
import { Button } from "@/components/Button";
import { DishCarousel } from "@/components/DishCarousel";
import { EditorialImage } from "@/components/EditorialImage";
import { HomeHero } from "@/components/HomeHero";
import { OpenStatus } from "@/components/OpenStatus";
import { Ornament } from "@/components/Ornament";
import { PhotoMosaic } from "@/components/PhotoMosaic";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { aiConcept } from "@/content/images";
import { homeCopy } from "@/content/copy";
import { featuredDishes } from "@/content/featured";
import { galleryImages } from "@/content/gallery";
import { allMenuItems, menu } from "@/content/menu";

// PREVIEW ONLY — AI-generated concept art standing in for a real photoshoot,
// swapped in to test a darker art direction. See aiConcept() in
// src/content/images.ts before this ships: none of this is a real photo of
// this restaurant's food, and it must not stay past the preview.
const heroPhotos = [
  { src: aiConcept("tandoori-chicken-a.png"), alt: "Concept: tandoori chicken, dark studio lighting" },
  { src: aiConcept("saag-paneer-b.png"), alt: "Concept: saag paneer with naan, dark studio lighting" },
  { src: aiConcept("curry-bowls-bar.png"), alt: "Concept: curry bowls at the bar, dark studio lighting" },
  { src: aiConcept("wine-bottle.png"), alt: "Concept: wine service, dark studio lighting" },
  { src: aiConcept("sauce-spoon-spices.png"), alt: "Concept: sauce and whole spices, dark studio lighting" },
  { src: aiConcept("thali-platter.png"), alt: "Concept: full thali platter, dark studio lighting" },
];

export default function HomePage() {
  const mosaicImages = galleryImages.filter((img) => img.category === "dishes").slice(0, 5);

  return (
    <>
      {/* Full-viewport hero — photography on a slow crossfade loop */}
      <HomeHero photos={heroPhotos}>
        <div className="max-w-2xl">
          <OpenStatus className="mb-5" />
          <h1 className="mb-5">
            <span className="block font-wordmark text-saffron text-4xl sm:text-6xl lg:text-7xl leading-[1.15] mb-3">
              {homeCopy.heroHeadingLead}
            </span>
            <span className="block text-3xl sm:text-5xl lg:text-6xl leading-[1.08] text-bone/95">
              {homeCopy.heroHeadingRest}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted/90 leading-relaxed mb-8 max-w-lg">
            {homeCopy.heroSubhead}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
              Order Online
            </Button>
            <Button href="/menu" variant="secondary" size="lg">
              View Menu
            </Button>
          </div>
        </div>
      </HomeHero>

      {/* Signature dishes — horizontal scroll of large portraits */}
      <section className="py-20 sm:py-28">
        <Reveal className="mx-auto max-w-[90rem] px-5 sm:px-10 mb-10 sm:mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">From the kitchen</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl">Signature dishes</h2>
          </div>
          <Link
            href="/menu"
            className="link-underline text-sm text-saffron hover:text-saffron-deep transition-colors duration-300"
          >
            All {allMenuItems.length} dishes →
          </Link>
        </Reveal>
        <DishCarousel dishes={featuredDishes} />
      </section>

      <Ornament className="mx-auto max-w-md px-5" />

      {/* Full-bleed atmosphere — image only, caption tucked in corner */}
      <section className="relative h-[65svh] min-h-[28rem] overflow-hidden">
        <EditorialImage
          src={aiConcept("tandoori-chicken-a.png")}
          alt="Concept: tandoori chicken, dark studio lighting"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <Reveal className="absolute bottom-0 inset-x-0 px-5 sm:px-10 pb-12 sm:pb-16">
          <p className="font-display text-xl sm:text-3xl lg:text-4xl max-w-2xl leading-snug">
            Clay oven past 900°F — the way it has always been done.
          </p>
        </Reveal>
      </section>

      {/* Editorial photo mosaic */}
      <section className="py-20 sm:py-28">
        <Reveal className="mx-auto max-w-[90rem] px-5 sm:px-10 mb-10 sm:mb-14">
          <p className="eyebrow mb-3">Photography</p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl">From our kitchen</h2>
        </Reveal>
        <PhotoMosaic images={mosaicImages} />
      </section>

      {/* Menu breadth — the whole card at a glance, each a deep link */}
      <section className="mx-auto max-w-[90rem] px-5 sm:px-10 pb-20 sm:pb-28">
        <Reveal className="mb-10 sm:mb-14">
          <p className="eyebrow mb-3">The whole menu</p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl max-w-2xl">
            {allMenuItems.length} dishes, {menu.length} sections
          </h2>
        </Reveal>
        <div className="flex flex-wrap gap-x-3 gap-y-3">
          {menu.map((section, i) => {
            const count = section.groups.reduce((a, g) => a + g.items.length, 0);
            return (
              <Reveal key={section.id} delay={i * 40}>
                <Link
                  href={`/menu#${section.id}`}
                  className="group inline-flex items-baseline gap-2.5 border border-line hover:border-saffron px-4 py-2.5 transition-colors duration-300"
                >
                  <span className="text-sm sm:text-base group-hover:text-saffron transition-colors duration-300">
                    {section.name}
                  </span>
                  <span className="text-xs text-muted">{count}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Sunday buffet — split panel: half image, half copy */}
      <section className="grid lg:grid-cols-2 min-h-[28rem]">
        <div className="relative min-h-80 lg:min-h-full overflow-hidden group">
          <EditorialImage
            src={aiConcept("dining-room.png")}
            alt="Concept: dining room, dark studio lighting"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            hoverZoom
            className="object-cover"
          />
        </div>
        <Reveal className="flex items-center bg-surface px-8 sm:px-14 lg:px-16 py-14 sm:py-20">
          <div className="max-w-md">
            <p className="eyebrow mb-4">Every Sunday</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">The Sunday Buffet</h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Our full spread, all you can eat. Seating is limited, so reserve ahead.
            </p>
            <Button href={restaurant.links.buffetReservation} external variant="primary" size="lg">
              Reserve the Buffet
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Interior gallery strip */}
      <section className="py-20 sm:py-28">
        <Reveal className="mx-auto max-w-[90rem] px-5 sm:px-10 mb-10 sm:mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">The room</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl">Mughal-inspired dining</h2>
          </div>
          <Link
            href="/gallery"
            className="link-underline text-sm text-saffron hover:text-saffron-deep transition-colors duration-300"
          >
            View gallery →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-1.5">
          {galleryImages
            .filter((img) => img.category === "interior")
            .slice(0, 3)
            .map((img, i) => (
              <Reveal
                key={img.src}
                delay={i * 100}
                className={`group relative overflow-hidden ${
                  i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[16/10] sm:aspect-auto sm:min-h-[32rem]" : "aspect-[4/3] sm:aspect-auto sm:min-h-64"
                }`}
              >
                <Link href="/gallery" className="block relative w-full h-full min-h-[inherit]">
                  <EditorialImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={
                      i === 0
                        ? "(min-width: 640px) 66vw, 100vw"
                        : "(min-width: 640px) 33vw, 100vw"
                    }
                    hoverZoom
                    className="object-cover"
                  />
                </Link>
              </Reveal>
            ))}
        </div>
      </section>

      {/* Order CTA — minimal, lets the site breathe */}
      <section className="mx-auto max-w-[90rem] px-5 sm:px-10 pb-24 sm:pb-32 text-center">
        <Reveal>
          <p className="eyebrow mb-4">Ready to eat</p>
          <h2 className="text-3xl sm:text-5xl mb-6">Pickup &amp; delivery</h2>
          <p className="text-muted text-lg mb-8 max-w-md mx-auto">
            {restaurant.address.street}, {restaurant.address.city}
          </p>
          <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
            Order Online
          </Button>
        </Reveal>
      </section>
    </>
  );
}
