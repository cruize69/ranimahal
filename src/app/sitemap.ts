import type { MetadataRoute } from "next";
import { restaurant } from "@/content/restaurant";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${restaurant.url}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
