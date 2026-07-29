"use client";

import Link from "next/link";
import { useState } from "react";
import { restaurant } from "@/content/restaurant";
import { Button } from "@/components/Button";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-gold/40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex items-center justify-between h-20">
        <Link href="/" className="font-display text-xl sm:text-2xl tracking-[0.2em] text-maroon">
          {restaurant.name.toUpperCase()}
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-display text-sm tracking-[0.1em] uppercase">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-maroon transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href={restaurant.links.orderOnline} external variant="primary">
            Order Online
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          className="lg:hidden p-2 -mr-2 text-ink"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5 L21 21 M21 5 L5 21" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 8 H22 M4 13 H22 M4 18 H22" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-gold/40 bg-cream px-5 py-6 flex flex-col gap-5 font-display text-base tracking-[0.1em] uppercase"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Button href={restaurant.links.orderOnline} external variant="primary" className="mt-2 w-full">
            Order Online
          </Button>
        </nav>
      )}
    </header>
  );
}
