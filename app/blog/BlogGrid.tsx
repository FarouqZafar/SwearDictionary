"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Article } from "@/types";
import { ARTICLE_CATEGORIES } from "@/types";

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogGrid({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const categories = ["all", ...Object.keys(ARTICLE_CATEGORIES)];

  return (
    <>
      <div className="blog-filter-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`blog-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "all" ? "All" : ARTICLE_CATEGORIES[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="blog-empty">
          <div className="blog-empty-icon">📝</div>
          <h2>Articles coming soon</h2>
          <p>
            We&apos;re working on deep dives into the linguistics, culture, and
            history behind the world&apos;s most colorful language. Stay tuned.
          </p>
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="blog-card"
            >
              {article.cover_image_url && (
                <div
                  className="blog-card-cover"
                  style={{ backgroundImage: `url(${article.cover_image_url})` }}
                />
              )}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="blog-card-category">
                    {ARTICLE_CATEGORIES[article.category]}
                  </span>
                  <span className="blog-card-date">
                    {formatDate(article.published_at)}
                  </span>
                </div>
                <h2 className="blog-card-title">{article.title}</h2>
                <p className="blog-card-excerpt">{article.excerpt}</p>
                <span className="blog-card-readtime">
                  {readingTime(article.content)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
