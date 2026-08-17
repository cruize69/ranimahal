"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { attributeOrderClick } from "@/lib/orderUrl";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  className?: string;
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full whitespace-nowrap transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0";

const variants = {
  primary: "bg-saffron text-ink hover:bg-saffron-deep hover:shadow-lg hover:shadow-saffron/20",
  secondary: "border border-line text-bone hover:border-saffron hover:text-saffron",
  ghost: "text-bone/80 hover:text-saffron",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (external) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      attributeOrderClick(e); // no-op unless href is an ordering-app link, see orderUrl.ts
      onClick?.();
    };
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
