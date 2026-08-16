import Link from "next/link";
import { CookiePreferencesLink } from "@/components/CookiePreferencesLink";
import { EditorialImage } from "@/components/EditorialImage";
import { HoursList } from "@/components/HoursList";
import { Button } from "@/components/Button";
import { Lockup } from "@/components/Wordmark";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { orderUrl } from "@/lib/orderUrl";
import { footerBand } from "@/content/media";

export function Footer() {
  const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}`;

  return (
    <footer className="mt-0">
      {/* Full-bleed photo band above footer content */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <EditorialImage
          src={footerBand.src}
          alt={footerBand.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
      </div>

      <div className="bg-surface border-t border-line">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-20">
          <Reveal className="text-center pb-14 mb-14 border-b border-line">
            <h2 className="font-display text-3xl sm:text-4xl mb-4">Hungry now?</h2>
            <p className="text-muted mb-7 max-w-md mx-auto">
              Pickup and delivery from our full menu, ready when you are.
            </p>
            <Button href={orderUrl("footer_cta")} external variant="primary" size="lg">
              Order Online
            </Button>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-3 text-sm">
            <div>
              <h3 className="mb-4">
                <Lockup markClassName="w-14" wordmarkClassName="text-2xl" tagline />
              </h3>
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
              <HoursList className="space-y-1.5 text-muted" />
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
                  <Link href="/contact" className="hover:text-saffron transition-colors">
                    Visit
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-saffron transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/reservations" className="hover:text-saffron transition-colors">
                    Reservations
                  </Link>
                </li>
                <li>
                  <a
                    href={restaurant.links.catering}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-saffron transition-colors"
                  >
                    Catering
                  </a>
                </li>
                <li>
                  <Link href="/about" className="hover:text-saffron transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/areas-we-serve" className="hover:text-saffron transition-colors">
                    Areas We Serve
                  </Link>
                </li>
                <li>
                  <a
                    href={restaurant.links.giftCards}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-saffron transition-colors"
                  >
                    Gift Cards
                  </a>
                </li>
                <li>
                  <CookiePreferencesLink />
                </li>
                <li className="flex gap-4 pt-2">
                  {restaurant.social.instagram && (
                    <a
                      href={restaurant.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-saffron transition-colors"
                    >
                      Instagram
                    </a>
                  )}
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
      </div>
    </footer>
  );
}
