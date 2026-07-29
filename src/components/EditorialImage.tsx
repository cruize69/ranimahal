import Image, { type ImageProps } from "next/image";

type EditorialImageProps = Omit<ImageProps, "quality"> & {
  /** Next/Image quality — default 92 for sharper food photography. */
  quality?: number;
  /** Subtle zoom on hover when wrapped in a group. */
  hoverZoom?: boolean;
};

const hoverClass =
  "transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]";

/**
 * Consistent high-quality image rendering across the site.
 * Always pass explicit `sizes` — food photos are the hero, so they deserve
 * the full width budget they occupy on screen.
 */
export function EditorialImage({
  quality = 92,
  hoverZoom = false,
  className = "",
  alt,
  ...props
}: EditorialImageProps) {
  return (
    <Image
      alt={alt}
      quality={quality}
      className={`${hoverZoom ? hoverClass : ""} ${className}`.trim()}
      {...props}
    />
  );
}
