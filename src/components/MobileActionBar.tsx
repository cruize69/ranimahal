"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { restaurant } from "@/content/restaurant";
import { orderUrl, attributeOrderClick } from "@/lib/orderUrl";
import { useSharedCartCount } from "@/lib/useSharedCart";
import { useMenuBrowseCartCount } from "@/lib/useMenuBrowseCart";

// Persistent order/call bar on phones — most visitors arrive from Google or
// Instagram on mobile, so the primary conversion path stays on screen.
// Compacts a little once the visitor starts scrolling, so it reads as a
// lighter-touch dock rather than a full-height bar competing with the page —
// the two CTAs stay exactly as present, just smaller.
//
// The hero already carries its own Order Online / View Menu buttons, so this
// bar stays hidden (not just transparent — unmounted from layout/tab order)
// while those buttons are in view. It's a live toggle, not a one-time
// reveal: fades in once the visitor scrolls past the hero, and fades back
// out if they scroll back up to it, so it never competes with the hero's
// own CTAs. Show/hide use two different thresholds (not one) — a small dead
// zone around the hero's edge so momentum/rubber-band scrolling can't
// flicker the bar in and out at the boundary. The highlight pulse still
// fires at most once per visit, however many times the bar re-reveals.
//
// Once a cart actually has items in it (read live from the ordering app's
// localStorage — same origin via next.config.ts's proxy, see
// lib/useSharedCart.ts), the two-button Call/Order layout collapses to a
// single "Continue Checkout" button. "Order Online" is honest advice to
// someone who hasn't started yet; it's a stale, slightly confusing label
// once they're already mid-cart in another tab — a single clear next step
// is the cleaner, truthful state.
export function MobileActionBar() {
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const hasPulsed = useRef(false);
  const revealedRef = useRef(false);
  const ticking = useRef(false);
  const cartCount = useSharedCartCount();
  const pathname = usePathname();
  const browseCartCount = useMenuBrowseCartCount();
  // On /menu, MenuList.tsx's own FloatingCartBar takes over as the
  // checkout CTA the moment a visitor adds an item there — this bar's
  // Call/Order Online (or Continue Checkout) row directly above it would
  // otherwise stack a second, differently-labeled CTA on top, since this
  // bar watches a different cart (the real ordering-app one) than the
  // page's own browse cart FloatingCartBar tracks. Hiding entirely once
  // either has anything in it, on this page only, leaves one clear next
  // step instead of two.
  const suppressOnMenu = pathname === "/menu" && cartCount + browseCartCount > 0;

  useEffect(() => {
    const SHOW_AT = 0.85; // past the hero's own CTAs
    const HIDE_AT = 0.65; // lower than SHOW_AT on purpose — see comment above

    const update = () => {
      ticking.current = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      setScrolled(y > 80);

      const shouldReveal = revealedRef.current ? y > vh * HIDE_AT : y > vh * SHOW_AT;
      if (shouldReveal !== revealedRef.current) {
        revealedRef.current = shouldReveal;
        setRevealed(shouldReveal);
        if (shouldReveal && !hasPulsed.current) {
          hasPulsed.current = true;
          setPulsing(true);
          window.setTimeout(() => setPulsing(false), 1400);
        }
      }
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const shown = revealed && !suppressOnMenu;

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-50 bg-ink/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)] transition-all duration-500 ease-out ${
        shown
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-hidden={!shown}
    >
      <div
        className={`flex items-stretch gap-2 transition-[padding] duration-300 ease-out ${
          scrolled ? "p-2" : "p-3"
        }`}
      >
        {cartCount > 0 ? (
          // A cart already exists in the ordering app's localStorage (shared
          // same-origin — see useSharedCart.ts). Order Online + Call side by
          // side reads as "pick a starting action" to someone who's actually
          // mid-order already; collapsing to one full-width Checkout button
          // is the cleaner, truthful state once ordering has genuinely begun.
          <a
            href={orderUrl("mobile_action_bar_resume")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={attributeOrderClick}
            className={`flex-1 flex items-center justify-center rounded-full bg-saffron text-ink font-medium text-sm transition-[padding] duration-300 ease-out ${
              scrolled ? "px-5 py-2" : "px-5 py-3"
            } ${pulsing ? "highlight-pulse" : ""}`}
          >
            Continue Checkout · {cartCount} {cartCount === 1 ? "item" : "items"}
          </a>
        ) : (
          <>
            <a
              href={`tel:${restaurant.phone}`}
              className={`flex items-center justify-center gap-2 rounded-full border border-line text-bone text-sm transition-[padding] duration-300 ease-out ${
                scrolled ? "px-4 py-2" : "px-5 py-3"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.4 1L7.2 10a12 12 0 0 0 5.8 5.8l1.2-1.5c.2-.3.6-.5 1-.4l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1h-1C9.7 19 4 13.3 4 6V5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Call
            </a>
            <a
              href={orderUrl("mobile_action_bar")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={attributeOrderClick}
              className={`flex-1 flex items-center justify-center rounded-full bg-saffron text-ink font-medium text-sm transition-[padding] duration-300 ease-out ${
                scrolled ? "px-5 py-2" : "px-5 py-3"
              } ${pulsing ? "highlight-pulse" : ""}`}
            >
              Order Online
            </a>
          </>
        )}
      </div>
    </div>
  );
}
