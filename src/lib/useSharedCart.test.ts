import { describe, it, expect, beforeEach } from "vitest";
import { readCartItemCount, CART_STORAGE_KEY, CART_MAX_AGE_MS } from "./useSharedCart";

// The exact function an outside audit flagged for a "setState in effect"
// lint hit — the hook wrapping this (useSharedCartCount) can't call this
// during render because localStorage doesn't exist during Next.js SSR, so
// it has to run in an effect. This test locks in that the READ LOGIC
// itself is correct, independent of when/how it's called.

function saveCart(items: Record<string, { qty?: number }>, savedAt = Date.now()) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart: items, savedAt }));
}

describe("readCartItemCount", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns 0 when nothing is stored", () => {
    expect(readCartItemCount()).toBe(0);
  });

  it("sums quantities across all cart items", () => {
    saveCart({ samosa: { qty: 2 }, naan: { qty: 3 } });
    expect(readCartItemCount()).toBe(5);
  });

  it("treats a missing qty as 0, not NaN or a crash", () => {
    saveCart({ samosa: {} });
    expect(readCartItemCount()).toBe(0);
  });

  it("returns 0 for a cart older than the max age window", () => {
    saveCart({ samosa: { qty: 2 } }, Date.now() - CART_MAX_AGE_MS - 1000);
    expect(readCartItemCount()).toBe(0);
  });

  it("returns 0 for a cart just inside the max age window", () => {
    saveCart({ samosa: { qty: 2 } }, Date.now() - CART_MAX_AGE_MS + 1000);
    expect(readCartItemCount()).toBe(2);
  });

  it("never throws on corrupted JSON — returns 0 instead", () => {
    window.localStorage.setItem(CART_STORAGE_KEY, "{not valid json");
    expect(readCartItemCount()).toBe(0);
  });

  it("returns 0 when the stored payload has no cart or savedAt", () => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({}));
    expect(readCartItemCount()).toBe(0);
  });
});
