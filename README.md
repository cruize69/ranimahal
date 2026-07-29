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
2. **Photos** — `public/images/**` are generated SVG placeholders (warm
   gradient washes, no text), sized to the exact crops the layouts expect so
   real photography drops in without touching CSS. See "Updating photos".
3. **External URLs** — `src/content/restaurant.ts` has placeholder links for
   `orderOnline`, `buffetReservation`, and `googleReserve`, plus an
   approximate `geo` lat/long. Search that file for `TODO` and fill in the
   real values before launch.

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

Real photography replaces the SVGs in `public/images/`. Shoot or crop to the
aspect ratio listed — the layouts are built around these, so matching them
means no CSS changes:

| Path | Crop | Used by |
| --- | --- | --- |
| `hero.svg` | 4:5 portrait | Home hero (full-bleed) |
| `signature/*.svg` | 4:5 portrait | Home "What we're known for" cards |
| `menu-sections/<id>.svg` | 16:9 | Menu section banners (one per section) |
| `band-tandoor.svg`, `band-spices.svg`, `band-buffet.svg` | 21:9 wide | Full-bleed bands |
| `about-hero.svg` | 2:1 wide | About page hero |
| `about-kitchen.svg`, `about-spices.svg` | 4:5 portrait | About page sections |
| `exterior.svg` | 5:3 | Contact page hero |
| `gallery/*.svg` | mixed (see `gallery.ts`) | Gallery masonry |
| `og-home.svg`, `og-menu.svg` | 1200×630 | Social share cards |

Shoot dark-ish or with room to darken: the design places light text over
images with a gradient scrim, so busy or very bright photos hurt legibility.

**Quick swap (same filenames):** drop JPG/PNG files at the same paths and
update the extension where the path is referenced — `src/content/gallery.ts`,
`src/content/featured.ts`, `src/content/menu.ts` (each section's `image.src`),
and the literal `src="/images/..."` strings in the page files.

**Vercel Blob (recommended once the shoot is organized):** upload each photo
to your Blob store, then swap the `src` values above for the Blob URLs
(`https://<store-id>.public.blob.vercel-storage.com/...`). The Blob hostname
pattern is already allow-listed in `next.config.ts` — update the wildcard
there with your store's exact hostname.

**Get blur placeholders:** once photos are JPG/PNG, switch from a string
`src` to a static import (`import heroImg from "@/images/hero.jpg"`,
picture files placed outside `public/`, e.g. in `src/images/`) and add
`placeholder="blur"` to the `<Image>` — Next.js generates the blur data URL
automatically for statically-imported raster images. This doesn't apply to
the current SVG placeholders.

## Reservations & ordering

This site links out to existing systems rather than rebuilding them:

- **Order Online** buttons → `restaurant.links.orderOnline` (your
  Stripe/Clerk ordering app)
- **Sunday Buffet** reservation → `restaurant.links.buffetReservation` (your
  existing Stripe card-hold flow)
- **Regular dining reservations** → `restaurant.links.googleReserve`. Set
  this up once via Google Business Profile → Bookings, then paste the
  resulting link in.

All three live in `src/content/restaurant.ts`.

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
