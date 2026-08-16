"use client";

import React from "react";
import { Reveal } from "@/components/Reveal";

// The review content that used to live here (14 reviews with invented
// authors, towns, and dates, presented as "700+ Verified Google Reviews")
// was fabricated — never sourced from a real review. Presenting authored
// testimonials as verified Google reviews is a false-endorsement risk, not
// just a content-quality one, so it's removed rather than reworded.
//
// This component now only ever links out to the real, live Google listing.
// No rating number or review count is claimed anywhere in this file unless
// it is pulled live from the Google Places API — do not hardcode one back in.
// search.google.com/local/reviews (a guessed pattern-match off a write-
// review endpoint) does NOT exist — verified it 404s. Google has no
// equivalent documented deep link straight into a business's review list,
// so this uses a plain search query instead: it reliably surfaces the
// knowledge panel with rating/reviews for any real visitor, with no
// internal Google ID to get wrong.
export const GOOGLE_REVIEW_URL = `https://www.google.com/search?q=${encodeURIComponent("Rani Mahal Mamaroneck NY reviews")}`;
// Google's own official "write a review" shortlink for this listing —
// confirmed directly from the Google Business Profile dashboard, not
// guessed/reconstructed like the old placeid-based URL this replaced.
export const GOOGLE_WRITE_REVIEW_URL = "https://g.page/r/CXNevQ8KoPZSEBM/review";

// Floating Hero Trust Pill — links to the real listing, claims no numbers.
export function GoogleHeroPill() {
  return (
    <a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-surface/90 border border-saffron/30 hover:border-saffron/70 text-bone text-xs font-medium transition-all shadow-lg hover:scale-[1.02] backdrop-blur-md"
    >
      <span className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <strong className="text-saffron font-bold">Read our reviews</strong>
      </span>
      <span className="text-muted/90 font-medium">on Google →</span>
    </a>
  );
}

// Simple, honest review CTA — no fabricated content, no claimed rating.
// Replace this with a real embedded feed (Google Places API) once a server
// key is wired up; until then this only ever points at the real listing.
export function GoogleReviews() {
  return (
    <section className="relative py-16 sm:py-24 bg-black/60 border-t border-b border-saffron/15 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 opacity-20"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,168,46,0.2), transparent 70%)" }}
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-semibold uppercase tracking-widest mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>On Google</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-bone mb-4">
            See what Westchester &amp; CT diners are saying
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Our reviews live on Google, where they&apos;re verified straight from real
            guests — read them there rather than a curated list here.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-saffron text-ink font-semibold text-xs uppercase tracking-wider hover:bg-saffron-gold transition-all shadow-lg shadow-saffron/20 hover:scale-[1.02]"
            >
              <span>Read Reviews on Google</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-transparent border border-saffron/40 text-saffron font-semibold text-xs uppercase tracking-wider hover:bg-saffron/10 transition-all"
            >
              Leave a Review
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
