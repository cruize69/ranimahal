import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { reservationsHero, reservationsTablesPanel, reservationsBuffetPanel } from "@/content/media";
import { orderedHours, formatWindow } from "@/lib/hours";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Reservations",
  description: `Reserve a table at ${restaurant.name}, an Indian restaurant in ${restaurant.address.city}, NY, or book the Sunday all-you-can-eat buffet.`,
  alternates: {
    canonical: "/reservations",
  },
};

export default function ReservationsPage() {
  const hours = orderedHours();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Reservations", url: `${restaurant.url}/reservations` },
        ]}
      />
      <PageHeader
        eyebrow="Reservations"
        title="Reserve your table"
        lead="Book ahead for dinner, or secure a spot at the Sunday buffet."
        image={{ src: reservationsHero.src, alt: reservationsHero.alt }}
      />

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24 grid gap-8 lg:grid-cols-2">
        <Reveal as="section" className="group overflow-hidden flex flex-col bg-surface">
          <div className="relative aspect-[16/10] overflow-hidden">
            <EditorialImage
              src={reservationsTablesPanel.src}
              alt={reservationsTablesPanel.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              hoverZoom
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-10 flex-1 flex flex-col">
            <h2 className="text-2xl sm:text-3xl mb-3">Lunch &amp; Dinner</h2>
            <p className="text-muted mb-6 leading-relaxed">
              Give us a call and we&apos;ll have your table ready.
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
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center justify-center gap-2 font-medium rounded-full whitespace-nowrap transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 bg-saffron text-ink hover:bg-saffron-deep hover:shadow-lg hover:shadow-saffron/20 px-6 py-3 text-sm"
              >
                Call to Reserve — {restaurant.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" delay={120} className="group overflow-hidden flex flex-col bg-surface">
          <div className="relative aspect-[16/10] overflow-hidden">
            <EditorialImage
              src={reservationsBuffetPanel.src}
              alt={reservationsBuffetPanel.alt}
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
