"use client";

import { useState } from "react";
import { orderUrl } from "@/lib/orderUrl";
import type { CateringData, CateringPackage, CateringTier } from "@/lib/cateringPackages";

function fmt(n: number) {
  return "$" + n.toFixed(2);
}

const PACKAGE_BADGES: Record<string, { label: string; highlight?: boolean }> = {
  Essentials: { label: "Corporate & Team Lunch" },
  Signature: { label: "Most Popular · Celebrations", highlight: true },
  "Rani Feast": { label: "Royal Banquet · Full Feast" },
};

function Stepper({
  value,
  onChange,
  min,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-white/10 bg-[#16120F] p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Fewer guests"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#221B16] text-base font-bold text-[#FAF6EF] transition-all hover:bg-saffron hover:text-[#080706] active:scale-95"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-12 bg-transparent text-center text-sm font-bold text-[#FAF6EF] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="More guests"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#221B16] text-base font-bold text-[#FAF6EF] transition-all hover:bg-saffron hover:text-[#080706] active:scale-95"
      >
        +
      </button>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: CateringPackage }) {
  const [tierIdx, setTierIdx] = useState(0);
  const activeTier: CateringTier = pkg.tiers[tierIdx] || pkg.tiers[0];
  const [guests, setGuests] = useState(activeTier.minimum);

  const selectTier = (idx: number) => {
    setTierIdx(idx);
    const min = pkg.tiers[idx].minimum;
    if (guests < min) setGuests(min);
  };

  const belowMinimum = guests < activeTier.minimum;
  const total = activeTier.price * guests;
  const addHref = orderUrl("catering_page_widget", { add: `${activeTier.itemId}:${guests}` });
  const badgeInfo = PACKAGE_BADGES[pkg.name] || { label: "Curated Package" };

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${
        badgeInfo.highlight
          ? "border-saffron/40 bg-[#120E0B] shadow-[0_12px_40px_rgba(232,168,46,0.12)] ring-1 ring-saffron/20"
          : "border-white/10 bg-[#110D0A] shadow-2xl hover:border-saffron/30"
      }`}
    >
      {/* Visual Header & Badge */}
      <div className="relative h-56 w-full overflow-hidden bg-ink/80">
        {pkg.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.photo}
            alt={pkg.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,rgba(232,168,46,0.08)_0px,rgba(232,168,46,0.08)_1px,transparent_1px,transparent_10px)]">
            <span className="text-xs font-semibold uppercase tracking-wide text-saffron/60">
              Rani Mahal Catering
            </span>
          </div>
        )}
        {/* Dark bottom gradient for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#110D0A] via-black/30 to-transparent" />

        {/* Top Floating Badge */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
              badgeInfo.highlight
                ? "border border-saffron/50 bg-[#080706]/85 text-saffron shadow-lg shadow-black/50"
                : "border border-white/15 bg-[#080706]/75 text-bone/90"
            }`}
          >
            {badgeInfo.highlight && <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />}
            {badgeInfo.label}
          </span>
        </div>

        {/* Per-person price tag on hero */}
        <div className="absolute bottom-3 right-4 rounded-xl border border-white/10 bg-black/75 px-2.5 py-1 backdrop-blur-md">
          <span className="text-xs text-muted">From </span>
          <span className="text-sm font-bold text-saffron">{fmt(pkg.tiers[0].price)}</span>
          <span className="text-[10px] text-muted"> / guest</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-4">
          <h3 className="font-display text-2xl font-bold tracking-tight text-bone">{pkg.name}</h3>
          <p className="mt-1 text-xs font-light leading-relaxed text-muted">{pkg.blurb}</p>
        </div>

        {/* Included Items Checklist */}
        <div className="mb-6 rounded-2xl border border-white/5 bg-[#17120E]/60 p-4">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-saffron/90">
            Package Inclusions
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-bone/85">
            {pkg.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-saffron text-[10px]">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Multi-Tier Selector (if available) */}
        {pkg.tiers.length > 1 && (
          <div className="mb-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Select Protein Tier</p>
            <div className="flex flex-wrap gap-1.5">
              {pkg.tiers.map((t, idx) => {
                const active = idx === tierIdx;
                return (
                  <button
                    key={t.itemId}
                    type="button"
                    onClick={() => selectTier(idx)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-saffron bg-saffron/15 text-saffron shadow-[0_0_12px_rgba(232,168,46,0.15)]"
                        : "border-white/10 text-muted hover:border-white/20 hover:text-bone"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="opacity-60">·</span>
                    <span className={active ? "font-bold text-saffron" : "text-bone/70"}>
                      {fmt(t.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Guest Counter & Live Subtotal Bar */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#16110D] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                Headcount <span className="text-[10px] lowercase text-muted/70">(min {activeTier.minimum})</span>
              </p>
              <Stepper value={guests} onChange={setGuests} min={activeTier.minimum} />
            </div>

            <div className="text-right">
              <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-muted">Estimated Total</p>
              <p className="text-2xl font-bold tracking-tight text-saffron font-display">{fmt(total)}</p>
              <p className="text-[10px] text-muted">
                {fmt(activeTier.price)} × {guests} guests
              </p>
            </div>
          </div>

          {belowMinimum && (
            <p className="mt-2 text-center text-xs font-medium text-rose-400">
              Minimum {activeTier.minimum} guests required for {pkg.name}.
            </p>
          )}
        </div>

        {/* High-Impact Luxury CTA Button */}
        <a
          href={belowMinimum ? undefined : addHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={belowMinimum}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-center text-sm font-bold transition-all ${
            belowMinimum
              ? "cursor-default bg-saffron/20 text-bone/40 pointer-events-none"
              : "bg-gradient-to-r from-saffron via-[#f5b84c] to-[#d69528] text-[#080706] shadow-lg shadow-saffron/20 hover:shadow-saffron/35 hover:brightness-105 active:scale-[0.98]"
          }`}
        >
          <span>Add to Order</span>
          <span className="opacity-70">·</span>
          <span>{fmt(total)}</span>
        </a>

        {/* Trust microcopy */}
        <p className="mt-3 text-center text-[11px] text-muted/70">
          Includes free delivery & full setup in Westchester
        </p>
      </div>
    </div>
  );
}

export function CateringPackagesGrid({ data }: { data: CateringData }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 sm:overflow-visible max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:pb-4 max-sm:[&>*]:min-w-[88%] max-sm:[&>*]:snap-center">
        {data.packages.map((pkg) => (
          <PackageCard key={pkg.name} pkg={pkg} />
        ))}
      </div>

      {/* Trust & Hospitality Guarantees Footer Strip */}
      <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-white/10 bg-[#120E0B]/70 p-6 backdrop-blur-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-saffron text-base">✨</span>
            <p className="text-xs font-bold uppercase tracking-wider text-bone">Full Chafing Setup</p>
            <p className="text-[11px] text-muted">Sternos, stands & serving utensils included with all orders</p>
          </div>
          <div className="flex flex-col items-center gap-1 border-y border-white/10 sm:border-y-0 sm:border-x sm:px-4 py-3 sm:py-0">
            <span className="text-saffron text-base">🚚</span>
            <p className="text-xs font-bold uppercase tracking-wider text-bone">White-Glove Delivery</p>
            <p className="text-[11px] text-muted">Delivered hot & on-time across Westchester & Greenwich</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-saffron text-base">⏳</span>
            <p className="text-xs font-bold uppercase tracking-wider text-bone">Flexible Lead Time</p>
            <p className="text-[11px] text-muted">48 hours notice (5+ days recommended for 40+ guests)</p>
          </div>
        </div>
      </div>
    </>
  );
}
