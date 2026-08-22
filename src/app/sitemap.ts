import type { MetadataRoute } from "next";
import { restaurant } from "@/content/restaurant";
import { getAllPosts } from "@/lib/blog";
import { areasServed, areaSlug } from "@/content/areasServed";
import { cateringEventTypes } from "@/content/cateringEventTypes";

// lastModified is a real, stable date per route — NOT new Date() evaluated
// at request time. A sitemap that claims every page changed "right now" on
// every single crawl is a signal Google treats as untrustworthy noise (it
// can't tell what's actually new), which wastes crawl budget instead of
// earning it. Bump a route's date by hand when that page's real content
// meaningfully changes — the menu page is the only one expected to move
// often, hence its own weekly-changefreq entry below.
const routes: { path: string; lastModified: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 1 },
  { path: "/menu", lastModified: "2026-08-17", changeFrequency: "weekly", priority: 0.9 },
  { path: "/family-meals", lastModified: "2026-08-22", changeFrequency: "weekly", priority: 0.85 },
  { path: "/catering", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.8 },
  { path: "/order", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.9 },
  // /order/catering deliberately omitted: it's now just a client-side
  // redirect to /catering (no real content, see ranimahal-backend's
  // main.jsx ROUTES table) — /catering above is the one canonical page.
  { path: "/order/rewards", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.6 },
  { path: "/reservations", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/gallery", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/areas-we-serve", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", lastModified: "2026-08-17", changeFrequency: "weekly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = routes.map((route) => ({
    url: `${restaurant.url}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // One entry per published post — draft posts live in a separate
  // untracked directory (src/content/blog/drafts) and getAllPosts() never
  // reads it, so this can't leak an unpublished draft into the sitemap.
  // lastModified comes straight from the post's own frontmatter date
  // rather than build time, for the same "don't lie to the crawler" reason
  // the static routes above use fixed dates.
  const postEntries = getAllPosts().map((post) => ({
    url: `${restaurant.url}/blog/${post.slug}`,
    lastModified: post.frontmatter.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // One real, unique page per town we cater to (see areasServed.ts and
  // src/app/catering/[area]/page.tsx) — Mamaroneck excluded since that's
  // the home base, already covered by /catering itself.
  const cateringAreaEntries = areasServed
    .filter((a) => a.name !== restaurant.address.city)
    .map((a) => ({
      url: `${restaurant.url}/catering/${areaSlug(a.name)}`,
      lastModified: "2026-08-17",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // One entry per catering event-type page (weddings, corporate-catering,
  // etc. — see cateringEventTypes.ts and src/app/catering/[area]/page.tsx,
  // which resolves both this list and cateringAreaEntries off the same
  // dynamic segment).
  const cateringEventTypeEntries = cateringEventTypes.map((e) => ({
    url: `${restaurant.url}/catering/${e.slug}`,
    lastModified: "2026-08-18",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries, ...cateringAreaEntries, ...cateringEventTypeEntries];
}
