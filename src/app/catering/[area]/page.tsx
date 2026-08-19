import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CateringPackagesGrid } from "@/components/CateringPackagesGrid";
import { CateringQuoteForm } from "@/components/CateringQuoteForm";
import { CateringOrderStatusBanner } from "@/components/CateringOrderStatusBanner";
import { BreadcrumbStructuredData, CateringStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { getCateringPackages } from "@/lib/cateringPackages";
import { heroFlame } from "@/content/media";
import { areasServed, areaSlug, type AreaServed } from "@/content/areasServed";
import { cateringEventTypes, findCateringEventType } from "@/content/cateringEventTypes";

// One real, unique page per town we actually serve (see areasServed.ts —
// each `note` is verified relative geography, not invented). Mamaroneck
// itself is excluded: that's the home base and already IS /catering, so a
// separate /catering/mamaroneck page would just be duplicate content.
const AREAS = areasServed.filter((a) => a.name !== restaurant.address.city);

function findArea(slug: string): AreaServed | undefined {
  return AREAS.find((a) => areaSlug(a.name) === slug);
}

// This single [area] dynamic segment resolves TWO distinct content types —
// geography pages (/catering/rye) and event-type pages
// (/catering/weddings) — rather than a second sibling dynamic route, which
// Next.js's App Router doesn't allow at the same path depth (two dynamic
// segments at one level must share a param name). cateringEventTypes.ts's
// slugs are deliberately disjoint from every areaSlug() output so a lookup
// can never match both.
export function generateStaticParams() {
  return [
    ...AREAS.map((a) => ({ area: areaSlug(a.name) })),
    ...cateringEventTypes.map((e) => ({ area: e.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;

  const eventType = findCateringEventType(slug);
  if (eventType) {
    const description = `Real ${eventType.name.toLowerCase()} packages & pricing from ${restaurant.name} — Essentials, Signature & Rani Feast, priced per person with free Westchester delivery.`;
    return {
      title: eventType.headline,
      description,
      alternates: { canonical: `/catering/${slug}` },
      openGraph: {
        title: `${eventType.headline} — ${restaurant.name}`,
        description,
        url: `/catering/${slug}`,
        images: [{ url: "/catering/signature.jpg", width: 1376, height: 768 }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${eventType.headline} — ${restaurant.name}`,
        description,
        images: ["/catering/signature.jpg"],
      },
    };
  }

  const area = findArea(slug);
  if (!area) return {};

  const title = `Indian Catering in ${area.name}, ${area.state}`;
  const description = `Real catering packages & pricing from ${restaurant.name}, serving ${area.name} — Essentials, Signature & Rani Feast, priced per person with free delivery.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/catering/${slug}`,
    },
    openGraph: {
      title: `${title} — ${restaurant.name}`,
      description,
      url: `/catering/${slug}`,
      images: [{ url: "/catering/signature.jpg", width: 1376, height: 768 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${restaurant.name}`,
      description,
      images: ["/catering/signature.jpg"],
    },
  };
}

export default async function CateringDynamicPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;

  const eventType = findCateringEventType(slug);
  if (eventType) {
    return <CateringEventTypeContent slug={slug} eventType={eventType} />;
  }

  const area = findArea(slug);
  if (!area) notFound();

  return <CateringAreaContent slug={slug} area={area} />;
}

async function CateringAreaContent({ slug, area }: { slug: string; area: AreaServed }) {
  const data = await getCateringPackages();
  const otherAreas = AREAS.filter((a) => a.name !== area.name);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Catering", url: `${restaurant.url}/catering` },
          { name: area.name, url: `${restaurant.url}/catering/${slug}` },
        ]}
      />
      <CateringStructuredData data={data} area={area} />
      <PageHeader
        eyebrow="Catering"
        title={`Indian Catering in ${area.name}, ${area.state}`}
        lead={`Real packages, real pricing, delivered to ${area.name} — Diwali parties, weddings, corporate lunches, graduations. Pick a package, set your headcount, and check out below. Free delivery included.`}
        video={{ src: heroFlame.src, poster: heroFlame.poster }}
      >
        <p className="mt-5 text-sm text-muted">
          Planning 100+ guests or need something the packages don&apos;t cover?{" "}
          <a href="#quote-form" className="font-semibold text-saffron link-underline">
            Request a custom quote →
          </a>
        </p>
      </PageHeader>
      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <Suspense fallback={null}>
          <CateringOrderStatusBanner />
        </Suspense>
        <p className="mx-auto mb-4 max-w-2xl text-center text-muted leading-relaxed">
          {restaurant.name} is based at {restaurant.address.street} in {restaurant.address.city}, NY —{" "}
          {area.note.charAt(0).toLowerCase() + area.note.slice(1)} We cater {area.name} directly from the
          same kitchen that fires our dine-in tandoor: real clay-oven tandoori, curries simmered for hours,
          and breads made to order, not reheated trays. All meat is 100% halal.
        </p>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted leading-relaxed">
          {area.context} In {area.name}, our packages are a regular fit for {area.popularFor}.
        </p>

        <h2 className="sr-only">Choose your catering package</h2>
        <CateringPackagesGrid data={data} />

        <div id="quote-form" className="mx-auto mt-16 max-w-xl scroll-mt-24">
          <p className="mb-1 text-center font-display text-2xl font-bold text-bone">Need something custom?</p>
          <p className="mb-6 text-center text-sm text-muted">
            Planning something bigger than these packages cover, or want a fully custom menu for your{" "}
            {area.name} event? Tell us about it and we&apos;ll follow up within one business day.
          </p>
          <CateringQuoteForm packages={data.packages} />
          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            Prefer to talk it through? Call{" "}
            <a href={`tel:${restaurant.phone}`} className="font-semibold text-saffron">
              {restaurant.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            We also cater nearby
          </p>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
            {otherAreas.map((a, i) => (
              <span key={a.name}>
                <Link href={`/catering/${areaSlug(a.name)}`} className="text-saffron hover:underline">
                  {a.name}, {a.state}
                </Link>
                {i < otherAreas.length - 1 && <span className="text-muted">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

async function CateringEventTypeContent({
  slug,
  eventType,
}: {
  slug: string;
  eventType: (typeof cateringEventTypes)[number];
}) {
  const data = await getCateringPackages();
  const otherEventTypes = cateringEventTypes.filter((e) => e.slug !== slug);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Catering", url: `${restaurant.url}/catering` },
          { name: eventType.name, url: `${restaurant.url}/catering/${slug}` },
        ]}
      />
      <CateringStructuredData data={data} eventType={{ slug: eventType.slug, name: eventType.name }} />
      <PageHeader
        eyebrow="Catering"
        title={eventType.headline}
        lead={eventType.lead}
        video={{ src: heroFlame.src, poster: heroFlame.poster }}
      >
        <p className="mt-5 text-sm text-muted">
          Planning 100+ guests or need something the packages don&apos;t cover?{" "}
          <a href="#quote-form" className="font-semibold text-saffron link-underline">
            Request a custom quote →
          </a>
        </p>
      </PageHeader>
      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <Suspense fallback={null}>
          <CateringOrderStatusBanner />
        </Suspense>
        <p className="mx-auto mb-4 max-w-2xl text-center text-muted leading-relaxed">{eventType.paragraph1}</p>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted leading-relaxed">{eventType.paragraph2}</p>

        <h2 className="sr-only">Choose your catering package</h2>
        <CateringPackagesGrid data={data} />

        <div id="quote-form" className="mx-auto mt-16 max-w-xl scroll-mt-24">
          <p className="mb-1 text-center font-display text-2xl font-bold text-bone">Need something custom?</p>
          <p className="mb-6 text-center text-sm text-muted">
            Planning something bigger than these packages cover, or want a fully custom menu for your{" "}
            {eventType.name.toLowerCase()}? Tell us about it and we&apos;ll follow up within one business day.
          </p>
          <CateringQuoteForm packages={data.packages} />
          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            Prefer to talk it through? Call{" "}
            <a href={`tel:${restaurant.phone}`} className="font-semibold text-saffron">
              {restaurant.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Catering for other occasions
          </p>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
            {otherEventTypes.map((e, i) => (
              <span key={e.slug}>
                <Link href={`/catering/${e.slug}`} className="text-saffron hover:underline">
                  {e.name}
                </Link>
                {i < otherEventTypes.length - 1 && <span className="text-muted">·</span>}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm">
            Or find catering{" "}
            <Link href="/areas-we-serve" className="text-saffron hover:underline">
              near you
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
