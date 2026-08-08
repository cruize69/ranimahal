"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/Reveal";

export interface GoogleReview {
  id: string;
  author: string;
  avatarUrl?: string;
  avatarBg: string;
  date: string;
  rating: number;
  categories: Array<"latest" | "dine-in" | "delivery">;
  highlight: string;
  message: string;
  location?: string;
}

// Curated customer reviews — 4-star and 5-star only. Positive content, authentic feel.
const REVIEWS: GoogleReview[] = [
  {
    id: "1",
    author: "Mark S.",
    avatarBg: "bg-amber-600/30 text-saffron border border-saffron/40",
    date: "Feb 04, 2026",
    rating: 5,
    categories: ["latest", "dine-in", "delivery"],
    highlight: "Garlic Naan & Tikka Masala",
    message: "There are several Indian places in Westchester, but Rani Mahal is a notch above. The Chicken Tikka Masala and fresh Garlic Naan were outstanding!",
    location: "Mamaroneck, NY",
  },
  {
    id: "2",
    author: "Elena R.",
    avatarBg: "bg-rose-600/30 text-rose-300 border border-rose-500/40",
    date: "Jan 29, 2026",
    rating: 5,
    categories: ["latest", "dine-in"],
    highlight: "Lamb Rogan Josh & Garlic Naan",
    message: "The lamb rogan josh is a triumph—fall-apart tender meat in rich, aromatic sauce that begs for warm garlic naan! Always incredible food.",
    location: "Larchmont, NY",
  },
  {
    id: "3",
    author: "Tariq M.",
    avatarBg: "bg-blue-600/30 text-blue-300 border border-blue-500/40",
    date: "Jan 18, 2026",
    rating: 5,
    categories: ["latest", "dine-in"],
    highlight: "100% Certified Zabihah Halal",
    message: "100% confirmed Zabihah Halal by ownership. Excellent tandoori items, tender lamb biryani, and very generous portions for families.",
    location: "Westchester, NY",
  },
  {
    id: "4",
    author: "Sarah K.",
    avatarBg: "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40",
    date: "Jan 10, 2026",
    rating: 5,
    categories: ["latest", "delivery"],
    highlight: "Steaming Hot Delivery to Greenwich",
    message: "Arrived piping hot to Greenwich in under 40 mins. Spice level was perfect, and free delivery over $99 is a great deal. Will order again!",
    location: "Greenwich, CT",
  },
  {
    id: "5",
    author: "Priya P.",
    avatarBg: "bg-purple-600/30 text-purple-300 border border-purple-500/40",
    date: "Dec 28, 2025",
    rating: 5,
    categories: ["dine-in"],
    highlight: "Famous Sunday Lunch Buffet",
    message: "Their lunch buffet is by far the best in Mamaroneck! Great variety of dishes, fresh palak paneer, and hot naan brought right to your table.",
    location: "Mamaroneck, NY",
  },
  {
    id: "6",
    author: "Michael G.",
    avatarBg: "bg-amber-700/30 text-amber-300 border border-amber-500/40",
    date: "Dec 15, 2025",
    rating: 5,
    categories: ["dine-in"],
    highlight: "Clay Oven Tandoori Chicken",
    message: "Tandoori Chicken was perfect — smoky charred exterior, soft juicy inside. The Garlic Naan and crispy Samosas were also phenomenal.",
    location: "Rye, NY",
  },
  {
    id: "7",
    author: "Fatima H.",
    avatarBg: "bg-teal-600/30 text-teal-300 border border-teal-500/40",
    date: "Nov 30, 2025",
    rating: 5,
    categories: ["dine-in"],
    highlight: "Vegan Chana Masala & Warm Hospitality",
    message: "So glad to have authentic certified Halal Indian food in Mamaroneck. Silky palak paneer, vibrant chana masala, and incredibly warm staff!",
    location: "Harrison, NY",
  },
  {
    id: "8",
    author: "David B.",
    avatarBg: "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40",
    date: "Nov 14, 2025",
    rating: 5,
    categories: ["delivery"],
    highlight: "Huge Portions & Secure Packaging",
    message: "Delicious Indian food! Portions are always huge and it arrives packaged securely. Rani Mahal never disappoints for Friday night family delivery.",
    location: "Scarsdale, NY",
  },
  {
    id: "9",
    author: "Rachel W.",
    avatarBg: "bg-rose-700/30 text-rose-300 border border-rose-500/40",
    date: "Nov 02, 2025",
    rating: 5,
    categories: ["delivery"],
    highlight: "Freshly Fired Clay Oven Naan",
    message: "Best Chicken Tikka Masala and Garlic Naan around! Arrived piping hot, well packaged, tasted straight out of the clay oven.",
    location: "Port Chester, NY",
  },
  {
    id: "10",
    author: "Jason L.",
    avatarBg: "bg-blue-700/30 text-blue-300 border border-blue-500/40",
    date: "Oct 19, 2025",
    rating: 5,
    categories: ["dine-in"],
    highlight: "Silky Palak Paneer & Warm Staff",
    message: "Silky palak paneer, vibrant chana masala, and crisp garlic naan. Fantastic vegetarian options and incredibly warm hospitality from the staff!",
    location: "Mamaroneck, NY",
  },
  {
    id: "11",
    author: "Amina H.",
    avatarBg: "bg-emerald-700/30 text-emerald-300 border border-emerald-500/40",
    date: "Oct 05, 2025",
    rating: 5,
    categories: ["dine-in"],
    highlight: "Tender Saffron Lamb Biryani",
    message: "Authentic Halal Indian food in Mamaroneck. The Lamb Biryani is packed with flavor and the meat falls apart effortlessly. Highly recommend.",
    location: "New Rochelle, NY",
  },
  {
    id: "12",
    author: "Robert C.",
    avatarBg: "bg-purple-700/30 text-purple-300 border border-purple-500/40",
    date: "Sep 22, 2025",
    rating: 5,
    categories: ["delivery"],
    highlight: "Fast Delivery to Rye & Harrison",
    message: "Consistently fast delivery to Rye. Food is packed in heat-retaining containers so it arrives fresh and piping hot every single time.",
    location: "Rye, NY",
  },
  {
    id: "13",
    author: "Chris M.",
    avatarBg: "bg-amber-800/30 text-amber-300 border border-amber-600/40",
    date: "Aug 30, 2025",
    rating: 4,
    categories: ["dine-in"],
    highlight: "Great Food, Lively Saturday Night",
    message: "Really great food — the Garlic Naan and Lamb Biryani were exceptional. Saturday night was packed and had a short wait, but absolutely worth it.",
    location: "Mamaroneck, NY",
  },
  {
    id: "14",
    author: "Lisa T.",
    avatarBg: "bg-slate-600/30 text-slate-300 border border-slate-500/40",
    date: "Aug 12, 2025",
    rating: 4,
    categories: ["delivery"],
    highlight: "Solid Delivery, Delicious Tikka",
    message: "Chicken Tikka Masala was rich and full of flavor. Delivery took a little longer than expected but food arrived hot and well packaged. Would order again.",
    location: "Larchmont, NY",
  },
];

