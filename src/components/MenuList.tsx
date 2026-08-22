"use client";

import { useMemo, useState, useEffect, useRef, useCallback, useSyncExternalStore, forwardRef } from "react";
import Image from "next/image";
import { MenuSectionCarousel } from "@/components/MenuSectionCarousel";
import { Reveal } from "@/components/Reveal";
import type { MenuSection, MenuTag, MenuItem } from "@/content/menu";
import { restaurant } from "@/content/restaurant";
import { orderUrl, attributeOrderClick } from "@/lib/orderUrl";

const TAG_LABELS: Record<MenuTag, string> = {
  veg: "Veg",
  spicy: "Spicy",
  mild: "Mild",
};

// Only offer filters that actually narrow the menu usefully.
const FILTERS: MenuTag[] = ["veg", "spicy", "mild"];

const price = (n: number) =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;

// ── Scroll-to-build cart ─────────────────────────────────────────────
// Deliberately its own sessionStorage key, NOT the ordering app's
// "rani_cart_v1" — this is just a running tally while browsing here, not a
// priced/validated cart (no spice level, no server-side price check). It
// hands off to the ordering app via the same "?add=id:qty,id:qty" query
// param that individual item links already used (see orderUrl calls below)
// — that endpoint already merges into any existing cart there, re-derives
// prices from its own canonical menu, and shows a confirmation toast, so
// nothing about pricing/validation needs to be duplicated here.
type BrowseCartItem = { name: string; price: number; qty: number };
const BROWSE_CART_KEY = "rani_menu_browse_cart_v1";
const EMPTY_CART: Record<string, BrowseCartItem> = {};

// Module-level store + useSyncExternalStore, not useState+useEffect — the
// cart's real source of truth is sessionStorage, an external system, and
// reading it only after mount (the useEffect+setState way) either forces
// setState-in-effect (which the lint rule flags for good reason — it's an
// extra cascading render) or a hydration mismatch (server renders an empty
// cart, client immediately renders a populated one). useSyncExternalStore
// is the primitive React ships specifically for "external store that
// differs between server and client": it renders getServerSnapshot's
// stable {} during SSR/hydration, then reconciles to the real snapshot
// right after, with no warning and no manual effect.
let cartStore: Record<string, BrowseCartItem> | null = null;
let cartListeners: Array<() => void> = [];

