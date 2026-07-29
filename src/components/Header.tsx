"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";
import { Button } from "@/components/Button";
import { Wordmark } from "@/components/Wordmark";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Visit" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-ink/95 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-18 sm:h-20 flex items-center justify-between">
        <Link
          href="/"
          aria-label={`${restaurant.name} — ${restaurant.tagline}, home`}
          className="text-bone hover:text-saffron transition-colors duration-300"
          onClick={() => setOpen(false)}
        >
          <Wordmark className="text-xl sm:text-2xl" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-bone/75">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline hover:text-saffron transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${restaurant.phone}`}
            className="text-sm text-bone/75 hover:text-saffron transition-colors"
          >
            {restaurant.phoneDisplay}
          </a>
          <Button href={restaurant.links.orderOnline} external variant="primary">
            Order Online
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden -mr-2 p-2 text-bone"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.75" />
            ) : (
              <path d="M3 7 H21 M3 12 H21 M3 17 H21" stroke="currentColor" strokeWidth="1.75" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden bg-ink border-t border-line px-5 py-8 flex flex-col gap-6"
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 45}ms` }}
              className="font-display text-2xl text-bone animate-[slide-in_0.45s_cubic-bezier(0.16,1,0.3,1)_both]"
            >
              {link.label}
            </Link>
          ))}
          <Button
            href={restaurant.links.orderOnline}
            external
            variant="primary"
            size="lg"
            className="mt-2 w-full"
          >
            Order Online
          </Button>
        </nav>
      )}
    </header>
  );
}
