import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isBlogInboxPasswordValid, mintBlogInboxToken, COOKIE_NAME, TOKEN_TTL_MS } from "@/lib/blogInboxAuth";
import { overLimit, clientIp } from "@/lib/inMemoryRateLimit";

// Password gate for /dev/blog-photo-inbox and its upload token endpoint
// (/api/blog-inbox-upload) — that page was originally shipped guarded only
// by `NODE_ENV === "production"` returning notFound(), matching
// dev/media-manager's existing pattern. That guard only hides the PAGE;
// the upload route itself had no check at all, so anyone who knew/guessed
// the route could POST there in production and receive a real, valid
// Vercel Blob upload token — a genuine open write surface. This route (and
// the cookie it sets) is what actually closes that, on both the page and
// the token-issuing route.

export async function POST(request: Request) {
  if (await overLimit(`blog-inbox-auth:${clientIp(request.headers)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts — try again later." }, { status: 429 });
  }

  const { password } = (await request.json().catch(() => ({}))) as { password?: string };

  if (!process.env.BLOG_INBOX_SECRET) {
    return NextResponse.json({ error: "Blog inbox is not configured." }, { status: 500 });
  }
  if (!isBlogInboxPasswordValid(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = mintBlogInboxToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: TOKEN_TTL_MS / 1000,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
