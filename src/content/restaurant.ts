// Core restaurant facts used across pages, metadata, and Schema.org structured data.
// Update this file when hours, links, or contact details change — nothing else
// in the app should hardcode these values.

export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/** One continuous service window. A day can have more than one. */
export type ServiceWindow = {
  name: "Lunch" | "Dinner";
  opens: string; // 24h "HH:MM"
  closes: string; // 24h "HH:MM"
};

export type DayHours = {
  day: DayName;
  services: ServiceWindow[];
};

export const restaurant = {
  name: "Rani Mahal",
  tagline: "Fine Indian Cuisine",
  openedYear: 2006,
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

  // Exact coordinates for the restaurant itself (327 Mamaroneck Ave), from
  // OpenStreetMap's own "Rani Mahal" amenity node — not a street-level
  // approximation. Cross-check against Google Maps if the location ever
  // changes: right-click the pin -> the lat/lng shown at the top of the
  // context menu.
  geo: {
    latitude: 40.9514587,
    longitude: -73.7350652,
  },

  priceRange: "$$",
  cuisine: ["Indian", "North Indian", "Tandoori"],

  // Taken from the live EdgeServ ordering system's `openingIntervals`
  // (stored there as UTC-5 offsets from midnight, decoded here to local time).
  // Lunch runs every day; dinner closes 30 min later Fri–Sun.
  //
  // NOTE: these are the *online ordering* windows, which is the most
  // authoritative and self-consistent source available — the old
  // ranimahalny.com site states two conflicting sets. Confirm against the
  // dining room's actual hours before launch.
  hours: [
    {
      day: "Monday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "21:30" },
      ],
    },
    {
      day: "Tuesday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "21:30" },
      ],
    },
    {
      day: "Wednesday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "21:30" },
      ],
    },
    {
      day: "Thursday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "21:30" },
      ],
    },
    {
      day: "Friday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "22:00" },
      ],
    },
    {
      day: "Saturday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "22:00" },
      ],
    },
    {
      day: "Sunday",
      services: [
        { name: "Lunch", opens: "12:00", closes: "14:30" },
        { name: "Dinner", opens: "17:00", closes: "22:00" },
      ],
    },
  ] satisfies DayHours[],

  social: {
    // Confirmed from the current ranimahalny.com footer.
    facebook: "https://www.facebook.com/ranimahalny",
    // No Instagram link exists on the current site — add the real handle here
    // to surface it in the footer and in the Schema.org `sameAs` list.
    instagram: "",
  },

  // Existing systems this site links out to rather than rebuilding.
  links: {
    // In-house ordering system (ranimahal-backend), live at its own domain.
    orderOnline: "https://ranimahal.food",
    // Gift cards, confirmed from the current site.
    giftCards: "https://ranimahalny.instagift.com/",
    // TODO: replace with the Sunday buffet Stripe card-hold reservation page.
    buffetReservation: "https://rani-mahal.com/buffet-reservations",
    // TODO: replace with your Google Reserve booking link once onboarded at
    // business.google.com (Google Business Profile -> Bookings).
    googleReserve: "https://reserve.google.com/",
    googleMapsPlace: "https://maps.google.com/?q=Rani+Mahal+Mamaroneck+NY",
  },
} as const;

