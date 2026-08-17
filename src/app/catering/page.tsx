import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { CateringPackagesGrid } from "@/components/CateringPackagesGrid";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { getCateringPackages } from "@/lib/cateringPackages";

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
      />
      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <CateringPackagesGrid data={data} />

        <div className="mx-auto mt-14 max-w-xl text-center">
          <p className="mb-4 text-sm text-muted">
            Need something custom, or planning something bigger than these packages cover?
          </p>
          <Button href={`${restaurant.links.catering}`} external variant="secondary" size="md">
            Request a Custom Quote →
          </Button>
        </div>
      </div>
    </>
  );
}
