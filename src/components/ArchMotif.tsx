// Decorative Mughal-arch outline used as a section divider / frame accent.
// Purely presentational — hidden from assistive tech.
export function ArchDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M0 40 L0 20 C0 8 40 0 100 0 C160 0 200 8 200 20 L200 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function ArchFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 130"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M2 128 L2 55 C2 20 25 2 50 2 C75 2 98 20 98 55 L98 128"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 128 L10 55 C10 26 28 10 50 10 C72 10 90 26 90 55 L90 128"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  );
}
