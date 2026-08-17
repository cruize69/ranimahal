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
};

// Kebab-case slug for per-area URLs (e.g. /catering/[area]) — computed
// rather than hand-typed so it can never drift from the display name.
export function areaSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const areasServed: AreaServed[] = [
  { name: "Mamaroneck", state: "NY", note: "Home base — 327 Mamaroneck Ave." },
  { name: "Larchmont", state: "NY", note: "The village just south of Mamaroneck." },
  { name: "Rye", state: "NY", note: "Just across the Mamaroneck River to the east." },
  { name: "Rye Brook", state: "NY", note: "A short drive northeast of Mamaroneck." },
  { name: "Port Chester", state: "NY", note: "Just north of Mamaroneck." },
  { name: "Harrison", state: "NY", note: "Bordering Mamaroneck to the east." },
  { name: "New Rochelle", state: "NY", note: "About ten minutes southwest of Mamaroneck." },
  { name: "Scarsdale", state: "NY", note: "A short drive west of Mamaroneck." },
  { name: "White Plains", state: "NY", note: "The Westchester County seat, a short drive northwest." },
  { name: "Eastchester", state: "NY", note: "West of Mamaroneck, in central Westchester." },
  { name: "Bronxville", state: "NY", note: "Southwest of Mamaroneck." },
  { name: "Pelham", state: "NY", note: "Southwest of Mamaroneck, near New Rochelle." },
  { name: "Pelham Manor", state: "NY", note: "Adjacent to Pelham, southwest of Mamaroneck." },
  { name: "Greenwich", state: "CT", note: "Just over the state line, a short drive northeast." },
];
