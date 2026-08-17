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
  a: (props) => <a className="text-saffron link-underline" {...props} />,
  strong: (props) => <strong className="text-bone font-semibold" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-saffron pl-5 my-6 text-xl font-display text-bone/90"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-line" />,
};
