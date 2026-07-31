import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { restaurant } from "@/content/restaurant";
import { areasServed } from "@/content/areasServed";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Areas We Serve",
  description: `Best Indian food near ${restaurant.address.city}, NY — ${restaurant.name} serves Mamaroneck, Larchmont, Rye, New Rochelle, Scarsdale, White Plains, and nearby Westchester communities with pickup, delivery, and catering.`,
  alternates: {
    canonical: "/areas-we-serve",
  },
};

export default function AreasWeServePage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Areas We Serve", url: `${restaurant.url}/areas-we-serve` },
        ]}
      />
      <PageHeader
        eyebrow="Where to find us"
        title="Best Indian food near you"
        lead={`${restaurant.name} is on Mamaroneck Ave, at the heart of southern Westchester County — a short drive or delivery order away from all of these communities.`}
      />

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areasServed.map((area, i) => (
            <Reveal
              key={area.name}
              delay={i * 40}
              as="section"
              className="border border-line p-6 sm:p-8 hover:border-saffron transition-colors duration-300"
            >
              <h2 className="text-xl sm:text-2xl mb-2">
                Best Indian Food in {area.name}, {area.state}
              </h2>
              <p className="text-muted text-sm leading-relaxed">{area.note}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-muted leading-relaxed mb-8">
            Wherever you&rsquo;re calling in from, order pickup or delivery online, or{" "}
            <Link href="/reservations" className="link-underline text-saffron">
              reserve a table
            </Link>{" "}
            for dine-in. Not sure we deliver to you? Call{" "}
            <a href={`tel:${restaurant.phone}`} className="link-underline text-saffron">
              {restaurant.phoneDisplay}
            </a>{" "}
            and ask.
          </p>
          <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
            Order Online
          </Button>
        </Reveal>
      </div>
    </>
  );
}
