// ── Global client-side error visibility ──────────────────────────────
// Mirrors ranimahal-backend's src/utils/errorReport.js. This repo had zero
// error tracking of any kind before this — a frontend crash here was as
// invisible as the backend's Clerk sign-in bug was before that got found
// (Audit IV/V, ranimahal-backend).

import { captureClientError } from "./sentryClient";

export function reportError(source: string, message: unknown, context: Record<string, unknown> = {}) {
  try {
    captureClientError(message, { source, ...context });
  } catch {
    // Never let error reporting itself become a visible failure.
  }
}

// Global safety net — catches anything not explicitly wrapped elsewhere
// (a render error IS caught separately by error.tsx / not-found boundaries;
// this covers everything else: a stray script error, an unhandled promise
// rejection from a fetch, etc.)
export function installGlobalErrorReporting() {
  if (typeof window === "undefined") return;
  window.addEventListener("error", (e) => {
    reportError("client-runtime", e?.error?.message || e?.message || "Unknown script error", {
      filename: e?.filename ?? "",
      line: e?.lineno ?? "",
    });
  });
  window.addEventListener("unhandledrejection", (e) => {
    reportError("client-runtime", e?.reason?.message || String(e?.reason) || "Unhandled promise rejection", {});
  });
}
