import { clerkMiddleware } from "@clerk/nextjs/server";

// Every route on this site is public — no page here requires sign-in.
// clerkMiddleware() is still needed (even with nothing to protect) so the
// session cookie set by the ordering app (ranimahal.cc/order, same origin)
// is read and kept in sync here too, which is what lets the header's
// account icon show real signed-in state on the marketing site.
export default clerkMiddleware();

export const config = {
  matcher: [
    // The extension group is end-anchored ($) — unanchored, a path merely
    // CONTAINING a segment like ".css/" (e.g. "/a.css/anything") skipped
    // this middleware entirely. Harmless today (nothing here is
    // auth-gated), but it's a bypass waiting for the day any route is.
    "/((?!_next|.*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)$).*)",
    "/(api|trpc)(.*)",
  ],
};
