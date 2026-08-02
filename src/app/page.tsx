import Link from "next/link";
import { Button } from "@/components/Button";
import { DishCarousel } from "@/components/DishCarousel";
import { EditorialImage } from "@/components/EditorialImage";
import { HomeHero } from "@/components/HomeHero";
import { OpenStatus } from "@/components/OpenStatus";
import { PhotoMosaic } from "@/components/PhotoMosaic";
import { Reveal } from "@/components/Reveal";
import { SeniorTuesdaysModal } from "@/components/SeniorTuesdaysModal";
import { FAQ } from "@/components/FAQ";
import { FAQStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { aiConcept } from "@/content/images";
import { homeCopy } from "@/content/copy";
import { featuredDishes } from "@/content/featured";
import { galleryImages } from "@/content/gallery";
import { getMenu } from "@/content/menu";
import { getOrderingMenu } from "@/lib/orderingMenu";
import { faqItems } from "@/content/faq";

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

export default async function HomePage() {
  const { sections, itemCount } = await getMenu();
  const { itemMap } = await getOrderingMenu();
  const mosaicImages = galleryImages.filter((img) => img.category === "dishes").slice(0, 5);

  // Price and the "Order this" link both come from the live ordering menu,
  // keyed by orderItemId — never hand-typed, so they can't drift out of sync
  // with what actually lands in the cart.
  const resolvedFeaturedDishes = featuredDishes
    .map((dish) => {
      const item = itemMap[dish.orderItemId];
      if (!item) return null;
      return {
        ...dish,
        price: item.price,
        orderHref: `${restaurant.links.orderOnline}/?add=${dish.orderItemId}`,
      };
    })
    .filter((dish): dish is NonNullable<typeof dish> => dish !== null);

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
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href={restaurant.links.orderOnline}
              external
              variant="primary"
              size="lg"
              className="!px-10 !py-5 !text-lg"
            >
              Order Online
            </Button>
            <Button href="/menu" variant="secondary" size="lg" className="!px-10 !py-5 !text-lg">
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
            All {itemCount} dishes →
          </Link>
        </Reveal>
        <DishCarousel dishes={resolvedFeaturedDishes} />
      </section>

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

      {/* Menu breadth — the whole card at a glance, each a deep link */}
      <section className="mx-auto max-w-[90rem] px-5 sm:px-10 py-20 sm:py-28">
        <Reveal className="mb-10 sm:mb-14">
          <p className="eyebrow mb-3">The whole menu</p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl max-w-2xl">
            {itemCount} dishes, {sections.length} sections
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {sections.map((section, i) => {
            const count = section.groups.reduce((a, g) => a + g.items.length, 0);
            const image = section.images[0];
            // On mobile (2-col grid), 11 sections leaves one orphaned tile
            // in its own row. Spanning it full-width — at the same height
            // two normal 4:3 tiles would have side by side (aspect-[8/3]) —
            // turns that leftover row into a closing banner instead of a
            // gap, so the grid reads as a clean 2x6 rather than 2x5-plus-one.
            const isLast = i === sections.length - 1;
            return (
              <Reveal key={section.id} delay={i * 40} className={isLast ? "col-span-2 sm:col-span-1" : undefined}>
                <Link href={`/menu#${section.id}`} className="group block">
                  <div
                    className={`relative rounded-2xl overflow-hidden mb-3 bg-surface ${
                      isLast ? "aspect-[8/3] sm:aspect-[4/3]" : "aspect-[4/3]"
                    }`}
                  >
                    {image && (
                      <EditorialImage
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 47vw"
                        hoverZoom
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-bone/10 group-hover:ring-saffron/50 transition-colors duration-300 pointer-events-none" />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm sm:text-base group-hover:text-saffron transition-colors duration-300">
                      {section.name}
                    </span>
                    <span className="text-xs text-muted flex-shrink-0">{count}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Editorial photo mosaic */}
      <section className="pb-20 sm:pb-28">
        <Reveal className="mx-auto max-w-[90rem] px-5 sm:px-10 mb-10 sm:mb-14">
          <p className="eyebrow mb-3">Photography</p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl">From our kitchen</h2>
        </Reveal>
        <PhotoMosaic images={mosaicImages} />
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

      {/* FAQ — visible copy must match FAQStructuredData exactly */}
      <section className="py-20 sm:py-28">
        <Reveal className="mx-auto max-w-3xl px-5 sm:px-10 mb-10 sm:mb-14 text-center">
          <p className="eyebrow mb-3">Questions</p>
          <h2 className="text-3xl sm:text-5xl">Good to know</h2>
        </Reveal>
        <div className="px-5 sm:px-10">
          <FAQ items={faqItems} id="faq" />
        </div>
      </section>
      <FAQStructuredData items={faqItems} />

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

      <SeniorTuesdaysModal />
    </>
  );
}
