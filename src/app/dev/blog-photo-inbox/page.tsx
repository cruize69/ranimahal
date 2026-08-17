import { notFound } from "next/navigation";
import { BlogPhotoInboxUploader } from "@/components/BlogPhotoInboxUploader";

// Local dev only, same guard as src/app/dev/media-manager/page.tsx — `next
// build`/`next start` (and every real deployment) run with
// NODE_ENV=production, so this route 404s everywhere except `next dev`.
//
// This IS the entire owner-facing surface of the blog automation pipeline
// (research-architecture.md §3): take photos, edit them, drag them in here.
// No topic typing, no captions, no calendar management — everything past
// this page (vision captioning, draft generation, PR) runs in
// ranimahal-backend's daily cron, out of scope for this repo.
export default function BlogPhotoInboxPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto max-w-[60rem] px-5 py-16 sm:px-10 sm:py-20">
      <p className="eyebrow mb-3">Local dev only</p>
      <h1 className="mb-4 text-3xl sm:text-5xl">Blog Photo Inbox</h1>
      <p className="mb-10 max-w-2xl text-muted leading-relaxed">
        Drag in today&apos;s photos and they upload straight to Vercel Blob under{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-saffron">
          blog-inbox/&lt;date&gt;/
        </code>
        . That&apos;s the whole job here — the daily draft-check cron picks up any new folder
        automatically from there.
      </p>
      <BlogPhotoInboxUploader />
    </div>
  );
}
