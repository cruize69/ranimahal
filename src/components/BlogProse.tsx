import type { MDXComponents } from "mdx/types";

// Maps raw MDX elements to the site's existing type scale (Fraunces display
// face for headings, Inter body, saffron/bone/muted color tokens) instead of
// pulling in a separate "prose" plugin — matches how every other page here
// hand-styles its own copy rather than relying on a Tailwind Typography
// preset.
export const blogMdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="font-display text-2xl sm:text-3xl mt-12 mb-4 text-bone" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-display text-xl sm:text-2xl mt-9 mb-3 text-bone" {...props} />
  ),
  p: (props) => <p className="text-lg text-muted leading-relaxed mb-5" {...props} />,
  ul: (props) => (
    <ul className="list-disc pl-6 mb-5 space-y-2 text-lg text-muted leading-relaxed" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-6 mb-5 space-y-2 text-lg text-muted leading-relaxed" {...props} />
  ),
  li: (props) => <li {...props} />,
  // Blog posts go through the daily cron/PR-review pipeline (see
  // research-architecture.md), not live user submission — but an MDX link
  // href is still free-form text embedded in generated copy, and a
  // javascript: URL slipping through review would execute on click. Reject
  // anything that isn't a real http(s)/mailto/tel/relative link rather
  // than trusting the content pipeline as the only gate.
  a: ({ href, ...props }) => {
    const safeHref = typeof href === "string" && /^(https?:|mailto:|tel:|\/)/.test(href) ? href : undefined;
    return <a href={safeHref} className="text-saffron link-underline" {...props} />;
  },
  strong: (props) => <strong className="text-bone font-semibold" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-saffron pl-5 my-6 text-xl font-display text-bone/90"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-line" />,
};
