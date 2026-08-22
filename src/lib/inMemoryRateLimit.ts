// Durable distributed rate limiting via Upstash Redis REST API (when configured in Vercel env),
// with automatic fallback to local in-memory Map for offline local testing.
const hits = new Map<string, { count: number; resetAt: number }>();

export async function overLimit(key: string, max: number, windowMs: number): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const ttlSec = Math.max(1, Math.ceil(windowMs / 1000));
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, ttlSec],
        ]),
      });
      if (res.ok) {
        const data = (await res.json()) as Array<{ result?: number; error?: string }>;
        const count = data?.[0]?.result;
        if (typeof count === "number") {
          return count > max;
        }
      }
    } catch (e) {
      console.error("[rateLimit] Redis rate limit check failed, falling back to local:", e);
    }
  }

  // Local fallback
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export function clientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const chain = (headers.get("x-forwarded-for") ?? "").split(",").map(s => s.trim()).filter(Boolean);
  return chain[chain.length - 1] || "unknown";
}
