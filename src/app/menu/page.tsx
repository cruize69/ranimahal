import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { menu } from "@/content/menu";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Menu",
  description: `Explore ${restaurant.name}'s full menu — tandoori specialties, curries, biryani, breads, and desserts.`,
  openGraph: {
    images: [{ url: "/images/og-menu.svg", width: 1200, height: 630 }],
  },
};

const TAG_LABELS: Record<string, string> = {
  veg: "Veg",
  vegan: "Vegan",
  "gluten-free": "GF",
  spicy: "Spicy",
  "chef-pick": "Chef's Pick",
};

export default function MenuPage() {
  return (
    <>
      <PageHeader eyebrow="The Menu" title="Rani Mahal">
        <p className="text-ink/70 font-body text-lg">
          Order for pickup or delivery, or reserve a table to dine with us.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <Button href={restaurant.links.orderOnline} external variant="primary">
            Order Online
          </Button>
          <Button href="/reservations" variant="outline">
            Reserve a Table
          </Button>
        </div>
      </PageHeader>

      <nav
        aria-label="Menu sections"
        className="mx-auto max-w-5xl px-5 sm:px-8 py-8 flex flex-wrap gap-x-6 gap-y-2 justify-center font-display text-xs sm:text-sm tracking-[0.1em] uppercase text-maroon"
      >
        {menu.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="hover:underline underline-offset-4">
            {section.name}
          </a>
        ))}
      </nav>

      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-24 space-y-16">
        {menu.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="font-display text-2xl sm:text-3xl text-maroon mb-2">{section.name}</h2>
            {section.description && (
              <p className="text-ink/60 font-body italic mb-6">{section.description}</p>
            )}
            <div className="motif-divider mb-6" />
            <ul className="space-y-6">
              {section.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg">{item.name}</h3>
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-wide border border-gold text-maroon px-2 py-0.5 rounded-full"
                        >
                          {TAG_LABELS[tag]}
                        </span>
                      ))}
                    </div>
                    <p className="text-ink/70 font-body">{item.description}</p>
                  </div>
                  <div className="font-display text-lg whitespace-nowrap self-start">${item.price}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
