import Link from "next/link";
import { restaurant } from "@/content/restaurant";
import { orderedHours, formatTime, formatHoursLabel } from "@/lib/hours";
import { Button } from "@/components/Button";
import { Wordmark } from "@/components/Wordmark";
import { Reveal } from "@/components/Reveal";

export function Footer() {
  const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`;

  return (
    <footer className="bg-surface border-t border-line mt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <Reveal className="text-center pb-14 mb-14 border-b border-line">
          <h2 className="font-display text-3xl sm:text-4xl mb-4">Hungry now?</h2>
          <p className="text-muted mb-7 max-w-md mx-auto">
            Pickup and delivery from our full menu, ready when you are.
          </p>
          <Button href={restaurant.links.orderOnline} external variant="primary" size="lg">
            Order Online
          </Button>
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-3 text-sm">
          <div>
            <h3 className="mb-1">
              <Wordmark className="text-xl" />
            </h3>
            <p className="eyebrow mb-4">{restaurant.tagline}</p>
            <p className="text-muted leading-relaxed">
              {restaurant.address.street}
              <br />
              {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}
            </p>
            <a
              href={`tel:${restaurant.phone}`}
              className="inline-block mt-3 text-bone hover:text-saffron transition-colors"
            >
              {restaurant.phoneDisplay}
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-muted hover:text-saffron transition-colors"
            >
              Get directions
            </a>
          </div>

          <div>
            <h3 className="eyebrow mb-4">Hours</h3>
            <ul className="space-y-1.5 text-muted">
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
            <h3 className="eyebrow mb-4">Explore</h3>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/menu" className="hover:text-saffron transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-saffron transition-colors">
                  Reservations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-saffron transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-saffron transition-colors">
                  Gallery
                </Link>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href={restaurant.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={restaurant.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron transition-colors"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 text-xs text-muted/60">
          © {new Date().getFullYear()} {restaurant.name} · {restaurant.tagline}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
