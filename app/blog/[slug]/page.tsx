import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/queries";
import { ARTICLE_CATEGORIES } from "@/types";
import ArticleViewTracker from "./ArticleViewTracker";
import ArticleTOC from "./ArticleTOC";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  const title = `${article.title} — SwearDictionary Blog`;

  // Auto-extract H3 headings from content as additional keywords
  const contentKeywords = (article.content.match(/^### .+/gm) || [])
    .map((h) => h.replace(/^### /, "").replace(/\*\*/g, "").trim());
  const allKeywords = [...new Set([...article.tags, ...contentKeywords])];

  return {
    title,
    description: article.excerpt,
    ...(allKeywords.length > 0 && { keywords: allKeywords }),
    openGraph: {
      title,
      description: article.excerpt,
      type: "article",
      url: `https://sweardictionary.com/blog/${slug}`,
      siteName: "SwearDictionary",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      tags: allKeywords,
      images: [article.cover_image_url
        ? { url: article.cover_image_url }
        : { url: "https://sweardictionary.com/og-default.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: article.excerpt },
    alternates: { canonical: `https://sweardictionary.com/blog/${slug}` },
  };
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // Extract headings for TOC before rendering
  const headingRegex = /^(#{2,3}) (.+)/gm;
  const tocHeadings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(article.content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    tocHeadings.push({ id, text, level });
  }

  // Configure marked to add IDs to headings
  const renderer = new marked.Renderer();
  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    const id = text
      .replace(/<[^>]*>/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };
  const htmlContent = await marked(article.content, { renderer });

  const contentKeywords = (article.content.match(/^### .+/gm) || [])
    .map((h) => h.replace(/^### /, "").replace(/\*\*/g, "").trim());
  const allKeywords = [...new Set([...article.tags, ...contentKeywords])];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    url: `https://sweardictionary.com/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: "SwearDictionary",
      url: "https://sweardictionary.com",
    },
    publisher: {
      "@type": "Organization",
      name: "SwearDictionary",
      url: "https://sweardictionary.com",
    },
    ...(article.cover_image_url && { image: article.cover_image_url }),
    ...(allKeywords.length > 0 && { keywords: allKeywords.join(", ") }),
  };

  // FAQ schema from H3 headings
  const FAQ_PREFIX: Record<string, string> = {
    "movie-tv": "How profane is ",
    celebrity: "How does ",
    linguistic: "What is ",
  };
  const h3Matches = [...article.content.matchAll(/^### (.+)$/gm)];
  const faqLd =
    h3Matches.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: h3Matches.slice(0, 8).map((m) => {
            const heading = m[1].replace(/\*\*/g, "").trim();
            // Extract first paragraph after this heading
            const idx = article.content.indexOf(m[0]) + m[0].length;
            const rest = article.content.slice(idx).trim();
            const firstPara = rest.split(/\n\n/)[0] || "";
            const answer = firstPara
              .replace(/\*\*(.+?)\*\*/g, "$1")
              .replace(/\*(.+?)\*/g, "$1")
              .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
              .replace(/^#+\s*/gm, "")
              .trim()
              .slice(0, 300);
            const prefix = FAQ_PREFIX[article.category] || "";
            const question = prefix
              ? `${prefix}${heading}?`
              : `${heading}?`;
            return {
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            };
          }),
        }
      : null;

  return (
    <main className="article-page">
      <ArticleViewTracker articleId={article.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="article-container">
        <nav className="article-breadcrumb">
          <Link href="/blog">Blog</Link>
          <span className="article-bc-sep">/</span>
          <span className="article-bc-current">{article.title}</span>
        </nav>

        <header className="article-header">
          <div className="article-meta-row">
            <span className="article-category-badge">
              {ARTICLE_CATEGORIES[article.category]}
            </span>
            <span className="article-date">{formatDate(article.published_at)}</span>
            <span className="article-readtime">{readingTime(article.content)}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
          {article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {article.cover_image_url && (
          <div className="article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.cover_image_url} alt={article.title} />
          </div>
        )}

        <div className="article-layout">
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <ArticleTOC headings={tocHeadings} />
        </div>
      </div>
    </main>
  );
}
