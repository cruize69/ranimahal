"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Simple password form — on success, sets an httpOnly cookie server-side
 * (via /api/blog-inbox-auth) and refreshes so the parent Server Component
 * re-checks isBlogInboxAuthed() and renders the real uploader. */
export function BlogInboxPasswordGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/blog-inbox-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Incorrect password.");
        return;
      }
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
      <label htmlFor="blog-inbox-password" className="mb-3 block text-lg text-bone">
        Password
      </label>
      <input
        id="blog-inbox-password"
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-bone outline-none focus:border-saffron"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !password}
        className="mt-4 w-full rounded-lg bg-saffron px-4 py-3 font-semibold text-ink disabled:opacity-50"
      >
        {submitting ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
