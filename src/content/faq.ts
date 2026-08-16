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

const monday = restaurant.hours.find((h) => h.day === "Monday")!;
const friday = restaurant.hours.find((h) => h.day === "Friday")!;
const lunch = monday.services.find((s) => s.name === "Lunch")!;
const dinnerWeekday = monday.services.find((s) => s.name === "Dinner")!;
const dinnerWeekend = friday.services.find((s) => s.name === "Dinner")!;

export type FaqItem = { question: string; answer: string };

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
    answer: `Yes — Rani Mahal caters trays of tandoori classics, curries, and biryani for parties and events. Order online at ${restaurant.links.catering}, or call ${restaurant.phoneDisplay} to discuss your order.`,
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
];
