import { cookies } from "next/headers";

const COOKIE_NAME = "blog_inbox_auth";

/** Server-side check shared by the /dev/blog-photo-inbox page (render gate)
 * and /api/blog-inbox-upload (token-issuing gate) — both must independently
 * verify this, since the page hiding the uploader UI does nothing to stop a
 * direct POST to the upload route itself. */
export async function isBlogInboxAuthed(): Promise<boolean> {
  const expected = process.env.BLOG_INBOX_SECRET;
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === expected;
}
