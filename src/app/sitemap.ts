import type { MetadataRoute } from "next";
import { restaurant } from "@/content/restaurant";
import { getAllPosts } from "@/lib/blog";

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
  { path: "/order", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.9 },
  { path: "/order/catering", lastModified: "2026-08-17", changeFrequency: "monthly", priority: 0.8 },
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

  return [...staticEntries, ...postEntries];
}
