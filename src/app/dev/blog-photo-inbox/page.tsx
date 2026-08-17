import { BlogPhotoInboxUploader } from "@/components/BlogPhotoInboxUploader";
import { BlogInboxPasswordGate } from "@/components/BlogInboxPasswordGate";
import { isBlogInboxAuthed } from "@/lib/blogInboxAuth";

// This IS the entire owner-facing surface of the blog automation pipeline
// (research-architecture.md §3): take photos, edit them, drag them in here
// — from a phone, in production, no local dev server required. No topic
// typing, no captions, no calendar management — everything past this page
// (vision captioning, draft generation, PR) runs in ranimahal-backend's
// daily cron, out of scope for this repo.
//
// Real photo/write access to Blob storage, so it's gated by
// isBlogInboxAuthed() (BLOG_INBOX_SECRET password, cookie-based) rather
// than the NODE_ENV-only guard this page originally shipped with — that
// guard hid the page but left the upload token route itself reachable in
// production with no check at all.
export default async function BlogPhotoInboxPage() {
  const authed = await isBlogInboxAuthed();

  return (
    <div className="mx-auto max-w-[60rem] px-5 py-16 sm:px-10 sm:py-20">
      <p className="eyebrow mb-3">Owner only</p>
      <h1 className="mb-4 text-3xl sm:text-5xl">Blog Photo Inbox</h1>
      {authed ? (
        <>
          <p className="mb-10 max-w-2xl text-muted leading-relaxed">
            Drag in today&apos;s photos and they upload straight to Vercel Blob under{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-saffron">
              blog-inbox/&lt;date&gt;/
            </code>
            . That&apos;s the whole job here — the daily draft-check cron picks up any new folder
            automatically from there.
          </p>
          <BlogPhotoInboxUploader />
        </>
      ) : (
        <>
          <p className="mb-10 max-w-2xl text-muted leading-relaxed">
            This page uploads directly into the blog automation pipeline — enter the password to continue.
          </p>
          <BlogInboxPasswordGate />
        </>
      )}
    </div>
  );
}
