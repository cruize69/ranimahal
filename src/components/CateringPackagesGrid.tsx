"use client";

import { useState } from "react";
import { orderUrl } from "@/lib/orderUrl";
import type { CateringData, CateringPackage, CateringTier } from "@/lib/cateringPackages";

function fmt(n: number) {
  return "$" + n.toFixed(2);
}

function Stepper({ value, onChange, min }: { value: number; onChange: (v: number) => void; min: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Fewer guests"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-bone hover:border-saffron"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-14 rounded-lg border border-line bg-surface px-1 py-1.5 text-center text-sm font-semibold text-bone outline-none focus:border-saffron"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="More guests"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-bone hover:border-saffron"
      >
        +
      </button>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: CateringPackage }) {
  const [tierIdx, setTierIdx] = useState(0);
  const activeTier: CateringTier = pkg.tiers[tierIdx];
  const [guests, setGuests] = useState(activeTier.minimum);

  const selectTier = (idx: number) => {
    setTierIdx(idx);
    const min = pkg.tiers[idx].minimum;
    if (guests < min) setGuests(min);
  };

  const belowMinimum = guests < activeTier.minimum;
  const total = activeTier.price * guests;
  const addHref = orderUrl("catering_page_widget", { add: `${activeTier.itemId}:${guests}` });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-saffron/20 bg-surface shadow-xl shadow-black/20">
      <div className="relative h-48 w-full bg-ink/60">
        {pkg.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pkg.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,rgba(232,168,46,0.08)_0px,rgba(232,168,46,0.08)_1px,transparent_1px,transparent_10px)]">
            <span className="text-xs font-semibold uppercase tracking-wide text-saffron/60">Photo coming soon</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-display text-xl text-bone mb-1">{pkg.name}</p>
        <p className="text-xs text-muted mb-3">{pkg.blurb}</p>

        <ul className="mb-4 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-bone/80">
          {pkg.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {pkg.tiers.length > 1 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {pkg.tiers.map((t, idx) => (
              <button
                key={t.itemId}
                type="button"
                onClick={() => selectTier(idx)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  idx === tierIdx
                    ? "border-saffron bg-saffron/15 text-saffron"
                    : "border-line text-muted hover:border-saffron/60"
                }`}
              >
                {t.label} · {fmt(t.price)}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">Guests</p>
            <Stepper value={guests} onChange={setGuests} min={activeTier.minimum} />
          </div>
          <div className="text-right">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">Total</p>
            <p className="whitespace-nowrap text-xl font-bold text-saffron">{fmt(total)}</p>
          </div>
        </div>

        {belowMinimum && (
          <p className="mb-2 text-xs text-red-400">Minimum {activeTier.minimum} guests for this package.</p>
        )}

        <a
          href={belowMinimum ? undefined : addHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={belowMinimum}
          className={`block w-full rounded-full py-3 text-center text-sm font-bold transition-colors ${
            belowMinimum
              ? "cursor-default bg-saffron/25 text-ink/60 pointer-events-none"
              : "bg-saffron text-ink hover:bg-saffron-deep"
          }`}
        >
          Add to Order · {fmt(activeTier.price)}/person
        </a>
      </div>
    </div>
  );
}

// 3 packages side by side on desktop, a swipeable horizontal carousel on
// mobile (each card at 85% width, snapping into place) — a long vertical
// stack of 3 rich cards is a lot of scrolling on a phone for what's meant
// to read as "here are 3 clear options," not a checklist.
export function CateringPackagesGrid({ data }: { data: CateringData }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:overflow-visible max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:pb-2 max-sm:[&>*]:min-w-[85%] max-sm:[&>*]:snap-center">
        {data.packages.map((pkg) => (
          <PackageCard key={pkg.name} pkg={pkg} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        {fmt(data.orderMinimum)} order minimum · free delivery · lead time 48hrs (5+ days for 40+ guests)
      </p>
    </>
  );
}
