import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CateringPackagesGrid } from "@/components/CateringPackagesGrid";
import { CateringQuoteForm } from "@/components/CateringQuoteForm";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { getCateringPackages } from "@/lib/cateringPackages";
import { heroFlame } from "@/content/media";
import { areasServed, areaSlug, type AreaServed } from "@/content/areasServed";

// One real, unique page per town we actually serve (see areasServed.ts —
// each `note` is verified relative geography, not invented). Mamaroneck
// itself is excluded: that's the home base and already IS /catering, so a
// separate /catering/mamaroneck page would just be duplicate content.
const AREAS = areasServed.filter((a) => a.name !== restaurant.address.city);

function findArea(slug: string): AreaServed | undefined {
  return AREAS.find((a) => areaSlug(a.name) === slug);
}

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: areaSlug(a.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = findArea(slug);
  if (!area) return {};

  const title = `Indian Catering in ${area.name}, ${area.state}`;
  const description = `Real catering packages and pricing from ${restaurant.name}, serving ${area.name}, ${area.state} from our kitchen in ${restaurant.address.city} — Essentials, Signature, and Rani Feast, priced per person with free delivery.`;

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
      images: [{ url: "/videos/tandoor-oven-burning-poster.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function CateringAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();

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
      <PageHeader
        eyebrow="Catering"
        title={`Indian Catering in ${area.name}, ${area.state}`}
        lead={`Real packages, real pricing, delivered to ${area.name} — Diwali parties, weddings, corporate lunches, graduations. Pick a package, set your headcount, and check out below. Free delivery included.`}
        video={{ src: heroFlame.src, poster: heroFlame.poster }}
      />
      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted leading-relaxed">
          {restaurant.name} is based at {restaurant.address.street} in {restaurant.address.city}, NY —{" "}
          {area.note.charAt(0).toLowerCase() + area.note.slice(1)} We cater {area.name} directly from the
          same kitchen that fires our dine-in tandoor: real clay-oven tandoori, curries simmered for hours,
          and breads made to order, not reheated trays. All meat is 100% halal.
        </p>

        <h2 className="sr-only">Choose your catering package</h2>
        <CateringPackagesGrid data={data} />

        <div className="mx-auto mt-16 max-w-xl">
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
