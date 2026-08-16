"use client";

import { useClerk, useUser } from "@clerk/nextjs";

// Same visual language as the ordering app's header account chip
// (ranimahal-backend/src/components/RaniHeader.jsx): outline icon when
// signed out, gold initials + green online dot when signed in. Since this
// site and the ordering app share one origin (ranimahal.cc), the Clerk
// session cookie is already shared — a user signed in on either site shows
// signed-in here immediately, no extra round trip.
const ORDER_APP_ACCOUNT_URL = "https://ranimahal.cc/order?view=account";

export function AccountChip({ compact = false }: { compact?: boolean }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  // Avoid a signed-out flash before Clerk resolves the shared session.
  if (!isLoaded) {
    return (
      <div
        aria-hidden="true"
        className={compact ? "w-8 h-8 rounded-full bg-surface-2 animate-pulse" : "w-9 h-9 rounded-full bg-surface-2 animate-pulse"}
      />
    );
  }

  const initial = (user?.firstName?.[0] ?? user?.primaryEmailAddress?.emailAddress?.[0] ?? "•").toUpperCase();
  const size = compact ? 32 : 36;

  if (isSignedIn) {
    return (
      <a
        href={ORDER_APP_ACCOUNT_URL}
        aria-label="Your account & orders"
        className="relative inline-flex shrink-0"
      >
        <span
          style={{ width: size, height: size }}
          className="rounded-full flex items-center justify-center text-sm font-bold text-ink"
        >
          <span
            style={{ width: size, height: size, background: "linear-gradient(135deg, #E8A82E 0%, #C8871A 100%)" }}
            className="rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(232,168,46,0.35)]"
          >
            {initial}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-ink"
        />
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openSignIn({ forceRedirectUrl: window.location.href, signUpForceRedirectUrl: window.location.href })}
      aria-label="Sign in to your account"
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full border border-saffron/30 bg-saffron/10 text-saffron flex items-center justify-center hover:border-saffron hover:bg-saffron/18 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    </button>
  );
}
