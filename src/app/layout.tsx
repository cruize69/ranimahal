import type { Metadata } from "next";
import { Fraunces, Inter, Yatra_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { RestaurantStructuredData } from "@/components/StructuredData";
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

// Devanagari-derived Latin — the strokes carry the shirorekha (top-bar) feel
// of Sanskrit script. Used only for the wordmark, never for body copy.
const yatraOne = Yatra_One({
  variable: "--font-yatra",
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
  openGraph: {
    title: `${restaurant.name} — ${restaurant.tagline}`,
    description: restaurant.description,
    url: restaurant.url,
    siteName: restaurant.name,
    images: [{ url: "/images/og-home.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${restaurant.name} — ${restaurant.tagline}`,
    description: restaurant.description,
    images: ["/images/og-home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${yatraOne.variable}`}
    >
      <head>
        {/* Scroll-reveal starts hidden; without JS it must never stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh flex flex-col">
        <RestaurantStructuredData />
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer />
        <MobileActionBar />
        <Analytics />
      </body>
    </html>
  );
}
