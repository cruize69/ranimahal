import type { Metadata } from "next";
import { Fraunces, Great_Vibes, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { RestaurantStructuredData, WebsiteStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Formal script for the wordmark — flourished capitals and long connecting
// strokes. Wordmark only; it has one weight and is unreadable as body copy.
const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(restaurant.url),
  title: {
    default: `${restaurant.name} — ${restaurant.tagline} in ${restaurant.address.city}, NY`,
    template: `%s — ${restaurant.name}`,
  },
  description: restaurant.description,
  keywords: [
    `Indian restaurant ${restaurant.address.city} NY`,
    "North Indian restaurant Westchester NY",
    "tandoori chicken",
    "butter chicken",
    "biryani",
    "curry",
    "naan",
    "vegetarian Indian food",
    "Indian catering Westchester NY",
    "Sunday Indian buffet",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "4XFMhXxAgO9B8lAZiWLEEvDdEVOQGML4Q0WPNlL7w4I",
  },
  openGraph: {
    title: `${restaurant.name} — ${restaurant.tagline}`,
    description: restaurant.description,
    url: restaurant.url,
    siteName: restaurant.name,
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${restaurant.name} — ${restaurant.tagline}`,
    description: restaurant.description,
    images: ["/images/og-home.jpg"],
  },
};

// Same Clerk instance/publishable key as the ordering app (ranimahal.cc/order)
// — both sites are the same origin, so the session cookie is already shared.
// Guarded like the ordering app's MaybeClerkProvider so a missing env var
// (e.g. a preview deploy without it configured) degrades to signed-out
// rather than crashing the whole site.
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function MaybeClerkProvider({ children }: { children: React.ReactNode }) {
  if (!CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${greatVibes.variable}`}
    >
      <head>
        {/* Scroll-reveal starts hidden; without JS it must never stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh flex flex-col">
        <MaybeClerkProvider>
          <RestaurantStructuredData />
          <WebsiteStructuredData />
          <Header />
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          <Footer />
          <MobileActionBar />
          <GoogleAnalytics />
          <CookieConsentBanner />
        </MaybeClerkProvider>
      </body>
    </html>
  );
}
