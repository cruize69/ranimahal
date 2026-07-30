import type { FaqItem } from "@/content/faq";
import { Reveal } from "@/components/Reveal";

/**
 * Visible FAQ accordion — plain <details>/<summary>, no JS needed for the
 * open/close behavior. Keep this copy identical to whatever FAQStructuredData
 * is fed elsewhere on the same page; the schema and the visible text must
 * match.
 */
export function FAQ({ items, id }: { items: FaqItem[]; id?: string }) {
  return (
    <div id={id} className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <Reveal key={item.question} as="details" delay={i * 40} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base sm:text-lg text-bone marker:content-none">
            {item.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-saffron transition-transform duration-300 group-open:rotate-45"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5 V19 M5 12 H19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-muted leading-relaxed">{item.answer}</p>
        </Reveal>
      ))}
    </div>
  );
}
