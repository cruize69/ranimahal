// Blog post storage: MDX files in src/content/blog/posts (published) and
// src/content/blog/drafts (awaiting approval, never read by the site's
// routes/sitemap). Git IS the CMS here — see research-architecture.md §2 —
// so this file's only job is turning those files into typed data at build
// time. No database, no fetch, no CMS API.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO "YYYY-MM-DD"
  heroImage: string;
  heroImageAlt: string;
  tags: string[];
  /** Optional — defaults to the filename without extension. */
  slug?: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");

// `data as BlogPostFrontmatter` below is a compile-time-only annotation —
// nothing enforces it at runtime, so a post missing a required field (e.g.
// an AI-generated draft with a malformed frontmatter block) would only
// fail once something downstream dereferences the missing value, usually
// as a cryptic next/image crash with no indication which post caused it.
// This turns that into a clear, named build failure instead.
const REQUIRED_FRONTMATTER_FIELDS: (keyof BlogPostFrontmatter)[] = [
  "title", "description", "date", "heroImage", "heroImageAlt", "tags",
];

function validateFrontmatter(file: string, data: Record<string, unknown>) {
  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    const value = data[field];
    const missing = field === "tags"
      ? !Array.isArray(value) || value.length === 0
      : typeof value !== "string" || value.trim() === "";
    if (missing) {
      throw new Error(`Blog post "${file}" is missing required frontmatter field "${field}" — check src/content/blog/posts/${file}.`);
    }
  }
}

function readMdxDir(dir: string): { slug: string; content: string; frontmatter: BlogPostFrontmatter }[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      validateFrontmatter(file, data);
      const slug = (data.slug as string | undefined) ?? file.replace(/\.mdx$/, "");
      return { slug, content, frontmatter: data as BlogPostFrontmatter };
    });
}

/** All published posts, newest first. Only reads src/content/blog/posts. */
export function getAllPosts(): BlogPost[] {
  return readMdxDir(POSTS_DIR)
    .map(({ slug, content, frontmatter }) => ({ slug, content, frontmatter }))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
