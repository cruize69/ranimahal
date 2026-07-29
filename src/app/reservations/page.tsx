import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { photo } from "@/content/images";
import { orderedHours, formatWindow } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Reservations",
  description: `Reserve a table at ${restaurant.name}, or book the Sunday buffet.`,
};

export default function ReservationsPage() {
  const hours = orderedHours();

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Reserve your table"
        lead="Book ahead for dinner, or secure a spot at the Sunday buffet."
        image={{ src: photo("4.jpg"), alt: "A table set with wine and appetizers" }}
      />

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24 grid gap-8 lg:grid-cols-2">
        <Reveal as="section" className="group overflow-hidden flex flex-col bg-surface">
          <div className="relative aspect-[16/10] overflow-hidden">
            <EditorialImage
              src={photo("18.jpg")}
              alt="Tables laid with pink linen"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              hoverZoom
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-10 flex-1 flex flex-col">
            <h2 className="text-2xl sm:text-3xl mb-3">Lunch &amp; Dinner</h2>
            <p className="text-muted mb-6 leading-relaxed">
              Book through Google Reserve — it shows live availability right on our Google listing.
            </p>
            <ul className="text-sm text-muted space-y-2 mb-8">
              {hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6">
                  <span className="shrink-0">{h.day}</span>
                  <span className="text-right">
                    {h.services.map((s) => (
                      <span key={s.name} className="block whitespace-nowrap">
                        {formatWindow(s)}
                      </span>
                    ))}
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

        <Reveal as="section" delay={120} className="group overflow-hidden flex flex-col bg-surface">
          <div className="relative aspect-[16/10] overflow-hidden">
            <EditorialImage
              src={photo("4.jpg")}
              alt="A table set with wine and appetizers"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              hoverZoom
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-10 flex-1 flex flex-col">
            <h2 className="text-2xl sm:text-3xl mb-3">Sunday Buffet</h2>
            <p className="text-muted mb-6 leading-relaxed">
              Sundays, noon to 3 PM. All you can eat from our full spread. A card hold secures your
              spot.
            </p>
            <div className="mt-auto">
              <Button href={restaurant.links.buffetReservation} external variant="primary">
                Reserve the Buffet
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 pb-24 text-center">
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
