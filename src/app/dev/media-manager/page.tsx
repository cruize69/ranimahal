import { notFound } from "next/navigation";
import { MediaManagerGrid } from "@/components/MediaManagerGrid";
import { mediaRegistry } from "@/content/media";

// Local dev only — `next build`/`next start` (and every real deployment,
// including Vercel previews) run with NODE_ENV=production, so this route
// 404s everywhere except `next dev`. Nothing here is sensitive, but it has
// no reason to exist outside a developer's own machine either.
export default function MediaManagerPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-10 sm:py-20">
      <p className="eyebrow mb-3">Local dev only</p>
      <h1 className="mb-4 text-3xl sm:text-5xl">Media Manager</h1>
      <p className="mb-10 max-w-2xl text-muted leading-relaxed">
        Every structural media slot on the site, sourced from{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-saffron">src/content/media.ts</code>.
        To replace one: drop the new file in{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-saffron">public/</code> and update its
        entry there — nothing else needs to change. Click a path below to copy it.
      </p>
      <MediaManagerGrid items={mediaRegistry} />
    </div>
  );
}
