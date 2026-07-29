import {
  restaurant,
  type DayHours,
  type DayName,
  type ServiceWindow,
} from "@/content/restaurant";

const DAY_ORDER: DayName[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export const formatWindow = (s: ServiceWindow) =>
  `${formatTime(s.opens)} – ${formatTime(s.closes)}`;

/** Days in Sunday-first order, as displayed. */
export function orderedHours(): DayHours[] {
  const out: DayHours[] = [];
  for (const day of DAY_ORDER) {
    const match = restaurant.hours.find((h) => h.day === day);
    if (match) out.push(match);
  }
  return out;
}

export function getTodayHours(now = new Date()): DayHours | undefined {
  return restaurant.hours.find((h) => h.day === DAY_ORDER[now.getDay()]);
}

/**
 * Open/closed for the visitor's clock. Because a day now has several service
 * windows, this reports which one is active, or the next one coming up —
 * including rolling over to tomorrow's first service after dinner ends.
 */
export function getOpenStatus(now = new Date()) {
  const today = getTodayHours(now);
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (today) {
    const current = today.services.find(
      (s) => minutes >= toMinutes(s.opens) && minutes < toMinutes(s.closes)
    );
    if (current) {
      return {
        isOpen: true,
        label: `Open now — ${current.name.toLowerCase()} until ${formatTime(current.closes)}`,
      };
    }

    const next = today.services.find((s) => minutes < toMinutes(s.opens));
    if (next) {
      return {
        isOpen: false,
        label: `Closed — ${next.name.toLowerCase()} at ${formatTime(next.opens)}`,
      };
    }
  }

  // Past the last service today: point at tomorrow's first window.
  const tomorrow = restaurant.hours.find(
    (h) => h.day === DAY_ORDER[(now.getDay() + 1) % 7]
  );
  const first = tomorrow?.services[0];
  return {
    isOpen: false,
    label: first ? `Closed — opens ${formatTime(first.opens)} tomorrow` : "Closed",
  };
}
