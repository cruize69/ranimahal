import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { orderedHours, formatTime, formatHoursLabel } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Reservations",
  description: `Reserve a table at ${restaurant.name}, or book the Sunday buffet.`,
};

export default function ReservationsPage() {
  const buffet = orderedHours().find((h) => h.label);
  const regularHours = orderedHours().filter((h) => !h.label);

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Reserve your table"
        lead="Book ahead for dinner, or secure a spot at the Sunday buffet."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-20 grid gap-6 lg:grid-cols-2">
        <Reveal
          as="section"
          className="group rounded-xl border border-line hover:border-saffron/40 transition-colors duration-500 overflow-hidden flex flex-col"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src="/images/band-spices.svg"
              alt="Dinner service at Rani Mahal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/40" />
          </div>
          <div className="p-7 flex-1 flex flex-col">
            <h2 className="text-2xl mb-3">Lunch &amp; Dinner</h2>
            <p className="text-muted mb-6">
              Book through Google Reserve — it shows live availability right on our Google listing.
            </p>
            <ul className="text-sm text-muted space-y-1 mb-7">
              {regularHours.map((h) => (
                <li key={h.day} className="flex justify-between max-w-xs">
                  <span>{h.day}</span>
                  <span>
                    {formatTime(h.opens)} – {formatTime(h.closes)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Button href={restaurant.links.googleReserve} external variant="primary">
                Reserve via Google
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal
          as="section"
          delay={120}
          className="group rounded-xl border border-line hover:border-saffron/40 transition-colors duration-500 overflow-hidden flex flex-col"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src="/images/band-buffet.svg"
              alt="Sunday buffet at Rani Mahal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/40" />
          </div>
          <div className="p-7 flex-1 flex flex-col">
            <h2 className="text-2xl mb-3">{buffet ? formatHoursLabel(buffet) : "Sunday Buffet"}</h2>
            <p className="text-muted mb-6">
              {buffet && (
                <>
                  {buffet.day}s, {formatTime(buffet.opens)} – {formatTime(buffet.closes)}.{" "}
                </>
              )}
              All you can eat from our full spread. A card hold secures your spot.
            </p>
            <div className="mt-auto">
              <Button href={restaurant.links.buffetReservation} external variant="primary">
                Reserve the Buffet
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20 text-center">
        <p className="text-muted">
          Larger party or a special occasion? Call us at{" "}
          <a href={`tel:${restaurant.phone}`} className="link-underline text-saffron">
            {restaurant.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </>
  );
}
