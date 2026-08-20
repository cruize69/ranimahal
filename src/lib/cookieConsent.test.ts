import { describe, it, expect, beforeEach } from "vitest";
import { getConsent, setConsent, CONSENT_CHANGE_EVENT } from "./cookieConsent";

describe("cookieConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing has been chosen yet", () => {
    expect(getConsent()).toBeNull();
  });

  it("round-trips accepted/declined through localStorage", () => {
    setConsent("accepted");
    expect(getConsent()).toBe("accepted");
    setConsent("declined");
    expect(getConsent()).toBe("declined");
  });

  it("clears the stored choice entirely when set to null", () => {
    setConsent("accepted");
    setConsent(null);
    expect(getConsent()).toBeNull();
  });

  it("ignores a corrupted/unexpected stored value", () => {
    window.localStorage.setItem("rani-cookie-consent", "garbage");
    expect(getConsent()).toBeNull();
  });

  it("dispatches the change event so other listeners (banner, GA gate) stay in sync", () => {
    let fired = 0;
    window.addEventListener(CONSENT_CHANGE_EVENT, () => fired++);
    setConsent("accepted");
    expect(fired).toBe(1);
  });
});
