// Photography currently hot-links to the existing ranimahalny.com site, which
// is where every real photo the restaurant has is hosted today.
//
// MIGRATING LATER: upload the same files to Vercel Blob (or any host), change
// PHOTO_BASE to the new prefix, and add that hostname to `remotePatterns` in
// next.config.ts. Nothing else needs to change — every page reads image paths
// through `photo()`.
//
// The filenames are the originals (2.jpg, 25.JPG, …) and carry no meaning; the
// dish names below were identified visually from the photos, so double-check
// them against the kitchen before launch.

export const PHOTO_BASE = "https://www.ranimahalny.com/assets/img";

export const photo = (file: string) => `${PHOTO_BASE}/${file}`;

// AI-GENERATED — TEMPORARY. These are synthetic images (not photographs of
// this restaurant's actual food), used only to preview a darker, moodier art
// direction ahead of a real photoshoot. Do not use anywhere a visitor could
// reasonably read "this is what I'll be served" without that being true —
// see the full thali platter's fabricated tray engraving and the real wine
// brand depicted on it for exactly the kind of detail that must NOT ship.
// Every use of `aiConcept()` in the codebase should be swapped for a real
// photo (via `photo()` or a local upload) before this goes live.
export const aiConcept = (file: string) => `/images/ai-concept/${file}`;
