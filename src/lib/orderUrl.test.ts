import { describe, it, expect, afterEach } from "vitest";
import { orderUrl, getIncomingAdParams, attributeOrderClick } from "./orderUrl";

describe("orderUrl", () => {
  it("always stamps the internal UTM defaults", () => {
    const url = new URL(orderUrl("hero_cta"));
    expect(url.searchParams.get("utm_source")).toBe("ranimahal_cc");
    expect(url.searchParams.get("utm_medium")).toBe("website");
    expect(url.searchParams.get("utm_campaign")).toBe("hero_cta");
  });

  it("includes extra params without disturbing the defaults", () => {
    const url = new URL(orderUrl("menu_item_row", { item: "samosa" }));
    expect(url.searchParams.get("item")).toBe("samosa");
    expect(url.searchParams.get("utm_campaign")).toBe("menu_item_row");
  });
});

describe("getIncomingAdParams", () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, "location", { value: originalLocation, writable: true });
  });

  it("returns an empty object for organic/direct traffic (no ad params)", () => {
    Object.defineProperty(window, "location", {
      value: { search: "" }, writable: true,
    });
    expect(getIncomingAdParams()).toEqual({});
  });

  it("extracts only the known ad params, ignoring everything else", () => {
    Object.defineProperty(window, "location", {
      value: { search: "?gclid=abc123&utm_source=google&random=1" }, writable: true,
    });
    expect(getIncomingAdParams()).toEqual({ gclid: "abc123", utm_source: "google" });
  });
});

describe("attributeOrderClick", () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, "location", { value: originalLocation, writable: true });
  });

  function fakeClickEvent(href: string) {
    const anchor = document.createElement("a");
    anchor.href = href;
    return { currentTarget: anchor } as unknown as Parameters<typeof attributeOrderClick>[0];
  }

  it("does nothing when the visitor has no real ad params on the current page", () => {
    Object.defineProperty(window, "location", { value: { search: "" }, writable: true });
    const e = fakeClickEvent("https://ranimahal.cc/order?utm_source=ranimahal_cc&utm_campaign=hero_cta");
    attributeOrderClick(e);
    expect(e.currentTarget.href).toBe("https://ranimahal.cc/order?utm_source=ranimahal_cc&utm_campaign=hero_cta");
  });

  it("overwrites internal defaults with real incoming ad params on an /order link", () => {
    Object.defineProperty(window, "location", { value: { search: "?gclid=real123" }, writable: true });
    const e = fakeClickEvent("https://ranimahal.cc/order?utm_source=ranimahal_cc&utm_campaign=hero_cta");
    attributeOrderClick(e);
    const url = new URL(e.currentTarget.href);
    expect(url.searchParams.get("gclid")).toBe("real123");
  });

  it("never rewrites a link that isn't pointed at /order (safety check)", () => {
    Object.defineProperty(window, "location", { value: { search: "?gclid=real123" }, writable: true });
    const e = fakeClickEvent("https://ranimahal.cc/menu");
    attributeOrderClick(e);
    expect(e.currentTarget.href).toBe("https://ranimahal.cc/menu");
  });
});
