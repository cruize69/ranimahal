import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "blog_inbox_auth";
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Cookie value is a signed, expiring token — "<expiryMs>.<hexHmac>" — never
// the raw BLOG_INBOX_SECRET itself. Signed with that same secret (no new
// env var needed), but a leaked cookie value (XSS, a stray log line, a
// devtools screenshot) no longer hands over the actual master password —
// it grants a time-boxed session that self-expires. Mirrors the backend
// ordering app's manager-session token (lib/auth.js mintManagerToken).
function signExpiry(expiryMs: number, secret: string): string {
  return crypto.createHmac("sha256", secret).update(String(expiryMs)).digest("hex");
}

export function mintBlogInboxToken(): string | null {
  const secret = process.env.BLOG_INBOX_SECRET;
  if (!secret) return null;
  const expiryMs = Date.now() + TOKEN_TTL_MS;
  return `${expiryMs}.${signExpiry(expiryMs, secret)}`;
}

function isTokenValid(token: string | undefined, secret: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [expiryStr, sig] = token.split(".");
  const expiryMs = Number(expiryStr);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;
  const expected = signExpiry(expiryMs, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export { COOKIE_NAME, TOKEN_TTL_MS };

/** Server-side check shared by the /dev/blog-photo-inbox page (render gate)
 * and /api/blog-inbox-upload (token-issuing gate) — both must independently
 * verify this, since the page hiding the uploader UI does nothing to stop a
 * direct POST to the upload route itself. */
export async function isBlogInboxAuthed(): Promise<boolean> {
  const expected = process.env.BLOG_INBOX_SECRET;
  if (!expected) return false;
  const cookieStore = await cookies();
  return isTokenValid(cookieStore.get(COOKIE_NAME)?.value, expected);
}

/** Constant-time password check — a plain !== leaks timing information
 * proportional to how many leading characters match. */
export function isBlogInboxPasswordValid(provided: unknown): boolean {
  const expected = process.env.BLOG_INBOX_SECRET;
  if (!expected || !provided || typeof provided !== "string") return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
