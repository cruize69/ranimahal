import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isBlogInboxAuthed } from "@/lib/blogInboxAuth";
import { overLimit } from "@/lib/inMemoryRateLimit";

// Token-issuing endpoint for the owner-facing blog-photo-inbox upload page
// (src/app/dev/blog-photo-inbox/page.tsx). The browser never sees
// BLOB_READ_WRITE_TOKEN directly — it calls this route, which validates the
// upload request and hands back a short-lived, path-scoped client token,
// then uploads straight to Vercel Blob from the browser. Same pattern
// Vercel documents for @vercel/blob client uploads.
//
// This route is a real filesystem route, which next.config.ts's
// `/api/:path*` rewrite (array form = "afterFiles") does not shadow —
// filesystem routes win over that rewrite, same as every other locally
// defined page/route in this app.
//
// isBlogInboxAuthed() is checked here, not just on the page — the page
// hiding its uploader UI does nothing to stop someone from POSTing directly
// to this route and walking away with a real, valid Blob write token. This
// is the check that actually matters.
export async function POST(request: Request) {
  if (!(await isBlogInboxAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // A real day's shoot is dozens of photos, never hundreds — this bounds
  // worst-case Blob storage cost if the session cookie ever leaks, without
  // getting in the way of legitimate use.
  if (await overLimit("blog-inbox-upload:daily", 200, 24 * 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Daily upload limit reached. Try again tomorrow." }, { status: 429 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Restrict every token to the blog-inbox/ prefix so this endpoint
        // can't be used to write anywhere else in the bucket, and to image
        // types only — this page exists purely for dropping in photos.
        if (!pathname.startsWith("blog-inbox/")) {
          throw new Error("Uploads must target the blog-inbox/ prefix.");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB — real camera/phone photos, not thumbnails
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // No DB/KV write here — the daily draft-check cron in
        // ranimahal-backend (per research-architecture.md §3) is what scans
        // blob-inbox/ for new folders, so this route's only job is issuing
        // the token and letting the browser upload directly.
        console.log("blog-inbox upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload token request failed" },
      { status: 400 }
    );
  }
}
