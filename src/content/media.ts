// Single registry for every "structural" media slot on the site — the
// one-off hero banners, editorial panels, and background video that live
// directly in a page or component, as distinct from the per-item content
// arrays (gallery.ts, menu.ts, featured.ts) that already serve that role
// for their own repeating content. Those aren't duplicated here.
//
// To replace a photo or video:
//   1. Drop the new file in public/ (or, for a real photo(), get it hosted
//      and swap the filename — see src/content/images.ts).
//   2. Update the one entry below — src, poster, and any grading
//      (zoom/objectPosition/contrast/etc.) that was tuned for the old file.
// Nothing else needs to change — every consumer imports from here.
//
// See also /dev/media-manager (local dev only — 404s outside `next dev`,
// never part of the deployed site) for a visual view of every slot below
// next to its current asset and detected pixel dimensions.

import { photo, aiConcept } from "@/content/images";

type Grading = {
  /** Video only. */
  playbackRate?: number;
  /** CSS transform scale — only needed to crop a portrait-shot clip/photo
   * into a landscape slot. Omit entirely for footage already shot to fit. */
  zoom?: number;
  /** CSS object-position — pairs with `zoom` to aim at a specific band of
   * a portrait source. Omit for footage already framed to fit. */
  objectPosition?: string;
  contrast?: number;
  saturate?: number;
  brightness?: number;
};

export type MediaImage = Grading & {
  kind: "image";
  id: string;
  label: string;
  src: string;
  alt: string;
  usedIn: string;
  aspect: string;
  notes?: string;
};

export type MediaVideo = Grading & {
  kind: "video";
  id: string;
  label: string;
  src: string;
  poster: string;
  usedIn: string;
  aspect: string;
  notes?: string;
};

export type MediaEntry = MediaImage | MediaVideo;

// ── Home hero — three clips, crossfading in this order ──────────────────
// All three currently play at 0.75x — full slow motion (0.35x) read as the
// page being stuck; a slight ease-off instead of full speed reads as
// deliberate without looking frozen. See HomeHero.tsx for the crossfade
// mechanics themselves — this is just which files and how they're graded.
export const heroFlame: MediaVideo = {
  kind: "video",
  id: "hero-flame",
  label: "Hero — flame",
  src: "/videos/tandoor-oven-burning.mp4",
  poster: "/videos/tandoor-oven-burning-poster.jpg",
  usedIn: "Home hero, clip 1 of 3 (src/app/page.tsx)",
  aspect: "Fills the full viewport — landscape source (~16:9 or wider) needs no zoom/objectPosition at all.",
  notes: "Portrait phone clip, force-cropped. Already dark and low-key as shot, so only a light contrast touch.",
  playbackRate: 0.75,
  zoom: 1.05,
  contrast: 1.08,
  saturate: 1.05,
};

export const heroSkewers1: MediaVideo = {
  kind: "video",
  id: "hero-skewers-1",
  label: "Hero — tandoori skewers, angle 1",
  src: "/videos/tandoori-skewers-1.mp4",
  poster: "/videos/tandoori-skewers-1-poster.jpg",
  usedIn: "Home hero, clip 2 of 3 (src/app/page.tsx)",
  aspect: "Same slot as hero-flame — landscape source drops in with no cropping needed.",
  notes: "Already vivid and well-lit as shot — barely needs grading.",
  playbackRate: 0.75,
  contrast: 1.05,
  saturate: 1.03,
};

export const heroSkewers2: MediaVideo = {
  kind: "video",
  id: "hero-skewers-2",
  label: "Hero — tandoori skewers, angle 2",
  src: "/videos/tandoori-skewers-2.mp4",
  poster: "/videos/tandoori-skewers-2-poster.jpg",
  usedIn: "Home hero, clip 3 of 3 (src/app/page.tsx)",
  aspect: "Same slot as hero-flame.",
  notes: "Same subject as hero-skewers-1, different angle — extends that beat before cutting back to the flame.",
  playbackRate: 0.75,
  contrast: 1.05,
  saturate: 1.03,
};

