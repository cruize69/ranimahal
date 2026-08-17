import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CateringPackagesGrid } from "@/components/CateringPackagesGrid";
import { CateringQuoteForm } from "@/components/CateringQuoteForm";
import { CateringOrderStatusBanner } from "@/components/CateringOrderStatusBanner";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { getCateringPackages } from "@/lib/cateringPackages";
import { heroFlame } from "@/content/media";
import Link from "next/link";
import { areasServed, areaSlug } from "@/content/areasServed";

export const metadata: Metadata = {
  title: `Indian Catering in ${restaurant.address.city} & Westchester, NY`,
  description: `Real catering packages and pricing from ${restaurant.name} — Essentials, Signature, and Rani Feast, priced per person. Pick a package, set your headcount, and check out online.`,
  alternates: {
    canonical: "/catering",
  },
  openGraph: {
    title: `Indian Catering in ${restaurant.address.city} & Westchester, NY — ${restaurant.name}`,
    description: `Real catering packages and pricing from ${restaurant.name} — Essentials, Signature, and Rani Feast, priced per person.`,
    url: "/catering",
    images: [{ url: "/videos/tandoor-oven-burning-poster.jpg", width: 1200, height: 630 }],
  },
};

// Packages/pricing come from the same live source api/catering-packages.js
// serves (lib/menu.js's CATERING_PACKAGES) — real numbers, never hand-
// copied, so this page can't drift from what checkout actually charges.
// "Add to Order" opens CateringCheckoutModal right here on this page — no
// redirect into the full retail ordering app (see that component for why).
// The only navigation in the whole flow is the final payment step, which
// goes straight to Stripe's own hosted checkout page.
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
        title={`Indian Catering in ${restaurant.address.city} & Westchester, NY`}
        lead="Real packages, real pricing — Diwali parties, weddings, corporate lunches, graduations. Pick a package, set your headcount, and check out below. Free delivery included."
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
        <h2 className="sr-only">Choose your catering package</h2>
        <CateringPackagesGrid data={data} />

        <div id="quote-form" className="mx-auto mt-16 max-w-xl scroll-mt-24">
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

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            We also cater
          </p>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
            {areasServed
              .filter((a) => a.name !== restaurant.address.city)
              .map((a, i, arr) => (
                <span key={a.name}>
                  <Link href={`/catering/${areaSlug(a.name)}`} className="text-saffron hover:underline">
                    {a.name}, {a.state}
                  </Link>
                  {i < arr.length - 1 && <span className="text-muted">·</span>}
                </span>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