function getCartStore(): Record<string, BrowseCartItem> {
  if (cartStore === null) {
    let initial: Record<string, BrowseCartItem> = {};
    try {
      const raw = sessionStorage.getItem(BROWSE_CART_KEY);
      if (raw) initial = JSON.parse(raw);
    } catch {
      /* private-browsing storage access — start empty */
    }
    cartStore = initial;
  }
  return cartStore;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function subscribeCart(onChange: () => void) {
  cartListeners.push(onChange);
  return () => {
    cartListeners = cartListeners.filter((l) => l !== onChange);
  };
}

function setCartStore(updater: (prev: Record<string, BrowseCartItem>) => Record<string, BrowseCartItem>) {
  cartStore = updater(getCartStore());
  try {
    if (Object.keys(cartStore).length === 0) sessionStorage.removeItem(BROWSE_CART_KEY);
    else sessionStorage.setItem(BROWSE_CART_KEY, JSON.stringify(cartStore));
  } catch {
    /* private-browsing storage quota — cart just won't survive a refresh */
  }
  cartListeners.forEach((l) => l());
}

type FlyDot = { id: number; x: number; y: number; dx: number; dy: number };

export function MenuList({ menu }: { menu: MenuSection[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<MenuTag | null>(null);
  const [selectedDish, setSelectedDish] = useState<(MenuItem & { sectionName?: string }) | null>(null);

  const cart = useSyncExternalStore(subscribeCart, getCartStore, getServerCartSnapshot);
  const [bump, setBump] = useState(false);
  const [flyDots, setFlyDots] = useState<FlyDot[]>([]);
  const cartBarRef = useRef<HTMLDivElement>(null);
  const flyIdRef = useRef(0);

  const cartCount = useMemo(() => Object.values(cart).reduce((s, i) => s + i.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0), [cart]);

  const fireFlyDot = useCallback((originEl: HTMLElement) => {
    const target = cartBarRef.current;
    if (!target) return;
    const from = originEl.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const id = ++flyIdRef.current;
    setFlyDots((prev) => [
      ...prev,
      {
        id,
        x: from.left + from.width / 2,
        y: from.top + from.height / 2,
        dx: to.left + to.width / 2 - (from.left + from.width / 2),
        dy: to.top + to.height / 2 - (from.top + from.height / 2),
      },
    ]);
    window.setTimeout(() => setFlyDots((prev) => prev.filter((d) => d.id !== id)), 650);
    setBump(true);
    window.setTimeout(() => setBump(false), 350);
  }, []);

  const addToCart = useCallback((item: { id: string; name: string; price: number }, originEl: HTMLElement) => {
    setCartStore((prev) => {
      const existing = prev[item.id];
      return { ...prev, [item.id]: { name: item.name, price: item.price, qty: (existing?.qty ?? 0) + 1 } };
    });
    fireFlyDot(originEl);
  }, [fireFlyDot]);

  const adjustQty = useCallback((id: string, delta: number) => {
    setCartStore((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const qty = existing.qty + delta;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...existing, qty } };
    });
  }, []);

  const checkoutUrl = useMemo(() => {
    const tokens = Object.entries(cart).map(([id, item]) => `${id}:${item.qty}`).join(",");
    return orderUrl("menu_scroll_cart_checkout", { add: tokens });
  }, [cart]);

  // Background scroll lock and Escape key listener when modal is open
  useEffect(() => {
    if (!selectedDish) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDish(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDish]);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && !tag) return menu;

    return menu
      .map((section) => ({
        ...section,
        groups: section.groups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
              const matchesTag = !tag || item.tags?.includes(tag);
              const matchesQuery =
                !q ||
                (item.name || "").toLowerCase().includes(q) ||
                (item.description || "").toLowerCase().includes(q);
              return matchesTag && matchesQuery;
            }),
          }))
          .filter((g) => g.items.length > 0),
      }))
      .filter((s) => s.groups.length > 0);
  }, [menu, query, tag]);

  const resultCount = sections.reduce(
    (a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0),
    0
  );
  const isFiltering = Boolean(query.trim() || tag);

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 sm:px-10 pt-12">
        <p className="text-sm text-muted border border-line px-4 py-3 mb-6">
          Have a dairy, nut, or other food allergy? Our menu descriptions don&rsquo;t list every
          ingredient — please ask your server or call {restaurant.phoneDisplay} before ordering.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <label className="flex-1">
            <span className="sr-only">Search the menu</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes and ingredients…"
              className="w-full bg-surface border border-line px-4 py-3 text-bone placeholder:text-muted/70 focus:border-saffron focus:outline-none transition-colors"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(tag === t ? null : t)}
                aria-pressed={tag === t}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  tag === t
                    ? "bg-saffron text-ink"
                    : "border border-line text-muted hover:text-bone hover:border-bone/40"
                }`}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {isFiltering && (
          <p className="mt-4 text-sm text-muted" role="status">
            {resultCount === 0
              ? "No dishes match — try a different search."
              : `${resultCount} ${resultCount === 1 ? "dish" : "dishes"}`}
            {(query.trim() || tag) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTag(null);
                }}
                className="ml-3 link-underline text-saffron"
              >
                Clear
              </button>
            )}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-10 py-12 sm:py-16 space-y-24 sm:space-y-32">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-36">
            {/* Section photo is decorative when filtering — keep the page calm */}
            {!isFiltering && (
              <Reveal className="group relative aspect-16/9 sm:aspect-21/9 overflow-hidden mb-10">
                <MenuSectionCarousel images={section.images} sectionName={section.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 pointer-events-none">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl">{section.name}</h2>
                </div>
              </Reveal>
            )}

            {isFiltering && (
              <h2 className="text-2xl sm:text-3xl mb-6 text-saffron">{section.name}</h2>
            )}

            {section.groups.map((group) => (
              <div key={group.name} className="mb-10 last:mb-0">
                {group.note && (
                  <p className="text-sm text-muted italic mb-6 max-w-2xl">{group.note}</p>
                )}
                {section.groups.length > 1 && (
                  <h3 className="eyebrow mb-4">{group.name}</h3>
                )}

                <ul className="divide-y divide-line">
                  {group.items.map((item) => (
                    <li
                      key={`${section.id}-${item.name}`}
                      onClick={() => setSelectedDish({ ...item, sectionName: section.name })}
                      className="group py-5 flex items-start justify-between gap-4 sm:gap-6 transition-colors duration-300 hover:bg-surface/80 -mx-3 px-3 rounded-xl cursor-pointer"
                    >
                      {item.image && (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-line bg-surface">
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-display text-lg group-hover:text-saffron transition-colors duration-300">
                            {item.name}
                          </h4>
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] uppercase tracking-wider text-saffron border border-saffron/40 rounded-full px-2 py-0.5"
                            >
                              {TAG_LABELS[t]}
                            </span>
                          ))}
                        </div>
                        {item.description && (
                          <p className="text-muted text-sm leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="font-display text-lg">{price(item.price)}</span>
                        <ItemCartControl
                          qty={cart[item.id]?.qty ?? 0}
                          onAdd={(el) => addToCart(item, el)}
                          onAdjust={(delta) => adjustQty(item.id, delta)}
                          itemName={item.name}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Lightbox Photo Modal */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface border border-line rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Close Button */}
            <button
              type="button"
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-ink/70 text-bone hover:bg-saffron hover:text-ink transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Dish Image Banner */}
            {selectedDish.image ? (
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden bg-ink/50 border-b border-line shrink-0">
                <Image
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40" />
              </div>
            ) : (
              <div className="relative h-28 w-full bg-gradient-to-br from-saffron/20 via-surface to-ink p-6 border-b border-line flex items-end">
                <span className="text-xs uppercase tracking-widest text-saffron">{selectedDish.sectionName || "Menu Specialty"}</span>
              </div>
            )}

            {/* Dish Info & Call to Action */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-bone mb-2">{selectedDish.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDish.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs uppercase tracking-wider text-saffron border border-saffron/40 rounded-full px-2.5 py-0.5"
                      >
                        {TAG_LABELS[t]}
                      </span>
                    ))}
                    <span className="text-xs text-muted border border-line rounded-full px-2.5 py-0.5">100% Halal</span>
                  </div>
                </div>
                <span className="font-display text-2xl sm:text-3xl text-saffron shrink-0">{price(selectedDish.price)}</span>
              </div>

              {selectedDish.description && (
                <p className="text-bone/80 text-base leading-relaxed border-t border-line/50 pt-4">
                  {selectedDish.description}
                </p>
              )}

              <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3 items-center justify-between">
                <ModalAddButton
                  qty={cart[selectedDish.id]?.qty ?? 0}
                  name={selectedDish.name}
                  priceLabel={price(selectedDish.price)}
                  onAdd={(el) => addToCart(selectedDish, el)}
                  onAdjust={(delta) => adjustQty(selectedDish.id, delta)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flying "+1" dots — fixed to viewport, so DOM position in the tree
          doesn't matter as long as no ancestor sets a CSS transform. */}
      {flyDots.map((dot) => (
        <span
          key={dot.id}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: dot.x,
            top: dot.y,
            "--fly-dx": `${dot.dx}px`,
            "--fly-dy": `${dot.dy}px`,
          } as React.CSSProperties}
          className="z-[70] -ml-2 -mt-2 w-4 h-4 rounded-full bg-saffron pointer-events-none animate-[fly-to-cart_0.6s_cubic-bezier(0.3,0.6,0.3,1)_forwards]"
        />
      ))}

      <FloatingCartBar
        ref={cartBarRef}
        count={cartCount}
        subtotal={cartSubtotal}
        bump={bump}
        checkoutUrl={checkoutUrl}
        onClear={() => setCartStore(() => ({}))}
      />
    </>
  );
}

// ── Per-item add/stepper control (menu row) ──────────────────────────
function ItemCartControl({
  qty,
  onAdd,
  onAdjust,
  itemName,
}: {
  qty: number;
  onAdd: (el: HTMLElement) => void;
  onAdjust: (delta: number) => void;
  itemName: string;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={(e) => onAdd(e.currentTarget)}
        aria-label={`Add ${itemName} to cart`}
        title={`Add ${itemName} to cart`}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-saffron/50 text-saffron hover:bg-saffron hover:text-ink transition-colors duration-300"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-saffron/50 bg-saffron/10">
      <button
        type="button"
        onClick={() => onAdjust(-1)}
        aria-label={`Remove one ${itemName}`}
        className="flex items-center justify-center w-8 h-8 rounded-full text-saffron hover:bg-saffron hover:text-ink transition-colors duration-300"
      >
        −
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-medium text-saffron">{qty}</span>
      <button
        type="button"
        onClick={(e) => onAdd(e.currentTarget)}
        aria-label={`Add another ${itemName}`}
        className="flex items-center justify-center w-8 h-8 rounded-full text-saffron hover:bg-saffron hover:text-ink transition-colors duration-300"
      >
        +
      </button>
    </div>
  );
}

// ── Add/stepper control inside the dish lightbox — same idea, full-width ──
function ModalAddButton({
  qty,
  name,
  priceLabel,
  onAdd,
  onAdjust,
}: {
  qty: number;
  name: string;
  priceLabel: string;
  onAdd: (el: HTMLElement) => void;
  onAdjust: (delta: number) => void;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={(e) => onAdd(e.currentTarget)}
        className="w-full sm:w-auto flex-1 bg-saffron text-ink hover:bg-saffron/90 font-medium py-3.5 px-6 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span>Add {name} — {priceLabel}</span>
      </button>
    );
  }

  return (
    <div className="w-full sm:w-auto flex-1 flex items-center justify-center gap-4 bg-saffron/10 border border-saffron/40 rounded-xl py-2.5 px-4">
      <button
        type="button"
        onClick={() => onAdjust(-1)}
        aria-label={`Remove one ${name}`}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-saffron/50 text-saffron hover:bg-saffron hover:text-ink transition-colors"
      >
        −
      </button>
      <span className="font-medium text-saffron min-w-[2rem] text-center">{qty} in cart</span>
      <button
        type="button"
        onClick={(e) => onAdd(e.currentTarget)}
        aria-label={`Add another ${name}`}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-saffron/50 text-saffron hover:bg-saffron hover:text-ink transition-colors"
      >
        +
      </button>
    </div>
  );
}

// ── Floating cart bar ─────────────────────────────────────────────────
// Stacks above MobileActionBar on mobile (that bar is lg:hidden and fixed
// at bottom-0 site-wide — see src/components/MobileActionBar.tsx) rather
// than replacing it, so Call/Order Online stay reachable while this is
// visible. Hidden entirely (unmounted from tab order) at count 0.
const FloatingCartBar = forwardRef<HTMLDivElement, {
  count: number;
  subtotal: number;
  bump: boolean;
  checkoutUrl: string;
  onClear: () => void;
}>(function FloatingCartBar({ count, subtotal, bump, checkoutUrl, onClear }, ref) {
  const visible = count > 0;
  return (
    <div
      ref={ref}
      aria-hidden={!visible}
      className={`fixed inset-x-0 z-[60] bottom-[calc(76px+env(safe-area-inset-bottom))] lg:bottom-6 flex justify-center px-4 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center gap-4 bg-ink border border-saffron/40 rounded-full shadow-2xl shadow-black/40 pl-5 pr-2 py-2 ${
          bump ? "animate-[cart-bump_0.35s_ease-out]" : ""
        }`}
      >
        <div className="flex items-center gap-2 text-sm text-bone">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-saffron text-ink text-xs font-bold">
            {count}
          </span>
          <span className="hidden sm:inline text-muted">building your order</span>
          <span className="font-display text-saffron">{price(subtotal)}</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear cart"
          title="Clear cart"
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-bone transition-colors"
        >
          ✕
        </button>
        <a
          href={checkoutUrl}
          onClick={attributeOrderClick}
          className="bg-saffron text-ink hover:bg-saffron/90 font-medium text-sm py-2.5 px-5 rounded-full transition-colors whitespace-nowrap"
        >
          Start Checkout →
        </a>
      </div>
    </div>
  );
});
