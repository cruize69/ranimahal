"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { orderUrl } from "@/lib/orderUrl";
import { feastAddParam, type Feast } from "@/lib/feasts";

function fmt(n: number) {
  return "$" + n.toFixed(2);
}

export function FeastCard({
  feast,
  priority,
  compact = false,
  campaign = "family_meals_page",
}: {
  feast: Feast;
  priority?: boolean;
  /** Truncates the item checklist to the first 4 + "& N more" instead of
   * every item — for a placement (homepage) where the card needs to read
   * in ~15 seconds, not double as the full packing-slip /family-meals
   * itself shows. */
  compact?: boolean;
  /** UTM campaign label for this card's CTA — distinguishes "clicked from
   * the homepage" vs "clicked from /family-meals" in analytics/order
   * records instead of every placement claiming the same campaign. */
  campaign?: string;
}) {
  // Only one slot per feast is swappable today (Rani Ki Offering ->
  // Masala Dosa) — a single boolean mirrors the ordering app's own
  // FeastCard.jsx. If a second swappable slot is ever added, this
  // becomes a Set of baseIds instead.
  const [swapped, setSwapped] = useState(false);
  const savings = feast.aLaCarteTotal - feast.price;
  const savingsPct = Math.round((savings / feast.aLaCarteTotal) * 100);
  const visibleItems = compact ? feast.items.slice(0, 4) : feast.items;
  const hiddenCount = feast.items.length - visibleItems.length;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden border-y sm:rounded-3xl sm:border transition-all duration-300 ${
        feast.flagship
          ? "border-saffron/40 bg-[#120E0B] shadow-[0_12px_40px_rgba(232,168,46,0.12)] sm:ring-1 sm:ring-saffron/20"
          : "border-white/10 bg-[#110D0A] shadow-2xl sm:hover:border-saffron/30"
      }`}
    >
      {feast.flagship && (
        <div className="px-6 pt-5 text-center sm:px-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-saffron align-middle" />
            Most Popular
          </p>
        </div>
      )}

      <div className={`relative w-full overflow-hidden bg-ink/80 ${feast.flagship ? "mt-3" : "mt-5"} h-[46vh] min-h-[320px] sm:h-56 sm:min-h-0`}>
        <Image
          src={feast.heroImage}
          alt={`${feast.name} — a full spread for ${feast.feeds} people`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110D0A] via-black/30 to-transparent" />
        <div className="absolute bottom-3 right-4 rounded-xl border border-white/10 bg-black/75 px-2.5 py-1 backdrop-blur-md">
          <span className="text-xs text-muted">Feeds </span>
          <span className="text-sm font-bold text-saffron">{feast.feeds}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-bone">{feast.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-bone/60">Feeds {feast.feeds}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-2xl font-bold text-saffron">{fmt(feast.price)}</p>
            <p className="text-xs text-muted line-through">{fmt(feast.aLaCarteTotal)}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-[#3C7A4E]/35 bg-[#3C7A4E]/15 px-2.5 py-1 text-xs font-semibold text-[#6FBF87]">
            Save {fmt(savings)} ({savingsPct}%)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-saffron/50 bg-saffron/15 px-2.5 py-1 text-xs font-bold text-saffron">
            🍚 Rice Included
          </span>
        </div>

        <div className="mb-6 rounded-2xl border border-white/5 bg-[#17120E]/60 p-4">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-saffron/90">What&apos;s in it</p>
          <ul className="space-y-2 text-xs leading-relaxed text-bone">
            {visibleItems.map((it) => (
              <li key={it.baseId} className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
                <span className="shrink-0 font-bold text-saffron">{it.qty}×</span>
                <span>{swapped && it.swapTo ? it.swapToName : it.name}</span>
                {it.swapTo && it.swapToName && (
                  <button
                    type="button"
                    onClick={() => setSwapped((s) => !s)}
                    className={`ml-auto shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                      swapped
                        ? "border-[#3C7A4E]/40 bg-[#3C7A4E]/15 text-[#6FBF87]"
                        : "border-saffron/40 bg-saffron/10 text-saffron"
                    }`}
                  >
                    {swapped ? "↩ Undo swap" : `🔁 Swap for ${it.swapToName} (veg)`}
                  </button>
                )}
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="text-bone/50">& {hiddenCount} more</li>
            )}
          </ul>
        </div>

        <div className="flex-1" />

        <Button
          href={orderUrl(`${campaign}_${feast.id}_cta`, { add: feastAddParam(feast, swapped) })}
          external
          variant="primary"
          size="lg"
          className="w-full"
        >
          Order the {feast.name} · {fmt(feast.price)}
        </Button>

        <p className="mt-3 text-center text-[11px] text-muted/70">
          No headcount minimum · Free delivery · Ready in ~25 minutes
        </p>
      </div>
    </div>
  );
}

export function FamilyMealsGrid({ feasts }: { feasts: Feast[] }) {
  return (
    <div className="-mx-5 grid grid-cols-1 gap-8 sm:mx-0 sm:gap-6 lg:grid-cols-2">
      {feasts.map((feast, i) => (
        <FeastCard key={feast.id} feast={feast} priority={i === 0} />
      ))}
    </div>
  );
}
