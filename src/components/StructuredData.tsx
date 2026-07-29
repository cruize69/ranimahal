import { restaurant } from "@/content/restaurant";
import { photo } from "@/content/images";

// Schema.org Restaurant structured data — validate at
// https://search.google.com/test/rich-results after filling in the TODOs
// in src/content/restaurant.ts (geo coordinates, real ordering/reserve URLs).
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
    openingHoursSpecification: restaurant.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    })),
    menu: `${restaurant.url}/menu`,
    acceptsReservations: true,
    sameAs: [restaurant.social.instagram, restaurant.social.facebook].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
