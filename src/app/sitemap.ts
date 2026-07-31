import type { MetadataRoute } from "next";
import { restaurant } from "@/content/restaurant";

const routes = ["", "/menu", "/reservations", "/about", "/gallery", "/contact", "/areas-we-serve"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${restaurant.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
