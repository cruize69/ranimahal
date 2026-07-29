"use client";

import { useEffect, useState } from "react";
import { menu } from "@/content/menu";

// Horizontally scrollable section jump-nav that tracks the section in view.
export function MenuSectionNav() {
  const [activeId, setActiveId] = useState(menu[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    for (const section of menu) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-16 sm:top-18 z-40 bg-ink/95 backdrop-blur border-b border-line"
    >
      <ul className="mx-auto max-w-7xl px-5 sm:px-8 flex gap-6 overflow-x-auto py-4 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menu.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={activeId === section.id ? "true" : undefined}
              className={`whitespace-nowrap transition-colors ${
                activeId === section.id ? "text-saffron" : "text-muted hover:text-bone"
              }`}
            >
              {section.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