export const heroVideos: MediaVideo[] = [heroFlame, heroSkewers1, heroSkewers2];

// ── Home atmosphere band — single looping clip ───────────────────────────
export const footageBand: MediaVideo = {
  kind: "video",
  id: "footage-band",
  label: "Atmosphere band — flame close-up",
  src: "/videos/tandoor-oven-burning.mp4",
  poster: "/videos/tandoor-oven-burning-poster.jpg",
  usedIn: "Home, between Signature Dishes and the menu grid (src/app/page.tsx, via FootageBand)",
  aspect: "Short wide strip (h-48 to h-72) — a landscape clip needs no zoom/objectPosition tuning.",
  notes: "Portrait clip zoomed in tight on the flame so the visible band is mostly fire, not oven wall.",
  zoom: 1.75,
  objectPosition: "50% 60%",
  contrast: 1.1,
  saturate: 1.05,
};

// ── Promo toast ───────────────────────────────────────────────────────
export const promoSeniorTuesdays: MediaImage = {
  kind: "image",
  id: "promo-senior-tuesdays",
  label: "Senior Tuesdays promo photo",
  src: "/images/promo/senior-tuesdays.jpg",
  alt: "Guests enjoying dinner together at Rani Mahal",
  usedIn: "Home, Senior Tuesdays toast (src/components/SeniorTuesdaysModal.tsx)",
  aspect: "Small square, ~64×64px rendered — a centered, tightly-cropped shot reads best at that size.",
};

// ── Page heroes — one full-bleed banner per page ─────────────────────────
export const aboutHero: MediaImage = {
  kind: "image",
  id: "about-hero",
  label: "About — page hero",
  src: photo("18.jpg"),
  alt: "Rani Mahal dining room",
  usedIn: "About page hero (src/app/about/page.tsx)",
  aspect: "Full-bleed, tall (min-h-[75svh]). Leave room for the headline in the lower-left.",
};

export const contactHero: MediaImage = {
  kind: "image",
  id: "contact-hero",
  label: "Visit — page hero",
  src: photo("24.JPG"),
  alt: "Rani Mahal at 327 Mamaroneck Ave",
  usedIn: "Contact page hero (src/app/contact/page.tsx)",
  aspect: "Full-bleed (min-h-[55svh]).",
};

export const galleryHero: MediaImage = {
  kind: "image",
  id: "gallery-hero",
  label: "Gallery — page hero",
  src: photo("29.JPG"),
  alt: "Butter chicken at Rani Mahal",
  usedIn: "Gallery page hero (src/app/gallery/page.tsx)",
  aspect: "Full-bleed (min-h-[55svh]). Soft overlay — no bottom text scrim needed.",
};

export const menuHero: MediaImage = {
  kind: "image",
  id: "menu-hero",
  label: "Menu — page header",
  src: photo("27.JPG"),
  alt: "Saag at Rani Mahal",
  usedIn: "Menu page header (src/app/menu/page.tsx)",
  aspect: "Full-bleed (min-h-[50svh]).",
};

export const reservationsHero: MediaImage = {
  kind: "image",
  id: "reservations-hero",
  label: "Reservations — page header",
  src: photo("4.jpg"),
  alt: "A table set with wine and appetizers",
  usedIn: "Reservations page header (src/app/reservations/page.tsx)",
  aspect: "Full-bleed (min-h-[50svh]).",
};

// The rani-feast.jpg photo is the same curated spread shot already used on
// the Rani Feast package card (see CateringPackagesGrid / cateringPackages.ts)
// — reused here rather than a new asset so the hero and the top-tier card
// visually agree.
export const cateringHero: MediaImage = {
  kind: "image",
  id: "catering-hero",
  label: "Catering — page header",
  src: "/catering/rani-feast.jpg",
  alt: "A Rani Feast catering spread — tandoori starters, curries, biryani and naan laid out for a group",
  usedIn: "Catering page header (src/app/catering/page.tsx)",
  aspect: "Full-bleed (min-h-[50svh]). Same photo used on the Rani Feast package card.",
};

