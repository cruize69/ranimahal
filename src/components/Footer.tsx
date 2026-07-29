import Link from "next/link";
import { restaurant } from "@/content/restaurant";
import { orderedHours, formatTime, formatHoursLabel } from "@/lib/hours";
import { ArchDivider } from "@/components/ArchMotif";

export function Footer() {
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-10">
        <ArchDivider className="w-24 h-6 mx-auto mb-10 text-gold" />

        <div className="grid gap-10 sm:grid-cols-3 text-sm">
          <div>
            <h2 className="font-display text-lg tracking-[0.15em] text-gold-light mb-4">
              {restaurant.name.toUpperCase()}
            </h2>
            <p className="text-cream/80 leading-relaxed">
              {restaurant.address.street}
              <br />
              {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
            </p>
            <a
              href={`tel:${restaurant.phone}`}
              className="inline-block mt-3 underline underline-offset-4 hover:text-gold-light"
            >
              {restaurant.phoneDisplay}
            </a>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-[0.15em] text-gold-light mb-4 uppercase">
              Hours
            </h3>
            <ul className="space-y-1 text-cream/80">
              {orderedHours().map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{formatHoursLabel(h)}</span>
                  <span>
                    {formatTime(h.opens)} – {formatTime(h.closes)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-[0.15em] text-gold-light mb-4 uppercase">
              Explore
            </h3>
            <ul className="space-y-2 text-cream/80">
              <li>
                <Link href="/menu" className="hover:text-gold-light">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-gold-light">
                  Reservations
                </Link>
              </li>
              <li>
                <a
                  href={restaurant.links.orderOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-light"
                >
                  Order Online
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href={restaurant.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-light"
                >
                  Instagram
                </a>
                <a
                  href={restaurant.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-light"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
