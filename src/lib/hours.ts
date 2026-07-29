import { restaurant, formatHoursLabel, type DayHours } from "@/content/restaurant";

const DAY_ORDER: DayHours["day"][] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function getTodayHours(now = new Date()): DayHours | undefined {
  const dayName = DAY_ORDER[now.getDay()];
  return restaurant.hours.find((h) => h.day === dayName);
}

export function getOpenStatus(now = new Date()) {
  const today = getTodayHours(now);
  if (!today) return { isOpen: false, label: "Closed today" };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = nowMinutes >= toMinutes(today.opens) && nowMinutes < toMinutes(today.closes);

  return {
    isOpen,
    label: isOpen
      ? `Open now — until ${formatTime(today.closes)}`
      : `Closed — opens ${formatTime(today.opens)}`,
    today,
  };
}

export function orderedHours(): DayHours[] {
  const hours: DayHours[] = [];
  for (const day of DAY_ORDER) {
    const match = restaurant.hours.find((h) => h.day === day);
    if (match) hours.push(match);
  }
  return hours;
}

export { formatHoursLabel };
