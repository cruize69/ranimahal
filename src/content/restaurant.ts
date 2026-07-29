// Core restaurant facts used across pages, metadata, and Schema.org structured data.
// Update this file when hours, links, or contact details change — nothing else
// in the app should hardcode these values.

export type DayHours = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  opens: string; // 24h "HH:MM"
  closes: string; // 24h "HH:MM"
  label?: string; // optional human-readable override, e.g. "Sunday Buffet"
};

export const restaurant = {
  name: "Rani Mahal",
  tagline: "Fine Indian Cuisine",
  description:
    "Rani Mahal serves refined Indian cuisine in Mamaroneck, NY — traditional recipes, tandoor-fired classics, and a warm dining room inspired by Mughal architecture.",
  phone: "+1-914-835-9066",
  phoneDisplay: "(914) 835-9066",
  email: "info@rani-mahal.com", // TODO: confirm real inbox
  url: "https://rani-mahal.com",

  address: {
    street: "327 Mamaroneck Ave",
    city: "Mamaroneck",
    state: "NY",
    zip: "10543",
    country: "US",
  },

  // TODO: replace with the exact coordinates for 327 Mamaroneck Ave, NY 10543.
  // Get them from Google Maps: right-click the pin -> the lat/lng shown at the
  // top of the context menu. The values below are an approximate town-center
  // placeholder and are NOT accurate enough to ship for local-pack SEO.
  geo: {
    latitude: 40.9482,
    longitude: -73.729,
  },

  priceRange: "$$",
  cuisine: ["Indian", "North Indian", "Tandoori"],

  hours: [
    { day: "Monday", opens: "17:00", closes: "22:00" },
    { day: "Tuesday", opens: "17:00", closes: "22:00" },
    { day: "Wednesday", opens: "17:00", closes: "22:00" },
    { day: "Thursday", opens: "17:00", closes: "22:00" },
    { day: "Friday", opens: "17:00", closes: "22:30" },
    { day: "Saturday", opens: "12:00", closes: "22:30" },
    {
      day: "Sunday",
      opens: "12:00",
      closes: "15:00",
      label: "Sunday Buffet",
    },
  ] satisfies DayHours[],

  social: {
    instagram: "https://instagram.com/ranimahalny", // TODO: confirm handle
    facebook: "https://facebook.com/ranimahalny", // TODO: confirm handle
  },

  // Existing systems this site links out to rather than rebuilding.
  links: {
    // TODO: replace with the live ordering system URL (React/Vercel/Stripe/Clerk).
    orderOnline: "https://order.rani-mahal.com",
    // TODO: replace with the Sunday buffet Stripe card-hold reservation page.
    buffetReservation: "https://rani-mahal.com/buffet-reservations",
    // TODO: replace with your Google Reserve booking link once onboarded at
    // business.google.com (Google Business Profile -> Bookings).
    googleReserve: "https://reserve.google.com/",
    googleMapsPlace: "https://maps.google.com/?q=Rani+Mahal+Mamaroneck+NY",
  },
} as const;

export const formatHoursLabel = (h: DayHours) => h.label ?? h.day;
