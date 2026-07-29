import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { MenuSectionNav } from "@/components/MenuSectionNav";
import { MenuList } from "@/components/MenuList";
import { menu, allMenuItems } from "@/content/menu";
import { restaurant } from "@/content/restaurant";
import { photo } from "@/content/images";

export const metadata: Metadata = {
  title: "Menu",
  description: `All ${allMenuItems.length} dishes at ${restaurant.name} — tandoori specialties, curries, biryani, breads, and desserts. Order pickup or delivery online.`,
  openGraph: {
    images: [{ url: "/images/og-menu.png", width: 1200, height: 630 }],
  },
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Menu"
        title="Every dish, made to order"
        lead={`${allMenuItems.length} dishes across ${menu.length} sections. Whole spices ground in-house, sauces simmered for hours, breads fired to order.`}
        image={{ src: photo("27.JPG"), alt: "Saag at Rani Mahal" }}
      >
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
            Order Online
          </Button>
          <Button href="/reservations" variant="secondary" size="lg">
            Reserve a Table
          </Button>
        </div>
      </PageHeader>

      <MenuSectionNav />
      <MenuList />
    </>
  );
}
