import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { homeCopy } from "@/content/copy";
import { featuredDishes } from "@/content/featured";
import { galleryImages } from "@/content/gallery";

const ORDER_STEPS = [
  { step: "01", title: "Pick your dishes", body: "Browse the full menu and build your order in a few taps." },
  { step: "02", title: "Choose pickup or delivery", body: "Pay securely online — no phone tag, no waiting on hold." },
  { step: "03", title: "We fire the tandoor", body: "Everything is cooked to order and packed to travel well." },
];

export default function HomePage() {
  const previewImages = galleryImages.slice(0, 5);

  return (
    <>
      {/* Hero — slides under the transparent sticky header */}
      <section className="relative -mt-18 sm:-mt-20 min-h-[92svh] flex items-end overflow-hidden">
        <Image
          src="/images/hero.svg"
          alt="Signature dish at Rani Mahal"
          fill
          priority
          sizes="100vw"
          className="object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />

        <div className="relative mx-auto max-w-7xl w-full px-5 sm:px-8 pb-16 sm:pb-24 pt-32">
          <div className="max-w-3xl">
            <Reveal>
              <OpenStatus className="mb-6" />
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mb-6">
                <span className="block font-wordmark text-saffron text-3xl sm:text-5xl lg:text-6xl mb-3">
                  {homeCopy.heroHeadingLead}
                </span>
                <span className="block text-4xl sm:text-6xl lg:text-7xl leading-[1.05]">
                  {homeCopy.heroHeadingRest}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-lg sm:text-xl text-muted leading-relaxed mb-9 max-w-xl">
                {homeCopy.heroSubhead}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-wrap items-center gap-3">
                <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
                  Order Online
                </Button>
                <Button href="/menu" variant="secondary" size="lg">
                  View Menu
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted">
                Pickup &amp; delivery · {restaurant.address.street}, {restaurant.address.city}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Signature dishes — each card is an order entry point */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Most ordered</p>
            <h2 className="text-3xl sm:text-5xl">What we&apos;re known for</h2>
          </div>
          <Link
            href="/menu"
            className="link-underline text-sm text-saffron hover:text-saffron-deep transition-colors duration-300"
          >
            See the full menu →
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredDishes.map((dish, i) => (
            <Reveal key={dish.name} as="article" delay={i * 90} className="group">
              <Link href={`/menu#${dish.menuSectionId}`} className="block">
                <div className="relative aspect-4/5 overflow-hidden rounded-lg mb-4">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />
                </div>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h3 className="font-display text-lg group-hover:text-saffron transition-colors duration-300">
                    {dish.name}
                  </h3>
                  <span className="text-saffron text-sm">${dish.price}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{dish.blurb}</p>
              </Link>
              <a
                href={restaurant.links.orderOnline}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-3 inline-block text-sm text-saffron"
              >
                Order this →
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Full-bleed atmosphere band */}
      <section className="relative h-[50svh] min-h-80 overflow-hidden">
        <Image
          src="/images/band-tandoor.svg"
          alt="The tandoor at Rani Mahal"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative h-full flex items-center justify-center text-center px-5">
          <Reveal>
            <p className="font-display text-2xl sm:text-4xl lg:text-5xl max-w-3xl leading-tight">
              A clay oven fired past 900°F, the way it has always been done.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How ordering works — removes friction before the CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <Reveal className="text-center mb-14">
          <p className="eyebrow mb-3">Ordering</p>
          <h2 className="text-3xl sm:text-5xl">Dinner, three taps away</h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-3 mb-12">
          {ORDER_STEPS.map((item, i) => (
            <Reveal key={item.step} delay={i * 110}>
              <p className="font-display text-saffron text-2xl mb-3">{item.step}</p>
              <h3 className="text-xl mb-2">{item.title}</h3>
              <p className="text-muted leading-relaxed">{item.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="text-center" delay={340}>
          <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
            Start Your Order
          </Button>
        </Reveal>
      </section>

      {/* Sunday buffet feature */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20 sm:pb-28">
        <Reveal className="relative overflow-hidden rounded-2xl group">
          <Image
            src="/images/band-buffet.svg"
            alt="Sunday buffet at Rani Mahal"
            width={2400}
            height={1000}
            sizes="(min-width: 1280px) 80rem, 100vw"
            className="w-full h-72 sm:h-96 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-12 max-w-lg">
              <p className="eyebrow mb-3">Every Sunday</p>
              <h2 className="text-2xl sm:text-4xl mb-3">The Sunday Buffet</h2>
              <p className="text-muted mb-6">
                Our full spread, all you can eat, noon to 3 PM. Reserve ahead — it fills up.
              </p>
              <Button href={restaurant.links.buffetReservation} external variant="primary">
                Reserve the Buffet
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Gallery preview */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20 sm:pb-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="text-3xl sm:text-5xl">The room</h2>
          <Link
            href="/gallery"
            className="link-underline text-sm text-saffron hover:text-saffron-deep transition-colors duration-300"
          >
            View gallery →
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {previewImages.map((img, i) => (
            <Reveal
              key={img.src}
              delay={i * 70}
              className={`relative overflow-hidden rounded-lg group ${
                i === 0 ? "col-span-2 aspect-square sm:aspect-4/5" : "aspect-square"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 20vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
