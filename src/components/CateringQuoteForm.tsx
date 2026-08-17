"use client";

import { useState } from "react";
import type { CateringPackage } from "@/lib/cateringPackages";

// POSTs directly to the ordering app's /api/catering-inquiry — reachable
// same-origin from here because next.config.ts already proxies /api/:path*
// to https://ranimahal.food. This replaces the old "Request a Custom Quote"
// button that sent people back out to /order/catering's own copy of this
// same form — that round trip was the exact "messy" duplicate flow this
// page exists to eliminate.
const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#1c1814] px-3.5 py-3 text-sm text-bone outline-none placeholder:text-muted/60 focus:border-saffron/50";
const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted";

export function CateringQuoteForm({ packages }: { packages: CateringPackage[] }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    eventDate: "",
    headcount: "",
    occasion: "",
    packageInterest: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!form.contact.trim()) {
      setError("Please enter an email or phone number so we can reach you.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/catering-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please call us instead.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us instead.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[#7FBE6B]/35 bg-[#7FBE6B]/10 p-6 text-center sm:p-7">
        <p className="mb-2 text-lg font-bold text-[#9CD684]">Got it — thank you!</p>
        <p className="text-sm leading-relaxed text-bone/85">
          We&apos;ll reach out at the contact you gave us, usually within one business day. For anything
          time-sensitive, call us directly at{" "}
          <a href="tel:9148359066" className="font-semibold text-saffron">
            (914) 835-9066
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#110D0A] p-6 shadow-2xl sm:p-7"
    >
      <div>
        <label className={labelClass} htmlFor="cat-name">
          Your name *
        </label>
        <input id="cat-name" className={inputClass} value={form.name} onChange={set("name")} placeholder="Your name" required />
      </div>
      <div>
        <label className={labelClass} htmlFor="cat-contact">
          Email or phone *
        </label>
        <input
          id="cat-contact"
          className={inputClass}
          value={form.contact}
          onChange={set("contact")}
          placeholder="you@email.com or (914) 555-0123"
          required
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass} htmlFor="cat-date">
            Event date
          </label>
          <input id="cat-date" type="date" className={inputClass} value={form.eventDate} onChange={set("eventDate")} />
        </div>
        <div className="flex-1">
          <label className={labelClass} htmlFor="cat-headcount">
            Headcount
          </label>
          <input id="cat-headcount" className={inputClass} value={form.headcount} onChange={set("headcount")} placeholder="~25" inputMode="numeric" />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="cat-occasion">
          Occasion
        </label>
        <input
          id="cat-occasion"
          className={inputClass}
          value={form.occasion}
          onChange={set("occasion")}
          placeholder="Diwali party, wedding, office lunch…"
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="cat-package">
          Package you&apos;re interested in
        </label>
        <select id="cat-package" className={inputClass} value={form.packageInterest} onChange={set("packageInterest")}>
          <option value="">Not sure yet — let&apos;s talk</option>
          {packages.map((pkg) => (
            <option key={pkg.name} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="cat-notes">
          Anything else we should know
        </label>
        <textarea
          id="cat-notes"
          className={`${inputClass} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={set("notes")}
          placeholder="Dietary needs, budget range, venue…"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-gradient-to-r from-saffron via-[#f5b84c] to-[#d69528] py-3.5 text-sm font-bold text-[#080706] shadow-lg shadow-saffron/20 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Request a Quote →"}
      </button>
    </form>
  );
}
