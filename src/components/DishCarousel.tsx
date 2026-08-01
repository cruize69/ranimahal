"use client";

import Link from "next/link";
import { ArchImage } from "@/components/ArchImage";
import type { FeaturedDish } from "@/content/featured";

// `price` and `orderHref` are resolved server-side from the live ordering
// menu (see src/app/page.tsx) rather than hand-typed, so this card can never
// show a price that doesn't match what "Order this" actually adds to cart.
export type ResolvedFeaturedDish = FeaturedDish & { price: number; orderHref: string };

type DishCarouselProps = {
  dishes: ResolvedFeaturedDish[];
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
              <ArchImage
                src={dish.image}
                alt={dish.name}
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 72vw"
                className="aspect-[3/4] mb-5"
              />
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-display text-xl sm:text-2xl group-hover:text-saffron transition-colors duration-300">
                  {dish.name}
                </h3>
                <span className="text-saffron font-display">
                  ${dish.price % 1 === 0 ? dish.price : dish.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm sm:text-base text-muted leading-relaxed line-clamp-2">
                {dish.blurb}
              </p>
            </Link>
            <a
              href={dish.orderHref}
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
