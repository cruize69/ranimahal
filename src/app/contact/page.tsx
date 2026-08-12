import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { EditorialImage } from "@/components/EditorialImage";
import { HoursList } from "@/components/HoursList";
import { OpenStatus } from "@/components/OpenStatus";
import { PhotoHero } from "@/components/PhotoHero";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { orderUrl } from "@/lib/orderUrl";
import { contactHero, contactDiningBanner } from "@/content/media";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Visit",
  description: `Find ${restaurant.name}, an Indian restaurant at ${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} — hours, directions, and contact info.`,
  alternates: {
    canonical: "/contact",
  },
};

const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`;

export default function ContactPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Visit", url: `${restaurant.url}/contact` },
        ]}
      />
      <PhotoHero
        src={contactHero.src}
        alt={`${restaurant.name} at ${restaurant.address.street}`}
        overlay="bottom"
        priority
        minHeight="min-h-[55svh]"
      >
        <div>
          <p className="eyebrow mb-4">Visit Us</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl">Find us on the Avenue</h1>
        </div>
      </PhotoHero>

      <div className="grid lg:grid-cols-2">
        <Reveal className="px-8 sm:px-14 lg:px-16 py-14 sm:py-20">
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
          <HoursList className="space-y-1.5 text-muted max-w-xs" />

          <div className="flex flex-wrap gap-3 mt-10">
            <Button href={orderUrl("contact_page_cta")} external variant="primary">
              Order Online
            </Button>
            <Button href="/reservations" variant="secondary">
              Reserve a Table
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative min-h-80 lg:min-h-full">
          <iframe
            title={`Map to ${restaurant.name}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
            className="absolute inset-0 w-full h-full min-h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>

      {/* Wide interior photo below contact details */}
      <section className="relative h-[40svh] min-h-64 overflow-hidden">
        <EditorialImage
          src={contactDiningBanner.src}
          alt={contactDiningBanner.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>
    </>
  );
}
