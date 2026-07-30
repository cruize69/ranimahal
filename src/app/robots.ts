import type { MetadataRoute } from "next";
import { restaurant } from "@/content/restaurant";

// The wildcard rule below already allows every crawler, AI included — these
// named entries are about signaling intent, not changing behavior: if a
// future edit ever tightens the "*" rule, the most-specific matching
// user-agent block wins per the robots.txt spec, so naming these bots here
// keeps them allowed even if that happens by accident.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "CCBot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${restaurant.url}/sitemap.xml`,
  };
}
