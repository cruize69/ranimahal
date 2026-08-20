import { describe, it, expect } from "vitest";
import { formatTime, formatWindow, orderedHours, getTodayHours, getOpenStatus } from "./hours";

// A Wednesday, well inside dinner service. Times below use local-machine
// hours (matching getOpenStatus's own `now.getHours()`), not NY-specific —
// this mirrors exactly what the function itself does.
const wednesdayAt = (h: number, m: number) => {
  const d = new Date(2026, 7, 19); // Aug 19 2026 is a Wednesday
  d.setHours(h, m, 0, 0);
  return d;
};

describe("formatTime", () => {
  it("formats on-the-hour times without minutes", () => {
    expect(formatTime("17:00")).toBe("5 PM");
    expect(formatTime("12:00")).toBe("12 PM");
    expect(formatTime("00:00")).toBe("12 AM");
  });

  it("formats non-hour times with minutes", () => {
    expect(formatTime("14:30")).toBe("2:30 PM");
    expect(formatTime("09:15")).toBe("9:15 AM");
  });
});

describe("formatWindow", () => {
  it("joins opens/closes with an en dash", () => {
    expect(formatWindow({ name: "Dinner", opens: "17:00", closes: "21:30" })).toBe("5 PM – 9:30 PM");
  });
});

describe("orderedHours", () => {
  it("returns all 7 days starting Sunday", () => {
    const days = orderedHours();
    expect(days).toHaveLength(7);
    expect(days[0].day).toBe("Sunday");
    expect(days[6].day).toBe("Saturday");
  });
});

describe("getTodayHours", () => {
  it("matches the real day of week for a given date", () => {
    expect(getTodayHours(wednesdayAt(12, 0))?.day).toBe("Wednesday");
  });
});

describe("getOpenStatus", () => {
  it("reports open during lunch service", () => {
    const status = getOpenStatus(wednesdayAt(13, 0));
    expect(status.isOpen).toBe(true);
    expect(status.label).toContain("lunch");
  });

  it("reports open during dinner service", () => {
    const status = getOpenStatus(wednesdayAt(19, 0));
    expect(status.isOpen).toBe(true);
    expect(status.label).toContain("dinner");
  });

  it("reports closed with the next window during the afternoon gap", () => {
    const status = getOpenStatus(wednesdayAt(15, 30));
    expect(status.isOpen).toBe(false);
    expect(status.label).toContain("dinner");
    expect(status.label).toContain("5 PM");
  });

  it("rolls over to tomorrow's first window after the last service tonight", () => {
    const status = getOpenStatus(wednesdayAt(22, 0));
    expect(status.isOpen).toBe(false);
    expect(status.label).toContain("tomorrow");
  });
});
