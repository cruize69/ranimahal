"use client";

import { useMemo, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";
import { menu, type MenuTag } from "@/content/menu";
import { restaurant } from "@/content/restaurant";

const TAG_LABELS: Record<MenuTag, string> = {
  veg: "Veg",
  spicy: "Spicy",
  mild: "Mild",
  "child-friendly": "Kid-friendly",
  "low-fat": "Low fat",
  tandoor: "Tandoor",
};

// Only offer filters that actually narrow the menu usefully.
const FILTERS: MenuTag[] = ["veg", "spicy", "mild", "tandoor"];

const price = (n: number) =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;

export function MenuList() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<MenuTag | null>(null);

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
  }, [query, tag]);

  const resultCount = sections.reduce(
    (a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0),
    0
  );
  const isFiltering = Boolean(query.trim() || tag);

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 sm:px-10 pt-12">
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
              <Reveal className="relative aspect-16/9 sm:aspect-21/9 overflow-hidden mb-10 group">
                <EditorialImage
                  src={section.image.src}
                  alt={section.image.alt}
                  fill
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  hoverZoom
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
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
                      className="group py-5 flex items-start justify-between gap-6 transition-colors duration-300 hover:bg-surface/60 -mx-3 px-3"
                    >
                      <div className="min-w-0">
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
                          <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-display text-lg">{price(item.price)}</span>
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
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
