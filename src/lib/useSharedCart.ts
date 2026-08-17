"use client";

import { useEffect, useState } from "react";

// The ordering app (ranimahal-backend, proxied at /order via next.config.ts's
// rewrites — a transparent proxy, not a redirect) shares this exact origin
// with the marketing site, so its cart localStorage is directly readable
// here with zero API calls, zero polling server, zero new infrastructure.
// Key/shape/freshness-window must stay in sync with RaniMahal.jsx's own
// CART_STORAGE_KEY / CART_MAX_AGE_MS — this is a read-only mirror, never
// written to from this side.
const CART_STORAGE_KEY = "rani_cart_v1";
const CART_MAX_AGE_MS = 6 * 60 * 60 * 1000;

function readCartItemCount(): number {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return 0;
    const { cart, savedAt } = JSON.parse(raw);
    if (!cart || !savedAt || Date.now() - savedAt > CART_MAX_AGE_MS) return 0;
    return Object.values(cart as Record<string, { qty?: number }>).reduce(
      (sum, item) => sum + (item?.qty || 0),
      0
    );
  } catch {
    return 0;
  }
}

/** Live item count from the ordering app's cart, kept in sync across tabs.
 * "Order Online" typically opens the ordering app in a new tab
 * (target="_blank"), so cart-building usually happens in a DIFFERENT tab
 * from the one rendering this hook — the `storage` event is what makes that
 * cross-tab sync work, firing automatically in every other same-origin tab
 * whenever one tab writes to localStorage. `visibilitychange` is a fallback
 * re-check for cases (some mobile browsers, tab discard/restore) where the
 * storage event doesn't reliably fire. */
export function useSharedCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(readCartItemCount());

    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY || e.key === null) setCount(readCartItemCount());
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") setCount(readCartItemCount());
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return count;
}
