import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FamilyMealsGrid } from "@/components/FamilyMealsGrid";
import { BreadcrumbStructuredData, FamilyMealsStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import { getFeasts } from "@/lib/feasts";
import { familyMealsHero } from "@/content/media";

export const metadata: Metadata = {
  title: `Family Meals in ${restaurant.address.city} & Westchester, NY`,
  description: `The Family Meal and The Group Meal from ${restaurant.name} — real dishes bundled at one flat price, no headcount minimum, ready for pickup or free delivery in about 25 minutes.`,
  alternates: {
    canonical: "/family-meals",
  },
  openGraph: {
    title: `Family Meals in ${restaurant.address.city} & Westchester, NY — ${restaurant.name}`,
    description: `Real Indian dinner bundles from ${restaurant.name} — one flat price, no headcount minimum, ready in about 25 minutes.`,
    url: "/family-meals",
    images: [{ url: "/feasts/family-feast.jpg", width: 1600, height: 893 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Family Meals in ${restaurant.address.city} & Westchester, NY — ${restaurant.name}`,
    description: `Real Indian dinner bundles from ${restaurant.name} — one flat price, no headcount minimum, ready in about 25 minutes.`,
    images: ["/feasts/family-feast.jpg"],
  },
};

// Bundle data (names/prices/items) comes from the same live source
// api/feasts.js serves (ranimahal-backend's lib/feasts.js) — real numbers,
// never hand-copied, so this page can't drift from what checkout actually
// charges. "Order Now" links straight into the ordering app with the exact
// bundle pre-added to cart (see lib/feasts.ts's feastAddParam) — no
// separate checkout flow lives on this site, unlike /catering, since these
// are simple flat-price retail items rather than a per-person booking.
export default async function FamilyMealsPage() {
  const feasts = await getFeasts();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Family Meals", url: `${restaurant.url}/family-meals` },
        ]}
      />
      <FamilyMealsStructuredData feasts={feasts} />
      <PageHeader
        eyebrow="Family Meals"
        title={`Family Meals in ${restaurant.address.city} & Westchester, NY`}
        lead="Two ready-made dinner bundles, priced flat with no headcount minimum — pick one, order online, and it's ready for pickup or free delivery in about 25 minutes."
        video={{ src: familyMealsHero.src, poster: familyMealsHero.poster }}
      >
        <p className="mt-5 text-sm text-muted">
          Feeding 20 or more, or planning an event?{" "}
          <Link href="/catering" className="font-semibold text-saffron link-underline">
            See our catering packages →
          </Link>
        </p>
      </PageHeader>

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <h2 className="sr-only">Choose a Family Meal</h2>
        <FamilyMealsGrid feasts={feasts} />

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <p className="mb-4 font-display text-2xl font-bold text-bone">Not a catering order — just dinner</p>
          <p className="text-sm leading-relaxed text-muted">
            The Family Meal and The Group Meal are ordinary online orders, not event catering: no quote, no
            headcount minimum, no advance notice required. Order any night we&apos;re open and it&apos;s ready in
            about 25 minutes for pickup, or delivered free anywhere in our Westchester delivery area. Planning a
            wedding, office party, or 20+ guest event instead?{" "}
            <Link href="/catering" className="font-semibold text-saffron link-underline">
              Our catering packages
            </Link>{" "}
            — Essentials, Signature, and Rani Feast — are built for that.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#120E0B]/70 p-5 text-center">
            <span className="text-saffron text-base">⏱️</span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-bone">Ready in ~25 Minutes</p>
            <p className="mt-1 text-[11px] text-muted">No advance notice needed — order tonight, eat tonight</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#120E0B]/70 p-5 text-center">
            <span className="text-saffron text-base">🚚</span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-bone">Free Delivery</p>
            <p className="mt-1 text-[11px] text-muted">Always free on both bundles, anywhere in our delivery area</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#120E0B]/70 p-5 text-center">
            <span className="text-saffron text-base">🍚</span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-bone">Rice Included</p>
            <p className="mt-1 text-[11px] text-muted">Every entree comes with basmati rice — nothing extra to add</p>
          </div>
        </div>
      </div>
    </>
  );
}
