import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
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
    </>
  );
}
