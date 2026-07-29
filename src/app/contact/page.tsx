import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { orderedHours, formatTime, formatHoursLabel } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Visit",
  description: `Find ${restaurant.name} at ${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}.`,
};

const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`;

export default function ContactPage() {
  return (
    <>
      <section className="relative -mt-18 sm:-mt-20 h-[55svh] min-h-80 flex items-end overflow-hidden">
        <Image
          src="/images/exterior.svg"
          alt={`${restaurant.name} at ${restaurant.address.street}`}
          fill
          priority
          sizes="100vw"
          className="object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <Reveal className="relative mx-auto max-w-7xl w-full px-5 sm:px-8 pb-12 sm:pb-16">
          <p className="eyebrow mb-4">Visit Us</p>
          <h1 className="text-4xl sm:text-6xl">Find us on the Avenue</h1>
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-20 grid gap-12 lg:grid-cols-2">
        <Reveal>
          <OpenStatus className="mb-8" />

          <h2 className="eyebrow mb-3">Address</h2>
          <p className="text-lg mb-2">
            {restaurant.address.street}
            <br />
            {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-saffron"
          >
            Get directions →
          </a>

          <h2 className="eyebrow mb-3 mt-10">Phone</h2>
          <a href={`tel:${restaurant.phone}`} className="text-lg hover:text-saffron transition-colors">
            {restaurant.phoneDisplay}
          </a>

          <h2 className="eyebrow mb-3 mt-10">Hours</h2>
          <ul className="space-y-1.5 text-muted max-w-xs">
            {orderedHours().map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{formatHoursLabel(h)}</span>
                <span>
                  {formatTime(h.opens)} – {formatTime(h.closes)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 mt-10">
            <Button href={restaurant.links.orderOnline} external variant="primary">
              Order Online
            </Button>
            <Button href="/reservations" variant="secondary">
              Reserve a Table
            </Button>
          </div>
        </Reveal>

        <Reveal
          delay={120}
          className="min-h-80 lg:min-h-full rounded-xl overflow-hidden border border-line"
        >
          <iframe
            title={`Map to ${restaurant.name}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
            className="w-full h-full min-h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </>
  );
}
