import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { restaurant } from "@/content/restaurant";
import { orderedHours, formatTime, formatHoursLabel } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Contact & Location",
  description: `Find ${restaurant.name} at ${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}.`,
};

const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`;

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Visit Us" title="Contact & Location" />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-maroon mb-4">Address</h2>
          <p className="font-body text-lg mb-1">{restaurant.address.street}</p>
          <p className="font-body text-lg mb-6">
            {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
          </p>

          <h2 className="font-display text-xl text-maroon mb-4">Phone</h2>
          <a
            href={`tel:${restaurant.phone}`}
            className="font-body text-lg underline underline-offset-4 mb-6 inline-block"
          >
            {restaurant.phoneDisplay}
          </a>

          <h2 className="font-display text-xl text-maroon mb-4 mt-2">Hours</h2>
          <ul className="font-body text-lg space-y-1">
            {orderedHours().map((h) => (
              <li key={h.day} className="flex justify-between max-w-xs">
                <span>{formatHoursLabel(h)}</span>
                <span>
                  {formatTime(h.opens)} – {formatTime(h.closes)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="aspect-[4/3] sm:aspect-auto sm:h-full min-h-[320px] border border-gold/40">
          <iframe
            title={`Map to ${restaurant.name}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}
