"use client";

import { useState } from "react";
import type { MediaEntry } from "@/content/media";

type Dimensions = { width: number; height: number } | null;

function MediaCard({ item }: { item: MediaEntry }) {
  const [dims, setDims] = useState<Dimensions>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (label: string, value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(label);
        window.setTimeout(() => setCopied(null), 1200);
      })
      .catch(() => {
        /* clipboard unavailable — silently ignore */
      });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-[4/3] bg-surface-2">
        {item.kind === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setDims({ width: v.videoWidth, height: v.videoHeight });
            }}
          />
        ) : (
          // Plain <img>, not next/image — this tool needs the asset's real,
          // unoptimized natural dimensions, not a resized/optimized variant.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={(e) => {
              const img = e.currentTarget;
              setDims({ width: img.naturalWidth, height: img.naturalHeight });
            }}
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-saffron backdrop-blur">
          {item.kind}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] text-bone backdrop-blur">
          {dims ? `${dims.width}×${dims.height}px` : "…"}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="mb-1 font-display text-lg text-bone">{item.label}</p>
        <p className="mb-3 text-xs text-muted">{item.usedIn}</p>

        <button
          type="button"
          onClick={() => copy("src", item.src)}
          className="mb-1.5 block w-full truncate rounded-lg bg-surface-2 px-2.5 py-1.5 text-left font-mono text-xs text-bone/90 transition-colors hover:text-saffron"
          title={item.src}
        >
          {copied === "src" ? "Copied ✓" : item.src}
        </button>
        {item.kind === "video" && (
          <button
            type="button"
            onClick={() => copy("poster", item.poster)}
            className="mb-1.5 block w-full truncate rounded-lg bg-surface-2 px-2.5 py-1.5 text-left font-mono text-xs text-bone/90 transition-colors hover:text-saffron"
            title={item.poster}
          >
            {copied === "poster" ? "Copied ✓" : item.poster}
          </button>
        )}

        <p className="mt-3 text-xs leading-relaxed text-muted">{item.aspect}</p>
        {item.notes && <p className="mt-2 text-xs leading-relaxed text-saffron/90">{item.notes}</p>}
      </div>
    </div>
  );
}

export function MediaManagerGrid({ items }: { items: MediaEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
