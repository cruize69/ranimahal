"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/content/restaurant";
import { getOpenStatus } from "@/lib/hours";

export function HoursStrip() {
  const [status, setStatus] = useState<{ isOpen: boolean; label: string } | null>(null);

  useEffect(() => {
    // Open/closed status depends on the visitor's clock, so it can only be
    // computed after mount (server-rendered markup omits it to avoid a
    // hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(getOpenStatus());
  }, []);

  return (
    <div className="bg-maroon text-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm font-body tracking-wide">
        {status && (
          <span className="flex items-center gap-2">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                status.isOpen ? "bg-gold-light" : "bg-cream-dark"
              }`}
              aria-hidden="true"
            />
            {status.label}
          </span>
        )}
        <span>
          {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}{" "}
          {restaurant.address.zip}
        </span>
        <a href={`tel:${restaurant.phone}`} className="underline underline-offset-4 hover:text-gold-light">
          {restaurant.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
