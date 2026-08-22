"use client";

import { useMemo, useSyncExternalStore } from "react";

// ── Scroll-to-build cart (the /menu page's own running tally) ────────────
// Deliberately its own sessionStorage key, NOT the ordering app's
// "rani_cart_v1" (see useSharedCart.ts) — this is just a running tally
// while browsing /menu, not a priced/validated cart (no spice level, no
// server-side price check). It hands off to the ordering app via the same
// "?add=id:qty,id:qty" query param that individual item links already use
// — that endpoint already merges into any existing cart there, re-derives
// prices from its own canonical menu, and shows a confirmation toast, so
// nothing about pricing/validation needs to be duplicated here.
//
// Extracted out of MenuList.tsx (which still owns add/adjust/clear) so
// Header.tsx and MobileActionBar.tsx can also read the live count — they
// need it to know when their own persistent "Order Online" CTA has become
// redundant with MenuList's own FloatingCartBar (see those two files for
// the full reasoning).
export type BrowseCartItem = { name: string; price: number; qty: number };
export const BROWSE_CART_KEY = "rani_menu_browse_cart_v1";
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

export function getCartStore(): Record<string, BrowseCartItem> {
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

export function getServerCartSnapshot() {
  return EMPTY_CART;
}

export function subscribeCart(onChange: () => void) {
  cartListeners.push(onChange);
  return () => {
    cartListeners = cartListeners.filter((l) => l !== onChange);
  };
}

export function setCartStore(updater: (prev: Record<string, BrowseCartItem>) => Record<string, BrowseCartItem>) {
  cartStore = updater(getCartStore());
  try {
    if (Object.keys(cartStore).length === 0) sessionStorage.removeItem(BROWSE_CART_KEY);
    else sessionStorage.setItem(BROWSE_CART_KEY, JSON.stringify(cartStore));
  } catch {
    /* private-browsing storage quota — cart just won't survive a refresh */
  }
  cartListeners.forEach((l) => l());
}

/** Live total item count from the /menu page's own browse cart — same
 * store MenuList.tsx's FloatingCartBar reads, just reduced to a count for
 * callers (Header, MobileActionBar) that only need to know "is it empty or
 * not," not the full cart contents. */
export function useMenuBrowseCartCount(): number {
  const cart = useSyncExternalStore(subscribeCart, getCartStore, getServerCartSnapshot);
  return useMemo(() => Object.values(cart).reduce((s, i) => s + i.qty, 0), [cart]);
}
