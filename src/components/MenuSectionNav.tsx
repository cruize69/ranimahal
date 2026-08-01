"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuSection } from "@/content/menu";

// Horizontally scrollable section jump-nav that tracks the section in view.
export function MenuSectionNav({ menu }: { menu: MenuSection[] }) {
  const [activeId, setActiveId] = useState(menu[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // IntersectionObserver callbacks only report entries whose intersection
    // state changed *in that batch* — not the full current state of every
    // observed target. Picking "the topmost entry in this callback" from
    // that partial list is why this used to pick stale/wrong sections after
    // a big scroll jump. Track every section's own state in a map instead,
    // and always recompute the active one from the full map.
    const intersecting = new Map<string, DOMRectReadOnly>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.set(entry.target.id, entry.boundingClientRect);
          } else {
            intersecting.delete(entry.target.id);
          }
        }

        const topmost = [...intersecting.entries()].sort(
          (a, b) => a[1].top - b[1].top
        )[0];
        if (topmost) setActiveId(topmost[0]);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    for (const section of menu) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Keep the active pill in view within the horizontally scrolling nav.
  // Scroll the list's own scrollLeft directly rather than calling
  // scrollIntoView on the link — scrollIntoView lets the browser choose any
  // scrollable ancestor to satisfy the request, including the page itself,
  // which fights the user's own vertical scroll. list.scrollTo only ever
  // touches this one element.
  useEffect(() => {
    const list = listRef.current;
    const link = activeLinkRef.current;
    if (!list || !link) return;
    const target = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeId]);

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-16 sm:top-18 z-40 bg-ink/95 backdrop-blur border-b border-line"
    >
      <ul
        ref={listRef}
        className="mx-auto max-w-7xl px-5 sm:px-8 flex gap-2 overflow-x-auto py-3 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {menu.map((section) => {
          const active = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                ref={active ? activeLinkRef : null}
                href={`#${section.id}`}
                aria-current={active ? "true" : undefined}
                className={`block whitespace-nowrap px-4 py-2 rounded-full border transition-all duration-300 ${
                  active
                    ? "bg-saffron text-ink border-saffron font-medium"
                    : "border-line text-muted hover:text-bone hover:border-bone/40"
                }`}
              >
                {section.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
