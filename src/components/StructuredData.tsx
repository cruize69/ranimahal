import { restaurant } from "@/content/restaurant";
import { photo } from "@/content/images";
import type { MenuSection } from "@/content/menu";
import { areasServed, type AreaServed } from "@/content/areasServed";
import type { FaqItem } from "@/content/faq";
import type { BlogPost } from "@/lib/blog";
import type { CateringData } from "@/lib/cateringPackages";
import type { Feast } from "@/lib/feasts";

// Shared by every structured-data block below — keeps each one a plain
// script tag with no visible output.
//
// JSON.stringify does NOT escape "<", ">", or "/" — a string value
// containing "</script><script>...")" closes this tag early and starts
// executing arbitrary script on the page. MenuStructuredData's item
// name/description come from the ordering app's live /api/menu response,
// not static content the developer controls, so this isn't a theoretical
// concern for that call site. Escaping those three characters as unicode
// escapes is the standard fix (used by, e.g., Next.js's own docs for this
// exact pattern) — it's valid inside a JSON string and inert as HTML.
function JsonLd({ data }: { data: unknown }) {
  const safe = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\//g, "\\u002f");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

// Schema.org Restaurant structured data — validate at
// https://search.google.com/test/rich-results. Geo coordinates and the
// online-ordering URL are real.
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
    logo: `${restaurant.url}/logo/apsara-logo.png`,
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
    hasMap: restaurant.links.googleMapsPlace,
    paymentAccepted: "Credit Card, Debit Card, Cash",
    currenciesAccepted: "USD",
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
      // No ReserveAction: regular dine-in reservations are phone-only (no
      // automatable booking flow exists), and ReserveAction implies exactly
      // that kind of automated system — a fake one is worse than none.
      // The Sunday buffet *does* have a real booking page but it's a single
      // recurring event, not a general table-reservation system, so it
      // isn't a good fit for this business-wide action either.
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
          ...(item.image ? { image: item.image } : {}),
          ...(item.tags?.includes("veg")
            ? { suitableForDiet: "https://schema.org/VegetarianDiet" }
            : {}),
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

// BlogPosting schema for a single /blog/[slug] post. Mirrors the Article
// fields Google's rich-results test and AI answer engines expect —
// headline, image, dates, author/publisher as the restaurant itself (no
// separate "blog author" persona exists), and mainEntityOfPage pointing
// back at the canonical post URL.
export function BlogPostingStructuredData({ post }: { post: BlogPost }) {
  const url = `${restaurant.url}/blog/${post.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: [post.frontmatter.heroImage],
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Organization",
      name: restaurant.name,
      url: restaurant.url,
    },
    publisher: {
      "@type": "Organization",
      name: restaurant.name,
      logo: {
        "@type": "ImageObject",
        url: `${restaurant.url}/logo/apsara-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: post.frontmatter.tags,
  };

  return <JsonLd data={data} />;
}

// Service + OfferCatalog schema for the catering packages, mounted on
// /catering and /catering/[area]. Prices/minimums come from the same live
// `data` the page itself renders (getCateringPackages()), so this can't
// drift from what checkout actually charges the way hand-typed structured
// data would. When `area` is passed, areaServed narrows to that one city
// (giving each /catering/[area] page its own distinct local-service
// signal instead of just inheriting the sitewide list via breadcrumbs).
export function CateringStructuredData({
  data,
  area,
  eventType,
}: {
  data: CateringData;
  area?: AreaServed;
  // For an event-type page (weddings, corporate-catering, etc.) rather than
  // a geography page — overrides serviceType/name/url, areaServed stays the
  // full sitewide list (an event type isn't tied to one city the way an
  // area page is).
  eventType?: { slug: string; name: string };
}) {
  const url = eventType
    ? `${restaurant.url}/catering/${eventType.slug}`
    : area
      ? `${restaurant.url}/catering/${area.name.toLowerCase().replace(/\s+/g, "-")}`
      : `${restaurant.url}/catering`;

  const areaServedSchema = area
    ? {
        "@type": "City",
        name: area.name,
        containedInPlace: {
          "@type": "State",
          name: area.state === "NY" ? "New York" : "Connecticut",
        },
      }
    : areasServed.map((a) => ({
        "@type": "City",
        name: a.name,
        containedInPlace: {
          "@type": "State",
          name: a.state === "NY" ? "New York" : "Connecticut",
        },
      }));

  const data_ = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: eventType ? eventType.name : "Catering",
    name: eventType ? `${restaurant.name} ${eventType.name}` : `${restaurant.name} Catering`,
    url,
    provider: {
      "@type": "Restaurant",
      name: restaurant.name,
      url: restaurant.url,
      telephone: restaurant.phone,
    },
    areaServed: areaServedSchema,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catering Packages",
      itemListElement: data.packages.flatMap((pkg) =>
        pkg.tiers.map((tier) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: tier.label ? `${pkg.name} — ${tier.label}` : pkg.name,
            description: pkg.blurb,
            ...(pkg.photo ? { image: `${restaurant.url}${pkg.photo}` } : {}),
          },
          price: tier.price.toFixed(2),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: tier.price.toFixed(2),
            priceCurrency: "USD",
            unitText: "per guest",
          },
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            minValue: tier.minimum,
            unitText: "guests",
          },
        }))
      ),
    },
  };

  return <JsonLd data={data_} />;
}

// Product/Offer structured data for the two Family Meal / Group Meal
// bundles — deliberately Product+Offer, not the Service+OfferCatalog shape
// CateringStructuredData uses above: these are flat-price retail bundles a
// customer buys outright online (no headcount, no quote, no minimum), not
// a per-person service booked ahead. Keeping the schema types distinct
// mirrors the actual product difference and avoids Google treating this
// page as another instance of the catering "Rani Feast" tier — the exact
// confusion the underlying naming/positioning was changed to avoid.
export function FamilyMealsStructuredData({ feasts }: { feasts: Feast[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: feasts.map((feast, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${restaurant.name} ${feast.name}`,
        description: `${feast.name} — a complete Indian dinner for ${feast.feeds} people, delivered free or ready for pickup in about 25 minutes. No headcount minimum.`,
        image: `${restaurant.url}${feast.heroImage}`,
        brand: { "@type": "Brand", name: restaurant.name },
        offers: {
          "@type": "Offer",
          price: feast.price.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${restaurant.url}/family-meals`,
          seller: { "@type": "Restaurant", name: restaurant.name, url: restaurant.url },
        },
      },
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
