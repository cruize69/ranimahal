import { readFileSync, writeFileSync } from "node:fs";

const raw = readFileSync(process.argv[2], "utf8");
const data = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
const esc = (s) => clean(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const slug = (s) =>
  clean(s)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Section id -> the photo that heads it on the menu page. Identified visually
// from the photo library; see src/content/images.ts.
const SECTION_PHOTO = {
  "vegetarian-appetizers": ["30.JPG", "Samosas with shredded salad"],
  "non-vegetarian-appetizers": ["31.JPG", "Chili chicken with cucumber and lemon"],
  "soups-and-salads": ["27.JPG", "Saag — slow-cooked spinach with fresh tomato"],
  vegetarian: ["10.jpg", "Mixed vegetables in a copper karahi"],
  chicken: ["29.JPG", "Butter chicken in a creamy tomato gravy"],
  lamb: ["21.JPG", "Red curry finished with onion and cilantro"],
  tandoori: ["25.JPG", "Tandoori chicken with red onion and lemon"],
  seafood: ["22.JPG", "Shrimp in a delicate cream sauce"],
  medley: ["20.JPG", "Creamy tomato curry with scallions"],
  "side-dishes": ["4a.jpg", "Vegetable karahi with fresh peppers"],
  breads: ["26.JPG", "Naan fresh from the tandoor"],
  beverages: ["7a.jpg", "Appetizers with wine poured"],
  dessert: ["28.JPG", "Golden korma with peppers and cashew"],
};

// Heuristic tagging from item name + description. Deliberately conservative:
// only tags we can defend from the restaurant's own wording.
function tagsFor(name, desc, sectionId) {
  const t = new Set();
  const s = `${name} ${desc}`.toLowerCase();

  const vegSection = ["vegetarian", "vegetarian-appetizers", "breads", "beverages", "dessert", "soups-and-salads", "side-dishes"];
  const meaty = /chicken|lamb|goat|shrimp|fish|lobster|meat|keema|kemma|seek|boti|kabab|kebab/.test(s);
  if (vegSection.includes(sectionId) && !meaty) t.add("veg");

  if (/very spicy|very hot|hot spicy|phaal|vindaloo/.test(s)) t.add("spicy");
  if (/\(mild\)|mildly spiced|mild spices|delicately spiced/.test(s)) t.add("mild");
  if (/child friendly/.test(s)) t.add("child-friendly");
  if (/low fat/.test(s)) t.add("low-fat");
  if (/tandoor/.test(s)) t.add("tandoor");

  return [...t];
}

const sections = [];
const catering = [];

for (const carte of data.cartes) {
  const name = clean(carte.carte.en);
  const id = slug(name);

  if (id === "catering") {
    for (const cat of carte.categories) {
      catering.push({
        group: clean(cat.category.en).replace(/^Catering\s*/i, "").trim(),
        items: cat.menuItems.map((m) => clean(m.menuItem.en)),
      });
    }
    continue;
  }

  const groups = carte.categories.map((cat) => ({
    name: clean(cat.category.en),
    note: clean(cat.description?.en),
    items: cat.menuItems.map((m) => ({
      name: clean(m.menuItem.en),
      price: m.price,
      description: clean(m.description?.en),
      tags: tagsFor(clean(m.menuItem.en), clean(m.description?.en), id),
    })),
  }));

  sections.push({ id, name, groups });
}

// De-duplicate: the source has one item entered twice under slightly
// different spellings ("Kemma Dosa" with no description, "Keema Dosa" with
// one). Drop entries whose name is a near-duplicate AND has no description.
for (const s of sections) {
  for (const g of s.groups) {
    const seen = new Map();
    g.items = g.items.filter((it) => {
      const key = it.name.toLowerCase().replace(/[^a-z]/g, "");
      const near = [...seen.keys()].find(
        (k) => k === key || (Math.abs(k.length - key.length) <= 1 && levenshtein(k, key) <= 1)
      );
      if (near) {
        const prev = seen.get(near);
        // keep whichever has a description
        if (!prev.description && it.description) {
          Object.assign(prev, it);
        }
        return false;
      }
      seen.set(key, it);
      return true;
    });
  }
}

function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

const total = sections.reduce((a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0), 0);

const lines = [];
lines.push(`// THE COMPLETE RANI MAHAL MENU — ${total} items across ${sections.length} sections.`);
lines.push(`//`);
lines.push(`// GENERATED, DO NOT HAND-EDIT CASUALLY. Source of truth is the live EdgeServ`);
lines.push(`// ordering system: https://webmenu.edgeservpos.com/ranimahal/data/digital.json`);
lines.push(`// (base64-encoded JSON). Names, prices, and descriptions are exactly as the`);
lines.push(`// restaurant has them there, so the site can never disagree with the cart.`);
lines.push(`// Re-run the generator in the scratchpad to refresh after a menu change.`);
lines.push(`//`);
lines.push(`// \`tags\` are derived heuristically from the restaurant's own wording`);
lines.push(`// (e.g. "very spicy" -> spicy, a meat-free section -> veg). They are a`);
lines.push(`// convenience for filtering, not an allergen guarantee.`);
lines.push(``);
lines.push(`import { photo } from "@/content/images";`);
lines.push(``);
lines.push(`export type MenuTag =`);
lines.push(`  | "veg"`);
lines.push(`  | "spicy"`);
lines.push(`  | "mild"`);
lines.push(`  | "child-friendly"`);
lines.push(`  | "low-fat"`);
lines.push(`  | "tandoor";`);
lines.push(``);
lines.push(`export type MenuItem = {`);
lines.push(`  name: string;`);
lines.push(`  /** Dollars. Format at render time, never store a formatted string. */`);
lines.push(`  price: number;`);
lines.push(`  description: string;`);
lines.push(`  tags: MenuTag[];`);
lines.push(`};`);
lines.push(``);
lines.push(`export type MenuGroup = {`);
lines.push(`  name: string;`);
lines.push(`  /** Kitchen note shown under the group heading, if any. */`);
lines.push(`  note: string;`);
lines.push(`  items: MenuItem[];`);
lines.push(`};`);
lines.push(``);
lines.push(`export type MenuSection = {`);
lines.push(`  id: string;`);
lines.push(`  name: string;`);
lines.push(`  image: { src: string; alt: string };`);
lines.push(`  groups: MenuGroup[];`);
lines.push(`};`);
lines.push(``);
lines.push(`export const menu: MenuSection[] = [`);

for (const s of sections) {
  const pick = SECTION_PHOTO[s.id];
  if (!pick) throw new Error(`No photo mapped for section "${s.id}"`);
  lines.push(`  {`);
  lines.push(`    id: "${s.id}",`);
  lines.push(`    name: "${esc(s.name)}",`);
  lines.push(`    image: { src: photo("${pick[0]}"), alt: "${esc(pick[1])}" },`);
  lines.push(`    groups: [`);
  for (const g of s.groups) {
    lines.push(`      {`);
    lines.push(`        name: "${esc(g.name)}",`);
    lines.push(`        note: "${esc(g.note)}",`);
    lines.push(`        items: [`);
    for (const it of g.items) {
      const tags = it.tags.length ? `[${it.tags.map((t) => `"${t}"`).join(", ")}]` : "[]";
      lines.push(`          {`);
      lines.push(`            name: "${esc(it.name)}",`);
      lines.push(`            price: ${it.price},`);
      lines.push(`            description: "${esc(it.description)}",`);
      lines.push(`            tags: ${tags},`);
      lines.push(`          },`);
    }
    lines.push(`        ],`);
    lines.push(`      },`);
  }
  lines.push(`    ],`);
  lines.push(`  },`);
}
lines.push(`];`);
lines.push(``);
lines.push(`/** Flat list of every item, for search and counts. */`);
lines.push(`export const allMenuItems = menu.flatMap((s) =>`);
lines.push(`  s.groups.flatMap((g) => g.items.map((i) => ({ ...i, sectionId: s.id, sectionName: s.name })))`);
lines.push(`);`);
lines.push(``);
lines.push(`/** Catering is quoted per tray, so these carry no prices. */`);
lines.push(`export const cateringGroups: { group: string; items: string[] }[] = [`);
for (const c of catering) {
  lines.push(`  {`);
  lines.push(`    group: "${esc(c.group)}",`);
  lines.push(`    items: [${c.items.map((i) => `"${esc(i)}"`).join(", ")}],`);
  lines.push(`  },`);
}
lines.push(`];`);
lines.push(``);

writeFileSync(process.argv[3], lines.join("\n"), "utf8");

console.log(`sections: ${sections.length}`);
console.log(`items:    ${total}`);
console.log(`catering: ${catering.reduce((a, c) => a + c.items.length, 0)} in ${catering.length} groups`);
for (const s of sections) {
  console.log(`  ${s.id.padEnd(28)} ${s.groups.reduce((a, g) => a + g.items.length, 0)}`);
}
