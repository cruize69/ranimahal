"use client";

import { useEffect, useRef, useState } from "react";
import { restaurant } from "@/content/restaurant";

// Persistent order/call bar on phones — most visitors arrive from Google or
// Instagram on mobile, so the primary conversion path stays on screen.
// Compacts a little once the visitor starts scrolling, so it reads as a
// lighter-touch dock rather than a full-height bar competing with the page —
// the two CTAs stay exactly as present, just smaller.
//
// The hero already carries its own Order Online / View Menu buttons, so this
// bar stays hidden (not just transparent — unmounted from layout/tab order)
// until the visitor scrolls past the hero and those buttons are out of view.
// It then fades/slides in, with a single brief highlight pulse on Order
// Online to draw the eye once.
export function MobileActionBar() {
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const hasPulsed = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);

      // Hero is min-h-[100svh] with its CTAs near the bottom — 85% of the
      // viewport height reliably clears them before the bar takes over.
      if (!revealed && y > window.innerHeight * 0.85) {
        setRevealed(true);
        if (!hasPulsed.current) {
          hasPulsed.current = true;
          setPulsing(true);
          window.setTimeout(() => setPulsing(false), 1400);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealed]);

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-50 bg-ink/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)] transition-all duration-500 ease-out ${
        revealed
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-hidden={!revealed}
    >
      <div
        className={`flex items-stretch gap-2 transition-[padding] duration-300 ease-out ${
          scrolled ? "p-2" : "p-3"
        }`}
      >
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
          href={restaurant.links.orderOnline}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 flex items-center justify-center rounded-full bg-saffron text-ink font-medium text-sm transition-[padding] duration-300 ease-out ${
            scrolled ? "px-5 py-2" : "px-5 py-3"
          } ${pulsing ? "highlight-pulse" : ""}`}
        >
          Order Online
        </a>
      </div>
    </div>
  );
}