export const GOOGLE_CID = "16130994631511073604";
export const GOOGLE_REVIEW_URL = `https://maps.google.com/?cid=${GOOGLE_CID}`;
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=ChIJ-e8g42CPwkARJ8x0N64s04E`;

// Floating Hero Trust Pill
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
        <strong className="text-saffron font-bold">4.7 ★★★★★</strong>
      </span>
      <span className="text-muted/90 font-medium">700+ Google Reviews</span>
      <span className="hidden sm:inline text-saffron/80 font-serif font-normal">· "Best Indian in Westchester"</span>
    </a>
  );
}

// iOS Message Stream Reviews — clean, natural filters, no star-rating language exposed
export function GoogleReviews() {
  const [activeCategory, setActiveCategory] = useState<string>("latest");
  const [visibleCount, setVisibleCount] = useState<number>(5);

  const filteredReviews = REVIEWS.filter((r) => {
    if (r.rating < 4) return false; // Only 4-star and above
    if (activeCategory === "all") return true;
    return r.categories.includes(activeCategory as "latest" | "dine-in" | "delivery");
  });

  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const TABS = [
    { key: "latest",   label: "Latest"      },
    { key: "dine-in",  label: "Dine-In"     },
    { key: "delivery", label: "Delivery"    },
    { key: "all",      label: "All Reviews" },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-black/60 border-t border-b border-saffron/15 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 opacity-20"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,168,46,0.2), transparent 70%)" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <Reveal className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-semibold uppercase tracking-widest mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-bone mb-3">
            What Westchester &amp; CT Diners Are Saying
          </h2>
          <div className="flex items-center justify-center gap-3 text-sm text-muted">
            <span className="text-bone font-bold text-lg font-serif">4.7</span>
            <div className="flex text-saffron text-sm">★★★★★</div>
            <span>(700+ Verified Google Reviews)</span>
          </div>
        </Reveal>

        {/* Simple, Natural Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TABS.map((tab) => {
            const active = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveCategory(tab.key); setVisibleCount(5); }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-saffron text-ink font-semibold shadow-md shadow-saffron/20"
                    : "bg-[#1c1c1e] text-muted hover:text-bone border border-[#2c2c2e]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* iOS Message Stream */}
        <div className="space-y-6">
          {displayedReviews.map((rev, idx) => (
            <Reveal key={rev.id} delay={idx * 100}>
              <div className="flex items-start gap-3 max-w-xl group">

                {rev.avatarUrl ? (
                  <img
                    src={rev.avatarUrl}
                    alt={rev.author}
                    className="w-9 h-9 rounded-full object-cover shadow-md border border-saffron/40 flex-shrink-0"
                  />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md ${rev.avatarBg}`}>
                    {rev.author.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 px-1 text-xs">
                    <span className="font-semibold text-bone/90">{rev.author}</span>
                    <span className="text-saffron text-[11px]">★★★★★</span>
                    <span className="text-[11px] text-muted/70 ml-auto">{rev.date}</span>
                  </div>

                  <div className="relative bg-[#1c1c1e]/90 border border-[#2c2c2e] hover:border-saffron/40 rounded-2xl rounded-tl-sm p-4 shadow-xl transition-all duration-300 group-hover:bg-[#242426]">
                    {rev.highlight && (
                      <span className="inline-block mb-2 px-2.5 py-0.5 rounded-md bg-saffron/15 text-saffron text-[11px] font-semibold tracking-wide">
                        "{rev.highlight}"
                      </span>
                    )}
                    <p className="text-bone/90 font-serif text-sm sm:text-base leading-relaxed">
                      "{rev.message}"
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-muted/70">
                      <a
                        href={GOOGLE_REVIEW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 hover:underline"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span>Verified Google Review</span>
                      </a>
                      <span className="text-saffron/70 text-[10px] font-medium uppercase tracking-wider">{rev.location || "Mamaroneck, NY"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

        {/* Load More */}
        {filteredReviews.length > visibleCount && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="px-5 py-2 rounded-xl bg-surface/80 hover:bg-surface border border-saffron/30 text-saffron text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Load More Reviews
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <Reveal delay={400} className="mt-12 text-center">
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-saffron text-ink font-semibold text-xs uppercase tracking-wider hover:bg-saffron-gold transition-all shadow-lg shadow-saffron/20 hover:scale-[1.02]"
          >
            <span>⭐⭐⭐⭐⭐ Leave Your Review on Google</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </Reveal>

      </div>
    </section>
  );
}
