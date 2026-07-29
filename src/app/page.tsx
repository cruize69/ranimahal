import Image from "next/image";
import { Button } from "@/components/Button";
import { ArchDivider } from "@/components/ArchMotif";
import { restaurant } from "@/content/restaurant";
import { homeCopy } from "@/content/copy";

export default function HomePage() {
  const buffetLabel = restaurant.hours.find((h) => h.label)?.label?.toLowerCase() ?? "dinner";

  return (
    <>
      <section className="relative">
        <div className="relative h-[80vh] min-h-[520px] max-h-[900px] w-full overflow-hidden">
          <Image
            src="/images/hero.svg"
            alt="Signature dish at Rani Mahal"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-5 pb-16 sm:pb-24">
            <p className="font-display text-gold-light tracking-[0.3em] text-xs sm:text-sm uppercase mb-4">
              {restaurant.address.city}, {restaurant.address.state}
            </p>
            <h1 className="font-display text-4xl sm:text-6xl text-cream mb-4 max-w-3xl">
              {homeCopy.heroTagline}
            </h1>
            <p className="text-cream/90 text-lg sm:text-xl max-w-xl mb-8 font-body">
              {homeCopy.heroSubhead}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href={restaurant.links.orderOnline} external variant="primary">
                Order Online
              </Button>
              <Button
                href="/reservations"
                variant="outline"
                className="!text-cream !border-cream hover:!bg-cream hover:!text-ink"
              >
                Reserve a Table
              </Button>
              <Button
                href="/menu"
                variant="outline"
                className="!text-cream !border-cream hover:!bg-cream hover:!text-ink"
              >
                View Menu
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-28 text-center">
        <ArchDivider className="w-20 h-5 mx-auto mb-8 text-gold" />
        <h2 className="font-display text-2xl sm:text-3xl mb-6">A Warm Welcome</h2>
        <p className="text-lg sm:text-xl leading-relaxed text-ink/80 font-body">
          Every dish at {restaurant.name} is built from whole spices and slow-simmered sauces,
          finished in a tandoor fired well past 900°F. Join us for {buffetLabel} in a dining room
          drawn from Mughal architecture.
        </p>
      </section>
    </>
  );
}
