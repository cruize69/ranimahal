import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { GalleryGrid } from "@/components/GalleryGrid";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photos from ${restaurant.name} — dishes, dining room, and drinks.`,
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A taste of the room"
        lead="Dishes, the dining room, and everything in between."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-20">
        <GalleryGrid />
      </div>
    </>
  );
}
