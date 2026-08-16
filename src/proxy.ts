import { clerkMiddleware } from "@clerk/nextjs/server";

// Every route on this site is public — no page here requires sign-in.
// clerkMiddleware() is still needed (even with nothing to protect) so the
// session cookie set by the ordering app (ranimahal.cc/order, same origin)
// is read and kept in sync here too, which is what lets the header's
// account icon show real signed-in state on the marketing site.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};
