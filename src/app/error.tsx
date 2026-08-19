"use client";

// Safety net for an unexpected render error anywhere under this layout —
// previously any such error (a malformed blog post reaching a dynamic path
// not covered by generateStaticParams, or any other unhandled throw) fell
// through to Next's generic, unbranded default error page. This is a
// client component because Next requires error.tsx to be one.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
      <p className="eyebrow mb-3">Rani Mahal</p>
      <h1 className="mb-4 font-display text-3xl text-bone sm:text-4xl">Something went wrong</h1>
      <p className="mb-8 max-w-md text-muted">
        We hit an unexpected error loading this page. Try again, or head back to the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <a href="/" className="text-sm font-semibold text-saffron link-underline">
          Back to home →
        </a>
      </div>
    </div>
  );
}
