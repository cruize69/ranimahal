// Real, verified nearby Westchester County towns/villages (plus Greenwich,
// CT, just over the state line) — cross-checked against multiple independent
// sources before adding. `note` is honest relative geography (direction/
// distance), never a fabricated exact drive time. Used for the visible
// "Areas We Serve" page, the Restaurant schema's `areaServed`, and llms.txt —
// single source, so all three always agree.

export type AreaServed = {
  name: string;
  state: "NY" | "CT";
  note: string;
  // Genuinely distinguishing, publicly-known context about the town itself
  // (its character, what kind of catering it typically calls for) — not a
  // fabricated claim about our own event history there. This is what gives
  // each /catering/[area] page real unique content instead of a find-and-
  // replace on the town name; see that page for how it's used.
  context: string;
  popularFor: string;
};

// Kebab-case slug for per-area URLs (e.g. /catering/[area]) — computed
// rather than hand-typed so it can never drift from the display name.
export function areaSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const areasServed: AreaServed[] = [
  {
    name: "Mamaroneck", state: "NY",
    note: "Home base — 327 Mamaroneck Ave.",
    context: "Our home kitchen sits right on Mamaroneck Avenue, minutes from the harbor.",
    popularFor: "office lunches, harbor-side celebrations, and everything in between",
  },
  {
    name: "Larchmont", state: "NY",
    note: "The village just south of Mamaroneck.",
    context: "A walkable village built around its downtown and Larchmont Harbor.",
    popularFor: "engagement parties, baby and bridal showers, and waterfront gatherings",
  },
  {
    name: "Rye", state: "NY",
    note: "Just across the Mamaroneck River to the east.",
    context: "Home to Rye Playland and a lively downtown strip along Purchase Street.",
    popularFor: "birthday parties, family reunions, and Rye Golf Club or backyard events",
  },
  {
    name: "Rye Brook", state: "NY",
    note: "A short drive northeast of Mamaroneck.",
    context: "A corporate-office hub along the I-287 corridor.",
    popularFor: "business lunches, off-site meetings, and office holiday parties",
  },
  {
    name: "Port Chester", state: "NY",
    note: "Just north of Mamaroneck.",
    context: "A dense, walkable downtown known for its restaurant row and Capitol Theatre.",
    popularFor: "community events, after-work gatherings, and larger group celebrations",
  },
  {
    name: "Harrison", state: "NY",
    note: "Bordering Mamaroneck to the east.",
    context: "Home to a large corporate office park along Westchester Ave.",
    popularFor: "corporate catering, business meetings, and company milestones",
  },
  {
    name: "New Rochelle", state: "NY",
    note: "About ten minutes southwest of Mamaroneck.",
    context: "One of Westchester's largest cities, with a growing downtown.",
    popularFor: "school and community functions, graduations, and larger receptions",
  },
  {
    name: "Scarsdale", state: "NY",
    note: "A short drive west of Mamaroneck.",
    context: "An affluent residential village known for its school district.",
    popularFor: "milestone birthdays, PTA and school events, and at-home dinner parties",
  },
  {
    name: "White Plains", state: "NY",
    note: "The Westchester County seat, a short drive northwest.",
    context: "The county's downtown business and government district.",
    popularFor: "corporate catering, office parties, and courthouse or law-firm functions",
  },
  {
    name: "Eastchester", state: "NY",
    note: "West of Mamaroneck, in central Westchester.",
    context: "A residential town in central Westchester.",
    popularFor: "backyard parties, graduation celebrations, and family milestones",
  },
  {
    name: "Bronxville", state: "NY",
    note: "Southwest of Mamaroneck.",
    context: "A small, walkable village centered around its Metro-North station.",
    popularFor: "engagement parties, intimate celebrations, and village-center events",
  },
  {
    name: "Pelham", state: "NY",
    note: "Southwest of Mamaroneck, near New Rochelle.",
    context: "A quiet residential village near the Long Island Sound.",
    popularFor: "backyard gatherings, neighborhood block parties, and birthdays",
  },
  {
    name: "Pelham Manor", state: "NY",
    note: "Adjacent to Pelham, southwest of Mamaroneck.",
    context: "A quiet residential village bordering Pelham.",
    popularFor: "backyard gatherings, family celebrations, and neighborhood events",
  },
  {
    name: "Greenwich", state: "CT",
    note: "Just over the state line, a short drive northeast.",
    context: "An affluent Connecticut town along the Greenwich Ave corridor, just over the state line.",
    popularFor: "private estate events, corporate functions, and milestone celebrations",
  },
];
