// Best-effort rate limiting with no external store. This repo has no
// KV/Redis (unlike the ordering-app backend, which uses Vercel KV for the
// same purpose) — a Map on a serverless function is per-warm-instance, not
// durable or shared across cold starts or concurrent regions, so a
// determined attacker spread across enough requests can still exceed the
// nominal cap. It still meaningfully raises the bar over no limit at all
// for the low-traffic internal tool this guards (a single staff password
// gate, not a customer-facing endpoint). If this needs to be airtight,
// provision Vercel KV for this project the way the backend already does.
const hits = new Map<string, { count: number; resetAt: number }>();

export function overLimit(key: string, max: number, windowMs: number): boolean {
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
