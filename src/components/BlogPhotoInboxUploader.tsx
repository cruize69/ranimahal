"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

type UploadState = {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
};

// Today's date, in the same folder shape the automation pipeline expects:
// blog-inbox/<date>/. One drop session = one folder = one candidate post
// (research-architecture.md §3, "Photo-driven" trigger).
function todayFolder() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function BlogPhotoInboxUploader() {
  const [items, setItems] = useState<UploadState[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folder = todayFolder();

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    const newItems: UploadState[] = list.map((file) => ({ file, status: "pending" }));
    setItems((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      setItems((prev) =>
        prev.map((it) => (it.file === item.file ? { ...it, status: "uploading" } : it))
      );
      try {
        const blob = await upload(`blog-inbox/${folder}/${item.file.name}`, item.file, {
          access: "public",
          handleUploadUrl: "/api/blog-inbox-upload",
        });
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file ? { ...it, status: "done", url: blob.url } : it
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.file === item.file
              ? { ...it, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
              : it
          )
        );
      }
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center cursor-pointer transition-colors ${
          dragOver ? "border-saffron bg-surface" : "border-line bg-surface/50 hover:border-saffron/60"
        }`}
      >
        <p className="font-display text-xl text-bone">Drop photos here</p>
        <p className="text-sm text-muted">or click to choose files — uploads to {`blog-inbox/${folder}/`}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => (
            <li
              key={`${item.file.name}-${i}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <span className="truncate text-sm text-bone">{item.file.name}</span>
              <span
                className={`shrink-0 text-xs font-medium ${
                  item.status === "done"
                    ? "text-saffron"
                    : item.status === "error"
                    ? "text-chili"
                    : "text-muted"
                }`}
              >
                {item.status === "pending" && "Waiting…"}
                {item.status === "uploading" && "Uploading…"}
                {item.status === "done" && "Uploaded ✓"}
                {item.status === "error" && (item.error ?? "Failed")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
