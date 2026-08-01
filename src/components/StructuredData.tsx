import { restaurant } from "@/content/restaurant";
import { photo } from "@/content/images";
import type { MenuSection } from "@/content/menu";
import { areasServed } from "@/content/areasServed";
import type { FaqItem } from "@/content/faq";

// Shared by every structured-data block below — keeps each one a plain
// script tag with no visible output.
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Schema.org Restaurant structured data — validate at
// https://search.google.com/test/rich-results. Geo coordinates and the
// online-ordering URL are real; restaurant.links.googleReserve and
// buffetReservation are still the TODO placeholders noted in restaurant.ts —
// ReserveAction below intentionally points at the same link the live
// Reservations page already uses, so fixing that TODO updates both at once
// instead of the schema silently disagreeing with the page.
export function RestaurantStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    url: restaurant.url,
    telephone: restaurant.phone,
    priceRange: restaurant.priceRange,
    servesCuisine: restaurant.cuisine,
    logo: `${restaurant.url}/logo/apsara-square.png`,
    image: [photo("25.JPG"), photo("29.JPG"), photo("24.JPG")],
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.city,
      addressRegion: restaurant.address.state,
      postalCode: restaurant.address.zip,
      addressCountry: restaurant.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.geo.latitude,
      longitude: restaurant.geo.longitude,
    },
    openingHoursSpecification: restaurant.hours.flatMap((h) =>
      h.services.map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${h.day}`,
        opens: s.opens,
        closes: s.closes,
      }))
    ),
    menu: `${restaurant.url}/menu`,
    acceptsReservations: true,
    sameAs: [restaurant.social.instagram, restaurant.social.facebook].filter(Boolean),
    // additionalProperty is schema.org's standard escape hatch for a real
    // business fact (confirmed by the restaurant) that doesn't have its own
    // dedicated top-level property.
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Halal",
        value: "100% halal meat",
      },
    ],
    areaServed: areasServed.map((a) => ({
      "@type": "City",
      name: a.name,
      containedInPlace: {
        "@type": "State",
        name: a.state === "NY" ? "New York" : "Connecticut",
      },
    })),
    potentialAction: [
      {
        "@type": "OrderAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: restaurant.links.orderOnline,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        deliveryMethod: ["https://schema.org/OnSitePickup", "https://schema.org/DeliveryModeOwnFleet"],
      },
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: restaurant.links.googleReserve,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}

// Describes the website itself (as distinct from the business) — no
// SearchAction, since the site has no internal search endpoint to point one
// at, and a non-functional SearchAction is worse than none.
export function WebsiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: restaurant.name,
    url: restaurant.url,
    description: restaurant.description,
    inLanguage: "en-US",
  };

  return <JsonLd data={data} />;
}

// FAQPage schema. Google and AI answer engines expect this to match visible
// page copy exactly, so callers should always pass the same `faqItems` the
// page renders — see src/content/faq.ts.
export function FAQStructuredData({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// Full Menu/MenuSection/MenuItem graph, generated from the same live-fetched
// menu used to render the /menu page — so an AI engine or Google can answer
// "how much is X at Rani Mahal" from sourced data instead of guessing. Only
// mount this on the menu page itself: ~100 items of JSON-LD on every page
// would bloat every other page's HTML for no benefit.
export function MenuStructuredData({ menu }: { menu: MenuSection[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${restaurant.name} Menu`,
    url: `${restaurant.url}/menu`,
    hasMenuSection: menu.map((section) => ({
      "@type": "MenuSection",
      name: section.name,
      hasMenuItem: section.groups.flatMap((group) =>
        group.items.map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          offers: {
            "@type": "Offer",
            price: item.price.toFixed(2),
            priceCurrency: "USD",
          },
        }))
      ),
    })),
  };

  return <JsonLd data={data} />;
}

// Lightweight BreadcrumbList for subpages — pass the trail from home down to
// the current page.
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
