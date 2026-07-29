import Link from "next/link";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";
import type { GalleryImage } from "@/content/gallery";

type PhotoMosaicProps = {
  images: GalleryImage[];
  /** Link shown below the mosaic. */
  viewAllHref?: string;
  viewAllLabel?: string;
};

/**
 * Asymmetric editorial grid — one hero tile plus supporting shots.
 * Designed for full-width display with minimal chrome.
 */
export function PhotoMosaic({
  images,
  viewAllHref = "/gallery",
  viewAllLabel = "View full gallery →",
}: PhotoMosaicProps) {
  const [hero, ...rest] = images;
  if (!hero) return null;

  return (
    <section>
      <div className="photo-mosaic">
        <Reveal className="photo-mosaic-hero group cursor-pointer">
          <Link href={viewAllHref} className="block relative w-full h-full">
            <EditorialImage
              src={hero.src}
              alt={hero.alt}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              hoverZoom
              className="object-cover"
            />
          </Link>
        </Reveal>

        {rest.slice(0, 4).map((img, i) => (
          <Reveal
            key={img.src}
            delay={i * 80}
            className={`photo-mosaic-cell photo-mosaic-cell-${i + 1} group`}
          >
            <Link href={viewAllHref} className="block relative w-full h-full">
              <EditorialImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                hoverZoom
                className="object-cover"
              />
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 mt-8 flex justify-end">
        <Link
          href={viewAllHref}
          className="link-underline text-sm text-saffron hover:text-saffron-deep transition-colors duration-300"
        >
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
