import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Password gate for /dev/blog-photo-inbox and its upload token endpoint
// (/api/blog-inbox-upload) — that page was originally shipped guarded only
// by `NODE_ENV === "production"` returning notFound(), matching
// dev/media-manager's existing pattern. That guard only hides the PAGE;
// the upload route itself had no check at all, so anyone who knew/guessed
// the route could POST there in production and receive a real, valid
// Vercel Blob upload token — a genuine open write surface. This route (and
// the cookie it sets) is what actually closes that, on both the page and
// the token-issuing route.
const COOKIE_NAME = "blog_inbox_auth";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days — a photographer shouldn't have to re-enter this every visit

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.BLOG_INBOX_SECRET;

  if (!expected) {
    return NextResponse.json({ error: "Blog inbox is not configured." }, { status: 500 });
  }
  if (!password || password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SEC,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
