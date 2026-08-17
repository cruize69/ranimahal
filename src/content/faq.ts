// Frequently asked questions — rendered as a visible on-page section AND fed
// into FAQPage structured data (see FAQStructuredData in StructuredData.tsx).
// Google and AI answer engines require the schema to match visible copy, so
// this is the single source for both — never fork the two.
//
// Every answer here must be a fact already established elsewhere in /content
// (menu.ts, restaurant.ts) or in this file's own computed strings. Don't add
// a question whose answer can't be traced back to real, current data —
// hallucinated FAQ content is exactly what this file exists to prevent.

import { restaurant } from "@/content/restaurant";
import { formatTime, formatWindow } from "@/lib/hours";
import { areasServed } from "@/content/areasServed";
import { getCateringPackages } from "@/lib/cateringPackages";

const monday = restaurant.hours.find((h) => h.day === "Monday")!;
const friday = restaurant.hours.find((h) => h.day === "Friday")!;
const lunch = monday.services.find((s) => s.name === "Lunch")!;
const dinnerWeekday = monday.services.find((s) => s.name === "Dinner")!;
const dinnerWeekend = friday.services.find((s) => s.name === "Dinner")!;

export type FaqItem = { question: string; answer: string };

function fmt(n: number) {
  return "$" + n.toFixed(2);
}

// Static facts don't need a network round-trip — only the catering-pricing
// entry below (getFaqItems) does, since that's real live pricing from the
// ordering system and must never be hand-copied (same rule as everywhere
// else catering pricing appears on this site).
export const faqItems: FaqItem[] = [
  {
    question: "What kind of food does Rani Mahal serve?",
    answer:
      "Rani Mahal is a North Indian restaurant in Mamaroneck, NY, serving tandoori classics fired in a clay oven, slow-simmered curries, biryani, and breads made to order — recipes drawing on family traditions from Punjab and Hyderabad.",
  },
  {
    question: "Where is Rani Mahal located?",
    answer: `Rani Mahal is at ${restaurant.address.street}, on the corner of Phillips Park Rd, in ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}.`,
  },
  {
    question: "What are Rani Mahal's hours?",
    answer: `Lunch is served daily from ${formatWindow(lunch)}. Dinner runs ${formatWindow(
      dinnerWeekday
    )} Monday through Thursday, and until ${formatTime(dinnerWeekend.closes)} Friday through Sunday.`,
  },
  {
    question: "Does Rani Mahal have a buffet?",
    answer:
      "Yes — Rani Mahal runs a Sunday buffet, a full all-you-can-eat spread. Seating is limited, so reserving ahead is recommended.",
  },
  {
    question: "Does Rani Mahal have vegetarian options?",
    answer:
      "Yes — the menu includes dedicated vegetarian appetizer and entree sections alongside the tandoori and meat dishes.",
  },
  {
    question: "Can I order Rani Mahal for pickup or delivery?",
    answer: `Yes — order online for pickup or delivery at ${restaurant.links.orderOnline}, or call ${restaurant.phoneDisplay}.`,
  },
  {
    question: "Does Rani Mahal take reservations?",
    answer: `Yes — book a table through our Reservations page or by calling ${restaurant.phoneDisplay}.`,
  },
  {
    question: "Does Rani Mahal offer catering?",
    answer: `Yes — Rani Mahal caters trays of tandoori classics, curries, and biryani for parties and events. Order online at ${restaurant.url}/catering, or call ${restaurant.phoneDisplay} to discuss your order.`,
  },
  {
    question: "Is the meat at Rani Mahal halal?",
    answer: "Yes — all meat served at Rani Mahal is 100% halal.",
  },
  {
    question: "What areas does Rani Mahal serve?",
    answer: `Rani Mahal is in ${restaurant.address.city}, NY, and also serves nearby Westchester communities including ${areasServed
      .filter((a) => a.name !== restaurant.address.city)
      .map((a) => a.name)
      .join(", ")} — see our Areas We Serve page for details.`,
  },
  {
    question: "Does the menu list dairy, nuts, or other allergens?",
    answer: `No — the menu descriptions don't list every ingredient, so dairy or nut content isn't marked per dish. If you have a food allergy, please ask your server or call ${restaurant.phoneDisplay} before ordering.`,
  },
  {
    question: `How long has ${restaurant.name} been open?`,
    answer: `${restaurant.name} has been serving ${restaurant.address.city}, NY since ${restaurant.openedYear}.`,
  },
  {
    question: `What type of Indian food does ${restaurant.name} serve?`,
    answer: `${restaurant.name} serves ${restaurant.cuisine.join(
      ", "
    )} cuisine — tandoori dishes cooked in a real clay oven, slow-simmered curries, biryani, and breads made to order.`,
  },
  {
    question: `Is ${restaurant.name} an affordable Indian restaurant?`,
    answer: `${restaurant.name} is mid-range (${restaurant.priceRange}) — most entrees and full meals are priced for a regular dinner or lunch out, not a special-occasion splurge. See the full priced menu at ${restaurant.url}/menu.`,
  },
];

// Catering pricing changes with the ordering system, not this file — this
// entry fetches the same live data /catering itself reads (getCateringPackages,
// backed by lib/menu.js's CATERING_PACKAGES on the ordering app) so an AI
// assistant answering "how much does Rani Mahal catering cost" gets the real
// current number, not a hand-typed one that can drift out of sync.
export async function getFaqItems(): Promise<FaqItem[]> {
  const { packages, orderMinimum } = await getCateringPackages();
  const cheapest = packages[0];
  const lowestPrice = Math.min(...packages.flatMap((p) => p.tiers.map((t) => t.price)));
  const highestPrice = Math.max(...packages.flatMap((p) => p.tiers.map((t) => t.price)));

  const cateringPricingItem: FaqItem = {
    question: `How much does catering cost per person at ${restaurant.name}?`,
    answer: `${restaurant.name}'s catering packages are priced per person, from ${fmt(
      lowestPrice
    )} to ${fmt(highestPrice)}/person depending on the package and protein — ${cheapest.name} starts at ${fmt(
      cheapest.tiers[0].price
    )}/person (${cheapest.tiers[0].minimum}-guest minimum). Exact real-time pricing and package details are at ${restaurant.url}/catering; the order minimum is ${fmt(
      orderMinimum
    )}.`,
  };

  return [...faqItems, cateringPricingItem];
}
