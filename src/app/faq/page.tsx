import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { PageHeader } from "@/components/PageHeader";
import { restaurant } from "@/content/restaurant";
import { getFaqItems } from "@/content/faq";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers to common questions about ${restaurant.name} — hours, delivery, halal certification, reservations, and more.`,
  alternates: {
    canonical: "/faq",
  },
};

// A standalone URL for the same faqItems already embedded on the homepage
// (see src/app/page.tsx) — the homepage FAQ competes for question-style
// searches ("does Rani Mahal deliver") against every other section on that
// page; a dedicated page ranks for those queries on its own. Same content,
// same schema, just also reachable at its own URL.
export default async function FaqPage() {
  const faqItems = await getFaqItems();
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "FAQ", url: `${restaurant.url}/faq` },
        ]}
      />
      <PageHeader
        eyebrow="Questions"
        title="Good to know"
        lead={`Everything people ask us most about ${restaurant.name} — hours, delivery, halal certification, and more.`}
      />
      <div className="mx-auto max-w-[90rem] px-5 sm:px-10 py-16 sm:py-24">
        <FAQ items={faqItems} id="faq" />
      </div>
      <FAQStructuredData items={faqItems} />
    </>
  );
}
