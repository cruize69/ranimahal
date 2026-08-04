"use client";

import { useEffect, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { Button } from "@/components/Button";
import { restaurant } from "@/content/restaurant";
import { promoSeniorTuesdays } from "@/content/media";

const DISMISSED_KEY = "rani-senior-tuesdays-dismissed";
const SHOW_DELAY_MS = 1600;
const EXIT_DURATION_MS = 300;
const SCROLL_DISMISS_DELAY_MS = 2000;
const AUTO_DISMISS_MS = 8000;

/**
 * Promo toast for the home page only. Waits until the hero has had a moment
 * to load and the visitor has settled in before appearing, so it never
 * competes with first paint. Dismissal is remembered per tab (sessionStorage)
 * so it shows once per visit, not on every reload.
 *
 * Deliberately a corner toast, not a full-screen modal: it doesn't dim the
 * page, doesn't lock scroll, and never forces a decision before the visitor
 * can keep browsing or ordering — a page-blocking version of this promo was
 * flagged as unnecessary friction for what is a secondary, opt-in discount.
 * CTAs point at the menu and directions rather than online ordering, since
 * the discount itself is dine-in only.
 *
 * Gets out of the way on its own, too: the first scroll after it appears
 * means the visitor is already moving on, so it closes itself shortly after
 * (rather than sitting there demanding a dismiss click), and it times out on
 * its own after a while even if the visitor never scrolls at all.
 */
export function SeniorTuesdaysModal() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    const timer = window.setTimeout(() => setMounted(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  // A visitor who starts scrolling has already moved on — give it a couple
  // seconds (still readable mid-scroll) then close on its own rather than
  // sitting there waiting to be dismissed.
  useEffect(() => {
    if (!mounted) return;
    let scrollTimer: number | null = null;
    const onScroll = () => {
      if (scrollTimer !== null) return;
      scrollTimer = window.setTimeout(close, SCROLL_DISMISS_DELAY_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
    };
  }, [mounted]);

  // Also times out on its own after a while, so a visitor who never scrolls
  // (reading the hero copy, say) doesn't have this parked indefinitely.
  useEffect(() => {
    if (!mounted) return;
    const timer = window.setTimeout(close, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [mounted]);

  function close() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
    window.setTimeout(() => setMounted(false), EXIT_DURATION_MS);
  }

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-40 bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative flex overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="absolute right-2.5 top-2.5 z-10 rounded-full bg-ink/50 p-1.5 text-bone backdrop-blur transition-colors duration-200 hover:bg-saffron hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative w-24 flex-shrink-0 sm:w-28">
          <EditorialImage
            src={promoSeniorTuesdays.src}
            alt={promoSeniorTuesdays.alt}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <p className="eyebrow mb-1">Every Tuesday</p>
          <p className="mb-1 font-display text-lg text-bone">
            Senior Citizen Tuesdays — <span className="text-saffron">10% Off</span>
          </p>
          <p className="mb-3 text-sm leading-snug text-muted">55+, dine-in only.</p>
          <div className="flex flex-wrap gap-2">
            <Button href="/menu" variant="primary" size="sm" onClick={close}>
              View Menu
            </Button>
            <Button href={restaurant.links.googleMapsPlace} external variant="secondary" size="sm" onClick={close}>
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
