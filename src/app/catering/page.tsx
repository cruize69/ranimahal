import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CateringPackagesGrid } from "@/components/CateringPackagesGrid";
import { CateringQuoteForm } from "@/components/CateringQuoteForm";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { getCateringPackages } from "@/lib/cateringPackages";
import { cateringHero } from "@/content/media";

export const metadata: Metadata = {
  title: "Catering",
  description: `Real catering packages and pricing from ${restaurant.name} — Essentials, Signature, and Rani Feast, priced per person. Pick a package, set your headcount, and check out online.`,
  alternates: {
    canonical: "/catering",
  },
};

// The packages/pricing here come from the same live source the ordering
// app's own /order/catering page reads from (api/catering-packages.js —
// lib/menu.js's CATERING_PACKAGES) — real numbers, never hand-copied, so
// this page can't drift from what checkout actually charges. "Add to
// Order" on each card redirects into the ordering app's cart via the same
// ?add=<itemId>:<headcount> mechanism used everywhere else on this site.
export default async function CateringPage() {
  const data = await getCateringPackages();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Catering", url: `${restaurant.url}/catering` },
        ]}
      />
      <PageHeader
        eyebrow="Catering"
        title="Real packages, real pricing"
        lead="Diwali parties, weddings, corporate lunches, graduations — pick a package, set your headcount, and check out below. Free delivery included."
        image={{ src: cateringHero.src, alt: cateringHero.alt }}
      />
      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <CateringPackagesGrid data={data} />

        <div className="mx-auto mt-16 max-w-xl">
          <p className="mb-1 text-center font-display text-2xl font-bold text-bone">Need something custom?</p>
          <p className="mb-6 text-center text-sm text-muted">
            Planning something bigger than these packages cover, or want a fully custom menu? Tell us about it and
            we&apos;ll follow up within one business day.
          </p>
          <CateringQuoteForm packages={data.packages} />
          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            Prefer to talk it through? Call{" "}
            <a href={`tel:${restaurant.phone}`} className="font-semibold text-saffron">
              {restaurant.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
