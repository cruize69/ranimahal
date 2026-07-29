import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HoursStrip } from "@/components/HoursStrip";
import { RestaurantStructuredData } from "@/components/StructuredData";
import { restaurant } from "@/content/restaurant";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(restaurant.url),
  title: {
    default: `${restaurant.name} — ${restaurant.tagline}`,
    template: `%s — ${restaurant.name}`,
  },
  description: restaurant.description,
  openGraph: {
    title: `${restaurant.name} — ${restaurant.tagline}`,
    description: restaurant.description,
    url: restaurant.url,
    siteName: restaurant.name,
    images: [{ url: "/images/og-home.svg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${restaurant.name} — ${restaurant.tagline}`,
    description: restaurant.description,
    images: ["/images/og-home.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <RestaurantStructuredData />
        <HoursStrip />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
