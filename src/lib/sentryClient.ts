// ── Client-side Sentry — mirrors ranimahal-backend's lib/sentryClient
// pattern exactly. No-op until NEXT_PUBLIC_SENTRY_DSN is set.
//
// Loaded via dynamic import, NOT a static one, so the SDK isn't in this
// marketing site's critical-path bundle — it only matters once something
// breaks, so it's fetched lazily in its own chunk instead of shipping to
// every visitor on page load.
//
// @sentry/browser rather than @sentry/nextjs: the only API used here is
// init + captureException, and @sentry/nextjs additionally wraps
// next.config.ts (source maps, tunneling, server/edge instrumentation) —
// more than this static-content-heavy site currently needs. Worth
// revisiting if/when the two API routes (blog-inbox-auth,
// blog-inbox-upload) need their own server-side error tracking too.

let DSN: string | null = null;
try {
  DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || null;
} catch {
  DSN = null;
}

let sentryPromise: Promise<typeof import("@sentry/browser") | null> | null = null;
const queued: Array<{ err: Error; context: Record<string, unknown> }> = [];

function load() {
  if (!DSN) return null;
  if (!sentryPromise) {
    sentryPromise = import("@sentry/browser")
      .then((Sentry) => {
        Sentry.init({ dsn: DSN!, tracesSampleRate: 0 });
        while (queued.length) {
          const { err, context } = queued.shift()!;
          Sentry.captureException(err, { extra: context });
        }
        return Sentry;
      })
      .catch((e) => {
        console.error("Sentry failed to load:", e);
        queued.length = 0;
        return null;
      });
  }
  return sentryPromise;
}

export function captureClientError(err: unknown, context: Record<string, unknown> = {}) {
  if (!DSN) return;
  const error = err instanceof Error ? err : new Error(String(err));
  if (queued.length < 20) queued.push({ err: error, context });
  load();
}