// ── Editorial banners and panels ─────────────────────────────────────────
export const aboutCurryPanel: MediaImage = {
  kind: "image",
  id: "about-curry-panel",
  label: "About — kitchen panel",
  src: photo("8a.jpg"),
  alt: "Curry served with naan",
  usedIn: 'About page, "The Kitchen" split panel (src/app/about/page.tsx)',
  aspect: "Half-width panel, min-h-[28rem] to [36rem] — portrait or square crops well.",
};

export const aboutPaintingPanel: MediaImage = {
  kind: "image",
  id: "about-painting-panel",
  label: "About — room panel",
  src: photo("23.JPG"),
  alt: "Framed painting in the Rani Mahal dining room",
  usedIn: 'About page, "The Room" split panel (src/app/about/page.tsx)',
  aspect: "Half-width panel, min-h-[28rem] to [36rem].",
};

export const aboutBottomBanner: MediaImage = {
  kind: "image",
  id: "about-bottom-banner",
  label: "About — wide atmosphere band",
  src: photo("4.jpg"),
  alt: "Table set with wine and appetizers",
  usedIn: "About page, wide band above the closing CTA (src/app/about/page.tsx)",
  aspect: "Full-bleed wide strip (h-[50svh]).",
};

export const contactDiningBanner: MediaImage = {
  kind: "image",
  id: "contact-dining-banner",
  label: "Visit — dining room banner",
  src: photo("18.jpg"),
  alt: "Rani Mahal dining room",
  usedIn: "Contact page, wide band below the address/map (src/app/contact/page.tsx)",
  aspect: "Full-bleed wide strip (h-[40svh]).",
};

export const reservationsTablesPanel: MediaImage = {
  kind: "image",
  id: "reservations-tables-panel",
  label: "Reservations — lunch & dinner card",
  src: photo("18.jpg"),
  alt: "Tables laid with pink linen",
  usedIn: 'Reservations page, "Lunch & Dinner" card (src/app/reservations/page.tsx)',
  aspect: "16:10 card image.",
};

export const reservationsBuffetPanel: MediaImage = {
  kind: "image",
  id: "reservations-buffet-panel",
  label: "Reservations — Sunday buffet card",
  src: photo("4.jpg"),
  alt: "A table set with wine and appetizers",
  usedIn: 'Reservations page, "Sunday Buffet" card (src/app/reservations/page.tsx)',
  aspect: "16:10 card image.",
};

export const footerBand: MediaImage = {
  kind: "image",
  id: "footer-band",
  label: "Footer photo band",
  src: photo("2.jpg"),
  alt: "Curry and wine at Rani Mahal",
  usedIn: "Sitewide footer (src/components/Footer.tsx)",
  aspect: "Full-bleed wide strip (h-48 to h-64).",
};

export const homeSundayBuffetPanel: MediaImage = {
  kind: "image",
  id: "home-sunday-buffet-panel",
  label: "Home — Sunday buffet panel",
  src: aiConcept("dining-room.png"),
  alt: "Concept: dining room, dark studio lighting",
  usedIn: "Home page, Sunday Buffet split panel (src/app/page.tsx)",
  aspect: "Half-width panel, min-h-80 to full height.",
  notes: "Still an AI-concept placeholder (see src/content/images.ts) — swap for a real photo before this ships.",
};

// Every entry above, for /dev/media-manager.
export const mediaRegistry: MediaEntry[] = [
  heroFlame,
  heroSkewers1,
  heroSkewers2,
  footageBand,
  promoSeniorTuesdays,
  aboutHero,
  contactHero,
  galleryHero,
  menuHero,
  reservationsHero,
  cateringHero,
  aboutCurryPanel,
  aboutPaintingPanel,
  aboutBottomBanner,
  contactDiningBanner,
  reservationsTablesPanel,
  reservationsBuffetPanel,
  footerBand,
  homeSundayBuffetPanel,
];
