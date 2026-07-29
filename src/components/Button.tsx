import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  external?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center px-7 py-3 font-display text-sm tracking-[0.15em] uppercase transition-colors duration-200";

const variants = {
  primary: "bg-maroon text-cream hover:bg-maroon-dark",
  outline: "border border-gold text-ink hover:bg-gold hover:text-ink",
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
