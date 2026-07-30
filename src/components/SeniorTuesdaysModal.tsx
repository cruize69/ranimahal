"use client";

import { useEffect, useState } from "react";
import { EditorialImage } from "@/components/EditorialImage";
import { Button } from "@/components/Button";
import { restaurant } from "@/content/restaurant";

const DISMISSED_KEY = "rani-senior-tuesdays-dismissed";
const SHOW_DELAY_MS = 1600;
const EXIT_DURATION_MS = 300;

/**
 * Promo popup for the home page only. Waits until the hero has had a moment
 * to load and the visitor has settled in before appearing, so it never
 * competes with first paint. Dismissal is remembered per tab (sessionStorage)
 * so it shows once per visit, not on every reload.
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
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function close() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
    window.setTimeout(() => setMounted(false), EXIT_DURATION_MS);
  }

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="senior-tuesdays-heading"
      onClick={close}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/80 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg sm:max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all duration-300 ease-out sm:grid sm:grid-cols-5 ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[0.98]"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-ink/50 p-2.5 text-bone backdrop-blur transition-all duration-200 hover:bg-saffron hover:text-ink active:scale-90"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative aspect-[16/10] sm:aspect-auto sm:col-span-2 sm:h-full">
          <EditorialImage
            src="/images/promo/senior-tuesdays.jpg"
            alt="Guests enjoying dinner together at Rani Mahal"
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 sm:col-span-3 sm:p-8">
          <p className="eyebrow mb-3">Every Tuesday</p>
          <h2 id="senior-tuesdays-heading" className="text-2xl sm:text-3xl text-bone mb-3">
            Senior Citizen Tuesdays
          </h2>
          <p className="text-4xl sm:text-5xl font-display text-saffron mb-4">10% Off</p>
          <p className="text-muted leading-relaxed mb-5">
            A thank-you for our longtime guests — every Tuesday, dine-in only.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wide text-muted">
              55+
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wide text-muted">
              Dine-in Only
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button href={restaurant.links.orderOnline} external variant="primary" size="sm" onClick={close}>
              Order Now
            </Button>
            <Button href="/menu" variant="secondary" size="sm" onClick={close}>
              View Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
