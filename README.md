# Rani Mahal — Website

Marketing site for Rani Mahal (327 Mamaroneck Ave, Mamaroneck, NY 10543).
Next.js 16 (App Router), TypeScript, Tailwind CSS v4. Content lives in typed
files under `src/content/` so it can be edited without touching page code.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build + type check
npm run lint     # ESLint
npm run start    # serve the production build locally
```

## What's here vs. what's a placeholder

This scaffold is fully functional today but ships with **placeholder content**
in three places, each marked `TODO` in the source:

1. **Menu items** — `src/content/menu.ts` has the real 11-section structure
   with 2 sample items per section. Replace with the full 98-item export from
   the ordering system.
2. **Photos** — real, but **hot-linked from the old ranimahalny.com site**
   (see "Where the photos come from"). One slot has no real photo: the
   Desserts menu section still uses a generated SVG.
3. **External URLs** — `orderOnline`, `giftCards`, and `facebook` in
   `src/content/restaurant.ts` are confirmed live URLs. `buffetReservation`,
   `googleReserve`, `instagram`, and the `geo` lat/long are still
   placeholders — search that file for `TODO`.
4. **Hours** — the values in `restaurant.ts` do **not** match the old site,
   which contradicts itself (see "Hours discrepancy").

## Where the photos come from

Every photo is served straight from the existing site's asset folder —
`https://www.ranimahalny.com/assets/img/...` — via the `photo()` helper in
`src/content/images.ts`. That hostname is allow-listed in `next.config.ts`.

**This is a temporary arrangement.** If that host goes away, every image on
this site breaks. To move them:

1. Upload the same files somewhere you control (Vercel Blob, S3, …).
2. Change `PHOTO_BASE` in `src/content/images.ts` to the new prefix.
3. Add the new hostname to `remotePatterns` in `next.config.ts`.

Nothing else references image URLs directly, so those three steps are the
whole migration.

Two things to know about the current originals: they max out around 1190px
wide, so `deviceSizes` in `next.config.ts` is capped at 1200 to avoid
pointless upscaling (the old host times out generating a 3840px variant).
And the filenames (`25.JPG`, `8a.jpg`, …) carry no meaning — every dish name
and alt text was **identified visually from the photo**, so have the kitchen
confirm them before launch.

## Hours discrepancy

The old site states two different sets of hours, and neither matches what is
currently in `restaurant.ts`:

| Source | Hours |
| --- | --- |
| `contact.htm` | Mon–Sun, 11:30 am – 2:30 pm and 5:00 – 9:00 pm |
| `about.htm` | Dinner Mon–Sat 5–10 pm; Sun 5–9 pm |
| `restaurant.ts` (this site) | Dinner Mon–Sat, plus a Sunday buffet 12–3 |

Confirm the real hours and update `restaurant.ts`. Note that the split
lunch/dinner service on `contact.htm` needs a second time range per day —
`DayHours` currently supports only one, so that shape has to change to
express it (and the Schema.org `openingHoursSpecification` with it).

## Updating hours

Edit the `hours` array in `src/content/restaurant.ts`. Every page (hours
strip, footer, reservations, contact, and the Schema.org JSON-LD) reads from
this one array — nothing else needs to change. Give a day a `label` (as
Sunday does, `"Sunday Buffet"`) to have it call itself out separately in the
UI.

## Updating the menu

Edit `src/content/menu.ts`. Each section is `{ id, name, description?, items }`
and each item is `{ name, description, price, tags? }`. `tags` accepts
`"veg" | "vegan" | "gluten-free" | "spicy" | "chef-pick"` and renders as a
small pill next to the item name. Section order in the file is the order
they render on `/menu`, including the jump-link nav at the top of the page.

## Updating photos

Which photo appears where, and the crop each slot applies. New photography
that matches these ratios drops in with no CSS changes:

| Slot | Crop | Set in |
| --- | --- | --- |
| Home hero (full-bleed) | 4:5 portrait | `src/app/page.tsx` |
| Home "What we're known for" | 4:5 portrait | `src/content/featured.ts` |
| Menu section banners | 3:1 wide | `src/content/menu.ts` (`image` per section) |
| Full-bleed bands | 21:9 wide | `src/app/page.tsx`, `reservations/page.tsx` |
| About hero | 2:1 wide | `src/app/about/page.tsx` |
| About side images | 4:5 portrait | `src/app/about/page.tsx` |
| Visit hero | 5:3 | `src/app/contact/page.tsx` |
| Gallery masonry | mixed — `width`/`height` must be the true pixel size | `src/content/gallery.ts` |
| Social share cards | 1200×630 | `public/images/og-*.svg` |

Shoot dark-ish or with room to darken: the design places light text over
images with a gradient scrim. The current photos are bright and flash-lit,
which is why the scrims are as heavy as they are — softer, darker photography
would let those come back down.

**Missing shots.** Worth adding when there's a chance: desserts (the only
section with no real photo), a clean storefront exterior, and anything of
the kitchen or tandoor itself.

**Swapping an individual photo:** change the filename passed to `photo()` at
the location listed above. To point at a different host entirely, see "Where
the photos come from".

**Get blur placeholders:** blur data URLs are generated automatically only
for images imported statically from the repo. Since these are remote URLs,
adding `placeholder="blur"` also requires a `blurDataURL` — generate them at
build time, or move the files into the repo and use static imports.

## Reservations & ordering

This site links out to existing systems rather than rebuilding them. All of
these live in `src/content/restaurant.ts`:

- **Order Online** → `links.orderOnline`, pointing at the live EdgeServ
  ordering system (`webmenu.edgeservpos.com/ranimahal`). Confirmed working.
- **Gift Cards** → `links.giftCards` (`ranimahalny.instagift.com`). Confirmed.
- **Sunday Buffet** → `links.buffetReservation`. Still a placeholder — point
  it at your Stripe card-hold flow.
- **Regular reservations** → `links.googleReserve`. Still a placeholder. Set
  up Google Business Profile → Bookings, then paste the link in.
- **Instagram** → `social.instagram` is empty, so the footer link is hidden
  and it's dropped from the Schema.org `sameAs`. Add the handle to bring it
  back.

## SEO

- `src/components/StructuredData.tsx` emits Schema.org `Restaurant` JSON-LD
  on every page, sourced entirely from `restaurant.ts`. After filling in the
  real `geo` coordinates and URLs, validate at
  [Google's Rich Results Test](https://search.google.com/test/rich-results).
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and
  `/robots.txt` automatically from the route list.
- OpenGraph/Twitter card metadata is set in `src/app/layout.tsx` (site-wide
  default) and overridden per-page in each `page.tsx`'s `metadata` export.

## Analytics

[Vercel Analytics](https://vercel.com/analytics) is wired up in
`src/app/layout.tsx`. It activates automatically once deployed to Vercel —
no extra config needed, and nothing to do for local dev.

## Deploying

```bash
npx vercel deploy
```

Or connect the repo in the Vercel dashboard for git-based deploys. Set the
`BLOB_READ_WRITE_TOKEN` env var (see `.env.example`) only if you're scripting
uploads to Vercel Blob — the site itself just needs public image URLs.
