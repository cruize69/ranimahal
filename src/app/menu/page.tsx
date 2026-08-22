import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { MenuSectionNav } from "@/components/MenuSectionNav";
import { MenuList } from "@/components/MenuList";
import { getMenu } from "@/content/menu";
import { restaurant } from "@/content/restaurant";
import { orderUrl } from "@/lib/orderUrl";
import { menuHero } from "@/content/media";
import { BreadcrumbStructuredData, MenuStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Menu",
  description: `The full Indian restaurant menu at ${restaurant.name} in ${restaurant.address.city}, NY — tandoori specialties, curries, biryani, and breads, fetched live from our ordering system. Order pickup or delivery online.`,
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    url: "/menu",
    images: [{ url: "/images/og-menu.jpg", width: 1200, height: 630 }],
  },
};

export default async function MenuPage() {
  const { sections, itemCount } = await getMenu();

  return (
    <>
      <MenuStructuredData menu={sections} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Menu", url: `${restaurant.url}/menu` },
        ]}
      />
      <PageHeader
        eyebrow="The Menu"
        title="Every dish, made to order"
        lead={`${itemCount} dishes across ${sections.length} sections. Whole spices ground in-house, sauces simmered for hours, breads fired to order — 100% halal meat.`}
        image={{ src: menuHero.src, alt: menuHero.alt }}
      >
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Button href={orderUrl("menu_page_top_cta")} external variant="primary" size="lg">
            Order Online
          </Button>
          <Button href="/reservations" variant="secondary" size="lg">
            Reserve a Table
          </Button>
        </div>
      </PageHeader>

      <MenuSectionNav menu={sections} />
      <MenuList menu={sections} />

      {/* Family Meals — this site's generic per-section rendering can't show
          the ordering app's bundle cards (see content/menu.ts's getMenu(),
          which drops that section entirely rather than rendering it empty),
          so this closing CTA is the real link into it instead of a dead
          section at the top of the page. */}
      <Reveal
        as="section"
        className="mx-auto max-w-[90rem] px-5 sm:px-10 py-20 sm:py-28 text-center border-t border-line"
      >
        <p className="eyebrow mb-4">Feeding the family?</p>
        <h2 className="text-3xl sm:text-5xl mb-6">Two dinner bundles, one flat price</h2>
        <p className="text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          The Family Meal and The Group Meal — real dishes, no headcount minimum, ready for pickup or
          free delivery in about 25 minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/family-meals" variant="primary" size="lg">
            See Family Meals
          </Button>
        </div>
      </Reveal>

      {/* Catering — closes the page with a CTA for anyone planning something
          bigger than a table for two, rather than ending abruptly after the
          last dish. */}
      <Reveal
        as="section"
        className="mx-auto max-w-[90rem] px-5 sm:px-10 py-20 sm:py-28 text-center border-t border-line"
      >
        <p className="eyebrow mb-4">Feeding a crowd?</p>
        <h2 className="text-3xl sm:text-5xl mb-6">Catering for your next event</h2>
        <p className="text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Trays of our tandoori classics, curries, and biryani for parties, office lunches, and
          celebrations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/catering" variant="primary" size="lg">
            View Catering Menu
          </Button>
          <a href={`tel:${restaurant.phone}`} className="link-underline text-saffron">
            Or call {restaurant.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </>
  );
}
