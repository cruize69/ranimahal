// Event-type catering landing pages — /catering/[slug], sharing the same
// dynamic route as the area pages (src/app/catering/[area]/page.tsx tries
// an area lookup first, then falls back to this list). Genuinely unique
// copy per event, not a template swap — see areasServed.ts for why that
// distinction matters (thin/duplicate-content risk on programmatic pages).
//
// Slugs are deliberately distinct from every areaSlug() output (town
// names) so the two lookups can never collide on the same [area] segment.

export type CateringEventType = {
  slug: string;
  name: string; // short display name, e.g. "Wedding Catering"
  headline: string; // page H1
  lead: string; // PageHeader subhead
  paragraph1: string;
  paragraph2: string;
  recommendedPackage?: string; // matches a CateringPackage.name, for the "starts with" nudge
};

export const cateringEventTypes: CateringEventType[] = [
  {
    slug: "weddings",
    name: "Wedding Catering",
    headline: "Indian Wedding Catering in Westchester, NY",
    lead: "From an intimate reception to a 200-guest celebration — real tandoori, hours-simmered curries, and biryani made to order. Free delivery and full chafing setup included.",
    paragraph1:
      "A wedding is the one event where reheated catering trays are unforgivable. Every dish in our Rani Feast tier — tandoori chicken or chicken tikka to start, four mains including a seafood option, chicken or vegetable biryani, three kinds of naan — comes out of the same clay tandoor and kitchen that fires our dine-in menu, not a separate banquet line.",
    paragraph2:
      "All meat is 100% halal, and every package can flex to a fully vegetarian spread without losing the variety — Palak Paneer and a full vegetable biryani are already standard, not a substitution you have to ask for. For 100+ guests or a multi-course reception menu the packages don't cover, the custom quote form below gets you a real answer within one business day, not a form-letter reply.",
    recommendedPackage: "Rani Feast",
  },
  {
    slug: "corporate-catering",
    name: "Corporate Catering",
    headline: "Corporate Indian Catering in Westchester, NY",
    lead: "Office lunches, client meetings, and company milestones — ordered online, priced per person, delivered on time. No minimum order stress for a 15-person team lunch.",
    paragraph1:
      "The Essentials package exists specifically for this: a 15-guest minimum, real per-person pricing you can put on an expense report without a follow-up call, and a menu built around what actually works for a conference-room lunch — samosa or pakora, a choice of Chicken Tikka Masala or Chicken Makhni paired with Palak Paneer, dal, rice, and garlic naan. No utensil scramble, no guessing what's vegetarian.",
    paragraph2:
      "For a larger company event — a holiday party, an all-hands, a client dinner — the Signature and Rani Feast tiers scale up with protein-tier options (poultry, seafood, or lamb) so one order can cover a genuinely mixed office without three separate deliveries. Full chafing setup and sternos are included at every tier, not an add-on.",
    recommendedPackage: "Essentials",
  },
  {
    slug: "birthday-parties",
    name: "Birthday & Milestone Party Catering",
    headline: "Birthday & Milestone Party Catering in Westchester, NY",
    lead: "Sweet sixteens, milestone birthdays, anniversaries — real tandoor-fired food for a party that isn't just pizza and a cake table.",
    paragraph1:
      "The Signature package is built for exactly this scale — a 20-guest minimum, three mains always including Palak Paneer, a starter of samosa and Chicken Malai Kabab, and a protein-tier choice (poultry & veg, seafood, or lamb) so the birthday person's favorite dish is actually on the table, not a generic buffet.",
    paragraph2:
      "For a smaller milestone — a family dinner, a quiet round-number birthday — the Essentials tier drops the minimum to 15 guests without dropping the quality: it's the same tandoor, the same hours-simmered dal, just a tighter menu. Either way, delivery and full serving setup are included, so the only thing left to do is light the candles.",
    recommendedPackage: "Signature",
  },
  {
    slug: "diwali-catering",
    name: "Diwali & Holiday Catering",
    headline: "Diwali & Holiday Party Catering in Westchester, NY",
    lead: "Diwali gatherings, office holiday parties, New Year's celebrations — a full spread that actually matches the occasion, not a scaled-down weeknight order.",
    paragraph1:
      "Diwali catering means the same festival-night menu you'd expect at home: tandoori starters, a real biryani, mango chutney, and a dal that's been simmering for hours, not a quick-turnaround steam-table version. The Rani Feast tier is built for exactly this — four mains including a seafood option, chicken or vegetable biryani, and three kinds of naan (garlic, onion, and Peshwari) for a table that actually reads as a celebration.",
    paragraph2:
      "Office holiday parties and New Year's gatherings work just as well on the Signature tier, with a protein-tier choice so a genuinely mixed office — including guests who've never had Indian food before — has an easy, crowd-pleasing entry point alongside the more traditional dishes. Free delivery and full chafing setup, every tier, every order.",
    recommendedPackage: "Rani Feast",
  },
  {
    slug: "graduation-parties",
    name: "Graduation Party Catering",
    headline: "Graduation Party Catering in Westchester, NY",
    lead: "High school, college, grad school — spring is graduation-party season, and a real hot buffet beats another round of deli platters.",
    paragraph1:
      "The Signature package fits most graduation parties well: a 20-guest minimum, three real mains (always including Palak Paneer for vegetarian guests), samosa and Chicken Malai Kabab to start, and a protein-tier choice so the menu works whether it's a backyard gathering or a rented hall.",
    paragraph2:
      "Smaller family celebration instead of a big party? The Essentials tier covers a 15-guest minimum at a lower per-person price without cutting the tandoor-fired quality — same kitchen, tighter menu. Order online, set your headcount, and it shows up ready to serve, chafing dishes included.",
    recommendedPackage: "Signature",
  },
  {
    slug: "puja-catering",
    name: "Puja & Religious Ceremony Catering",
    headline: "Puja & Religious Ceremony Catering in Westchester, NY",
    lead: "Pujas, religious ceremonies, and community gatherings — a genuinely vegetarian-friendly spread, not a vegetarian option bolted onto a meat-first menu.",
    paragraph1:
      "Every package already includes real vegetarian mains as standard — Palak Paneer is a fixture across all three tiers, and the full menu can go entirely vegetarian without losing variety: vegetable biryani, dal Maharani Makhni, raita, and a full bread selection. This isn't a special request, it's how the packages are built.",
    paragraph2:
      "For a smaller ceremony or gathering, the Essentials tier's 15-guest minimum keeps things simple; for a larger community event, Rani Feast scales up with a full vegetable biryani and three bread styles. All meat served alongside (for mixed gatherings) is 100% halal. Delivery, setup, and serving equipment are included at every tier.",
    recommendedPackage: "Essentials",
  },
  {
    slug: "private-events",
    name: "Private Event Catering",
    headline: "Private Event Catering in Westchester, NY",
    lead: "Baby showers, engagement parties, anniversaries, retirement gatherings — real tandoor-fired catering for the celebrations that don't fit a standard category.",
    paragraph1:
      "Not every event is a wedding or a birthday, and the packages don't assume it is. Essentials covers a smaller, more intimate gathering at a 15-guest minimum; Signature scales to a bigger celebration with a protein-tier choice; Rani Feast is built for the full-scale version with four mains and a real biryani.",
    paragraph2:
      "Whatever the occasion, every tier includes free delivery and full chafing setup — sternos, stands, and serving utensils — so the only planning left is the guest list. Need something the packages don't quite cover? The custom quote form below gets a real reply within one business day.",
    recommendedPackage: "Signature",
  },
];

export function findCateringEventType(slug: string): CateringEventType | undefined {
  return cateringEventTypes.find((e) => e.slug === slug);
}
