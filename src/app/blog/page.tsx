import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EditorialImage } from "@/components/EditorialImage";
import { Reveal } from "@/components/Reveal";
import { restaurant } from "@/content/restaurant";
import { getAllPosts } from "@/lib/blog";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Blog",
  description: `Dish guides, local picks, and stories from ${restaurant.name}, an Indian restaurant in ${restaurant.address.city}, NY.`,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog — ${restaurant.name}`,
    description: `Dish guides, local picks, and stories from ${restaurant.name}, an Indian restaurant in ${restaurant.address.city}, NY.`,
    url: "/blog",
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Blog", url: `${restaurant.url}/blog` },
        ]}
      />
      <PageHeader
        eyebrow="From the Kitchen"
        title="The Rani Mahal Blog"
        lead={`Dish guides, local picks, and stories from our kitchen in ${restaurant.address.city}, NY.`}
      />

      <div className="mx-auto max-w-[75rem] px-5 sm:px-10 py-16 sm:py-24">
        {posts.length === 0 ? (
          <p className="text-lg text-muted">New posts are on the way — check back soon.</p>
        ) : (
          <div className="grid gap-12 sm:gap-16 sm:grid-cols-2">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 60}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-5">
                    <EditorialImage
                      src={post.frontmatter.heroImage}
                      alt={post.frontmatter.heroImageAlt}
                      fill
                      sizes="(min-width: 640px) 37vw, 90vw"
                      hoverZoom
                      className="object-cover"
                    />
                  </div>
                  <p className="eyebrow mb-2">{formatDate(post.frontmatter.date)}</p>
                  <h2 className="font-display text-2xl sm:text-3xl mb-2 text-bone group-hover:text-saffron transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-muted leading-relaxed">{post.frontmatter.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
