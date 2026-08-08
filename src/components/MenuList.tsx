"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { MenuSectionCarousel } from "@/components/MenuSectionCarousel";
import { Reveal } from "@/components/Reveal";
import type { MenuSection, MenuTag, MenuItem } from "@/content/menu";
import { restaurant } from "@/content/restaurant";

const TAG_LABELS: Record<MenuTag, string> = {
  veg: "Veg",
  spicy: "Spicy",
  mild: "Mild",
};

// Only offer filters that actually narrow the menu usefully.
const FILTERS: MenuTag[] = ["veg", "spicy", "mild"];

const price = (n: number) =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;

export function MenuList({ menu }: { menu: MenuSection[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<MenuTag | null>(null);
  const [selectedDish, setSelectedDish] = useState<(MenuItem & { sectionName?: string }) | null>(null);

  // Background scroll lock and Escape key listener when modal is open
  useEffect(() => {
    if (!selectedDish) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDish(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDish]);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && !tag) return menu;

    return menu
      .map((section) => ({
        ...section,
        groups: section.groups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
              const matchesTag = !tag || item.tags.includes(tag);
              const matchesQuery =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q);
              return matchesTag && matchesQuery;
            }),
          }))
          .filter((g) => g.items.length > 0),
      }))
      .filter((s) => s.groups.length > 0);
  }, [menu, query, tag]);

  const resultCount = sections.reduce(
    (a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0),
    0
  );
  const isFiltering = Boolean(query.trim() || tag);

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 sm:px-10 pt-12">
        <p className="text-sm text-muted border border-line px-4 py-3 mb-6">
          Have a dairy, nut, or other food allergy? Our menu descriptions don&rsquo;t list every
          ingredient — please ask your server or call {restaurant.phoneDisplay} before ordering.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <label className="flex-1">
            <span className="sr-only">Search the menu</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes and ingredients…"
              className="w-full bg-surface border border-line px-4 py-3 text-bone placeholder:text-muted/70 focus:border-saffron focus:outline-none transition-colors"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(tag === t ? null : t)}
                aria-pressed={tag === t}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  tag === t
                    ? "bg-saffron text-ink"
                    : "border border-line text-muted hover:text-bone hover:border-bone/40"
                }`}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {isFiltering && (
          <p className="mt-4 text-sm text-muted" role="status">
            {resultCount === 0
              ? "No dishes match — try a different search."
              : `${resultCount} ${resultCount === 1 ? "dish" : "dishes"}`}
            {(query.trim() || tag) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTag(null);
                }}
                className="ml-3 link-underline text-saffron"
              >
                Clear
              </button>
            )}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-10 py-12 sm:py-16 space-y-24 sm:space-y-32">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-36">
            {/* Section photo is decorative when filtering — keep the page calm */}
            {!isFiltering && (
              <Reveal className="group relative aspect-16/9 sm:aspect-21/9 overflow-hidden mb-10">
                <MenuSectionCarousel images={section.images} sectionName={section.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 pointer-events-none">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl">{section.name}</h2>
                </div>
              </Reveal>
            )}

            {isFiltering && (
              <h2 className="text-2xl sm:text-3xl mb-6 text-saffron">{section.name}</h2>
            )}

            {section.groups.map((group) => (
              <div key={group.name} className="mb-10 last:mb-0">
                {group.note && (
                  <p className="text-sm text-muted italic mb-6 max-w-2xl">{group.note}</p>
                )}
                {section.groups.length > 1 && (
                  <h3 className="eyebrow mb-4">{group.name}</h3>
                )}

                <ul className="divide-y divide-line">
                  {group.items.map((item) => (
                    <li
                      key={`${section.id}-${item.name}`}
                      onClick={() => setSelectedDish({ ...item, sectionName: section.name })}
                      className="group py-5 flex items-start justify-between gap-4 sm:gap-6 transition-colors duration-300 hover:bg-surface/80 -mx-3 px-3 rounded-xl cursor-pointer"
                    >
                      {item.image && (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-line bg-surface">
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-display text-lg group-hover:text-saffron transition-colors duration-300">
                            {item.name}
                          </h4>
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] uppercase tracking-wider text-saffron border border-saffron/40 rounded-full px-2 py-0.5"
                            >
                              {TAG_LABELS[t]}
                            </span>
                          ))}
                        </div>
                        {item.description && (
                          <p className="text-muted text-sm leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="font-display text-lg">{price(item.price)}</span>
                        <a
                          href={`${restaurant.links.orderOnline}/?add=${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Order ${item.name}`}
                          title={`Order ${item.name}`}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-saffron/50 text-saffron hover:bg-saffron hover:text-ink transition-colors duration-300"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Lightbox Photo Modal */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface border border-line rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Close Button */}
            <button
              type="button"
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-ink/70 text-bone hover:bg-saffron hover:text-ink transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Dish Image Banner */}
            {selectedDish.image ? (
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden bg-ink/50 border-b border-line shrink-0">
                <Image
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40" />
              </div>
            ) : (
              <div className="relative h-28 w-full bg-gradient-to-br from-saffron/20 via-surface to-ink p-6 border-b border-line flex items-end">
                <span className="text-xs uppercase tracking-widest text-saffron">{selectedDish.sectionName || "Menu Specialty"}</span>
              </div>
            )}

            {/* Dish Info & Call to Action */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-bone mb-2">{selectedDish.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDish.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs uppercase tracking-wider text-saffron border border-saffron/40 rounded-full px-2.5 py-0.5"
                      >
                        {TAG_LABELS[t]}
                      </span>
                    ))}
                    <span className="text-xs text-muted border border-line rounded-full px-2.5 py-0.5">100% Halal</span>
                  </div>
                </div>
                <span className="font-display text-2xl sm:text-3xl text-saffron shrink-0">{price(selectedDish.price)}</span>
              </div>

              {selectedDish.description && (
                <p className="text-bone/80 text-base leading-relaxed border-t border-line/50 pt-4">
                  {selectedDish.description}
                </p>
              )}

              <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3 items-center justify-between">
                <a
                  href={`${restaurant.links.orderOnline}/?add=${selectedDish.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 bg-saffron text-ink hover:bg-saffron/90 font-medium py-3.5 px-6 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span>Order {selectedDish.name} Online — {price(selectedDish.price)}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
