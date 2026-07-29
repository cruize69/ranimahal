"use client";

import Link from "next/link";
import { EditorialImage } from "@/components/EditorialImage";
import { restaurant } from "@/content/restaurant";
import type { FeaturedDish } from "@/content/featured";

type DishCarouselProps = {
  dishes: FeaturedDish[];
};

export function DishCarousel({ dishes }: DishCarouselProps) {
  return (
    <div className="scroll-carousel">
      <div className="flex gap-4 sm:gap-6 px-5 sm:px-10 pb-2">
        {dishes.map((dish) => (
          <article
            key={dish.name}
            className="group shrink-0 w-[72vw] sm:w-[42vw] lg:w-[28vw] max-w-md"
          >
            <Link href={`/menu#${dish.menuSectionId}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden mb-5">
                <EditorialImage
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 72vw"
                  hoverZoom
                  className="object-cover"
                />
              </div>
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-display text-xl sm:text-2xl group-hover:text-saffron transition-colors duration-300">
                  {dish.name}
                </h3>
                <span className="text-saffron font-display">${dish.price}</span>
              </div>
              <p className="text-sm sm:text-base text-muted leading-relaxed line-clamp-2">
                {dish.blurb}
              </p>
            </Link>
            <a
              href={restaurant.links.orderOnline}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-4 inline-block text-sm text-saffron"
            >
              Order this →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
