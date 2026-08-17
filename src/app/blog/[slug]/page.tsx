import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { blogMdxComponents } from "@/components/BlogProse";
import { restaurant } from "@/content/restaurant";
import { orderUrl } from "@/lib/orderUrl";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import {
  BreadcrumbStructuredData,
  BlogPostingStructuredData,
} from "@/components/StructuredData";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${restaurant.url}/blog/${post.slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      type: "article",
      publishedTime: post.frontmatter.date,
      images: [{ url: post.frontmatter.heroImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.heroImage],
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: restaurant.url },
          { name: "Blog", url: `${restaurant.url}/blog` },
          { name: post.frontmatter.title, url: `${restaurant.url}/blog/${post.slug}` },
        ]}
      />
      <BlogPostingStructuredData post={post} />

      <PageHeader
        eyebrow={formatDate(post.frontmatter.date)}
        title={post.frontmatter.title}
        lead={post.frontmatter.description}
        image={{ src: post.frontmatter.heroImage, alt: post.frontmatter.heroImageAlt }}
      />

      <Reveal as="article" className="mx-auto max-w-3xl px-5 sm:px-10 py-16 sm:py-24">
        <MDXRemote source={post.content} components={blogMdxComponents} />

        <div className="mt-14 pt-10 border-t border-line flex flex-wrap items-center gap-3">
          <Button href={orderUrl("blog_post_cta")} external variant="primary" size="lg">
            Order Online
          </Button>
          <Button href="/blog" variant="secondary" size="lg">
            More From the Blog
          </Button>
        </div>
      </Reveal>
    </>
  );
}
