import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/queries";
import BlogGrid from "./BlogGrid";

export const metadata: Metadata = {
  title: "Blog — SwearDictionary | Language, Culture & Profanity",
  description:
    "Deep dives into linguistics, cultural context, and the history behind profanity across languages. Articles about swearing in film, celebrity slip-ups, and more.",
  openGraph: {
    title: "Blog — SwearDictionary | Language, Culture & Profanity",
    description:
      "Deep dives into linguistics, cultural context, and the history behind profanity across languages.",
    type: "website",
    url: "https://sweardictionary.com/blog",
    siteName: "SwearDictionary",
  },
  alternates: { canonical: "https://sweardictionary.com/blog" },
};

export const revalidate = 3600;

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="blog-page">
      <div className="blog-container">
        <div className="blog-header">
          <div className="blog-header-left">
            <h1 className="blog-title">The Blog</h1>
            <p className="blog-subtitle">
              Linguistics, culture, and the stories behind the world&apos;s most
              creative profanity.
            </p>
          </div>
          <div className="blog-header-right">
            <span className="blog-stat-label">articles</span>
            <span className="blog-stat-count">{articles.length}</span>
          </div>
        </div>

        <BlogGrid articles={articles} />
      </div>
    </main>
  );
}
