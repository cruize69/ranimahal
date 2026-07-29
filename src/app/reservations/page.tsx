import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { restaurant } from "@/content/restaurant";
import { orderedHours, formatTime, formatHoursLabel } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Reservations",
  description: `Reserve a table at ${restaurant.name}, or book the Sunday buffet.`,
};

export default function ReservationsPage() {
  const buffetHours = orderedHours().find((h) => h.label);

  return (
    <>
      <PageHeader eyebrow="Reservations" title="Reserve Your Table" />

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 grid gap-12 sm:grid-cols-2">
        <section className="border border-gold/40 p-8 text-center flex flex-col items-center">
          <h2 className="font-display text-2xl mb-3">Dinner & Lunch</h2>
          <p className="text-ink/70 font-body mb-6">
            Book a table for regular dining through Google Reserve — it also shows live
            availability right on our Google Business listing.
          </p>
          <ul className="text-sm text-ink/60 font-body mb-6 space-y-1">
            {orderedHours()
              .filter((h) => !h.label)
              .map((h) => (
                <li key={h.day}>
                  {h.day}: {formatTime(h.opens)} – {formatTime(h.closes)}
                </li>
              ))}
          </ul>
          <Button href={restaurant.links.googleReserve} external variant="primary">
            Reserve via Google
          </Button>
        </section>

        <section className="border border-gold/40 p-8 text-center flex flex-col items-center bg-cream-dark/30">
          <h2 className="font-display text-2xl mb-3">
            {buffetHours ? formatHoursLabel(buffetHours) : "Sunday Buffet"}
          </h2>
          <p className="text-ink/70 font-body mb-6">
            {buffetHours && (
              <>
                {buffetHours.day}s, {formatTime(buffetHours.opens)} – {formatTime(buffetHours.closes)}.{" "}
              </>
            )}
            A card hold secures your spot for our all-you-can-eat Sunday buffet.
          </p>
          <Button href={restaurant.links.buffetReservation} external variant="primary">
            Reserve the Buffet
          </Button>
        </section>
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20 text-center">
        <p className="text-ink/60 font-body">
          Prefer to call? Reach us at{" "}
          <a href={`tel:${restaurant.phone}`} className="underline underline-offset-4">
            {restaurant.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </>
  );
}
