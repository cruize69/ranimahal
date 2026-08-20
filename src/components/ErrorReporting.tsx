"use client";

// Installs the global window error / unhandledrejection listeners once,
// on mount — the first error-tracking of any kind this repo has had.
// Renders nothing; a no-op if NEXT_PUBLIC_SENTRY_DSN isn't set.
import { useEffect } from "react";
import { installGlobalErrorReporting } from "@/lib/errorReport";

export function ErrorReporting() {
  useEffect(() => {
    installGlobalErrorReporting();
  }, []);
  return null;
}
