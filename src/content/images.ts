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
