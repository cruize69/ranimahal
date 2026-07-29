import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { MenuSectionNav } from "@/components/MenuSectionNav";
import { Reveal } from "@/components/Reveal";
import { menu } from "@/content/menu";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Menu",
  description: `Explore ${restaurant.name}'s full menu — tandoori specialties, curries, biryani, breads, and desserts. Order pickup or delivery online.`,
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
      <PageHeader
        eyebrow="The Menu"
        title="Every dish, made to order"
        lead="Whole spices ground in-house, sauces simmered for hours, breads fired to order. Available for pickup and delivery."
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

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-20 space-y-20 sm:space-y-24">
        {menu.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-36">
            <Reveal className="relative aspect-21/9 sm:aspect-3/1 overflow-hidden rounded-xl mb-8 group">
              <Image
                src={section.image.src}
                alt={section.image.alt}
                fill
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <h2 className="text-2xl sm:text-4xl">{section.name}</h2>
                {section.description && (
                  <p className="text-muted mt-1.5 max-w-lg text-sm sm:text-base">
                    {section.description}
                  </p>
                )}
              </div>
            </Reveal>

            <ul className="divide-y divide-line">
              {section.items.map((item) => (
                <li
                  key={item.name}
                  className="group py-5 flex items-start justify-between gap-6 transition-colors duration-300 hover:bg-surface/60 -mx-3 px-3 rounded-lg"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display text-lg group-hover:text-saffron transition-colors duration-300">
                        {item.name}
                      </h3>
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-wider text-saffron border border-saffron/40 rounded-full px-2 py-0.5"
                        >
                          {TAG_LABELS[tag]}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-display text-lg">${item.price}</span>
                    <a
                      href={restaurant.links.orderOnline}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-xs text-saffron"
                    >
                      Add
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
