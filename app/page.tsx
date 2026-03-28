import Link from "next/link";
import type { Metadata } from "next";
import { getLanguages, getTrendingWords, getDiverseFeaturedWords, getTotalWordCount, getLatestArticles } from "@/lib/queries";
import { SEVERITY_LABELS, SEVERITY_CLASSES, type SeverityLevel, ARTICLE_CATEGORIES } from "@/types";

export const metadata: Metadata = {
  title: "SwearDictionary — Curse Words & Profanity in 30+ Languages",
  description:
    "Browse 2,000+ swear words, curse words & profanity from 30+ languages. Severity ratings, cultural context, translations & example sentences.",
  openGraph: {
    title: "SwearDictionary — Curse Words & Profanity in 30+ Languages",
    description:
      "Browse 2,000+ swear words, curse words & profanity from 30+ languages. Severity ratings, cultural context, translations & example sentences.",
    type: "website",
    url: "https://sweardictionary.com",
    siteName: "SwearDictionary",
    images: [{ url: "https://sweardictionary.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwearDictionary — Curse Words & Profanity in 30+ Languages",
    description:
      "Browse 2,000+ swear words, curse words & profanity from 30+ languages. Severity ratings, cultural context, translations & example sentences.",
  },
  alternates: { canonical: "https://sweardictionary.com" },
};

export const revalidate = 3600;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SwearDictionary",
  url: "https://sweardictionary.com",
  description: "The world's most comprehensive multilingual profanity encyclopedia. Swear words, curse words and profanity from 30+ languages with severity ratings and cultural context.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://sweardictionary.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  const [languages, trendingWords, diverseWords, totalWords, latestArticles] = await Promise.all([
    getLanguages(),
    getTrendingWords(8),
    getDiverseFeaturedWords(8),
    getTotalWordCount(),
    getLatestArticles(2),
  ]);

  // If all trending words have 0 views (cold start), use diverse fallback
  const hasRealViews = trendingWords.some((w) => w.views > 0);
  const featuredWords = hasRealViews ? trendingWords : diverseWords;

  // Word of the Day: pick based on day-of-year for daily rotation
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const wotd = featuredWords.length > 0
    ? featuredWords[dayOfYear % featuredWords.length]
    : null;

  // Trending: exclude word of the day, take top 6
  const trending = featuredWords
    .filter((w) => w.id !== wotd?.id)
    .slice(0, 6);

  // Severity scale examples (pick one word per level from trending data)
  const severityExamples: { level: number; label: string; color: string; desc: string }[] = [
    { level: 1, label: "Mild", color: "var(--green)", desc: "Casual, everyday. Your coworker might use it." },
    { level: 2, label: "Moderate", color: "var(--yellow)", desc: "Common but not for polite company." },
    { level: 3, label: "Strong", color: "var(--orange)", desc: "Will turn heads. Normal among close friends." },
    { level: 4, label: "Severe", color: "var(--red)", desc: "Not for public. Reserved for strong emotions." },
    { level: 5, label: "Nuclear", color: "var(--skull)", desc: "The worst it gets. Will provoke reactions." },
  ];

  return (
    <main className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="home-container">
      {/* HEADER — same layout as words/languages pages */}
      <div className="home-header">
        <div className="home-header-left">
          <div className="hero-eyebrow">
            {totalWords.toLocaleString()}+ words · {languages.length} languages ·
            zero filter
          </div>
          <h1 className="home-title">
            The world&apos;s swear words,
            <br />
            <em>properly documented.</em>
          </h1>
          <p className="home-subtitle">
            The only dictionary your teacher <strong>definitely</strong> didn&apos;t
            recommend. Explore swear words, insults, and creative profanity across
            every language — with severity ratings, cultural context, and the kind
            of detail you won&apos;t find on Duolingo.
          </p>
        </div>
        <div className="home-header-right">
          <span className="home-stat-label">total words</span>
          <span className="home-stat-count">{totalWords.toLocaleString()}</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="home-search-row">
        <form action="/search" method="GET" className="home-search-form">
          <div className="home-search-wrap">
            <svg
              className="home-search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              name="q"
              placeholder='Try "scheisse", "putain", or just "fuck"...'
              className="home-search-input"
            />
          </div>
        </form>
      </div>
      <div className="home-search-hint">
        Popular right now:{" "}
        {trending.slice(0, 4).map((w, i) => (
          <span key={w.id}>
            {i > 0 && " · "}
            <Link href={`/language/${w.language?.slug}/${w.slug}`} className="search-hint-link">
              {w.word}
            </Link>
          </span>
        ))}
      </div>

      {/* STATS */}
      <div className="home-stats-row">
        <div className="stat-chip">
          <b>{languages.length}</b> languages
        </div>
        <div className="stat-chip">
          <b>{totalWords.toLocaleString()}+</b> words
        </div>
        <div className="stat-chip">
          <b>5</b> severity levels
        </div>
        <div className="stat-chip">
          🔥 <b>12k</b> monthly explorers
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="home-quick-links">
        <Link href="/words" className="home-quick-card">
          <span className="home-quick-icon">📖</span>
          <div>
            <h3>Browse All Words</h3>
            <p>{totalWords.toLocaleString()}+ words with filters, sorting, and search</p>
          </div>
          <span className="home-quick-arrow">→</span>
        </Link>
        <Link href="/languages" className="home-quick-card">
          <span className="home-quick-icon">🌍</span>
          <div>
            <h3>Browse by Language</h3>
            <p>{languages.length} languages from Arabic to Vietnamese</p>
          </div>
          <span className="home-quick-arrow">→</span>
        </Link>
        <Link href="/submit" className="home-quick-card">
          <span className="home-quick-icon">✍️</span>
          <div>
            <h3>Submit a Word</h3>
            <p>Help us build the most complete profanity database</p>
          </div>
          <span className="home-quick-arrow">→</span>
        </Link>
      </div>

      {/* WORD OF THE DAY */}
      {wotd && (
        <>
          <div className="section-head">
            <h2>Word of the Day</h2>
            <span className="see-all home-wotd-date">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="home-wotd">
            <Link
              href={`/language/${wotd.language?.slug}/${wotd.slug}`}
              className="home-wotd-card"
            >
              <div className="home-wotd-top">
                <div>
                  <span className="home-wotd-word">{wotd.word}</span>
                  <span className="home-wotd-flag">
                    {wotd.language?.flag_emoji || "🌍"}
                  </span>
                </div>
                <span
                  className={`severity-badge ${SEVERITY_CLASSES[wotd.severity as SeverityLevel]}`}
                >
                  {SEVERITY_LABELS[wotd.severity as SeverityLevel]}
                </span>
              </div>
              <div className="home-wotd-lang">
                {wotd.language?.name}
                {wotd.english_equivalent && (
                  <> · &ldquo;{wotd.english_equivalent}&rdquo;</>
                )}
              </div>
              <div className="home-wotd-meaning">{wotd.meaning}</div>
              {wotd.cultural_context && (
                <div className="home-wotd-context">
                  <strong>Cultural note:</strong> {wotd.cultural_context}
                </div>
              )}
            </Link>
          </div>
        </>
      )}

      {/* HOW BAD IS IT? — Severity Scale */}
      <div className="section-head">
        <h2>How bad is it?</h2>
        <span className="see-all">the scale</span>
      </div>
      <div className="home-severity-scale">
        {severityExamples.map((s) => (
          <div key={s.level} className="home-sev-item">
            <div className="home-sev-num" style={{ color: s.color }}>
              {s.level}
            </div>
            <div className="home-sev-bar-track">
              <div
                className="home-sev-bar-fill"
                style={{ width: `${s.level * 20}%`, background: s.color }}
              />
            </div>
            <div className="home-sev-info">
              <span className="home-sev-label" style={{ color: s.color }}>
                {s.label}
              </span>
              <span className="home-sev-desc">{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TRENDING */}
      <div className="section-head">
        <h2>Trending Right Now</h2>
        <Link href="/words" className="see-all">
          all words →
        </Link>
      </div>
      <div className="home-trending-grid">
        {trending.map((w) => (
          <Link
            key={w.id}
            href={`/language/${w.language?.slug}/${w.slug}`}
            className="home-trending-card"
          >
            <div className="home-trending-top">
              <span className="home-trending-word">{w.word}</span>
              <span
                className={`severity-badge ${SEVERITY_CLASSES[w.severity as SeverityLevel]}`}
              >
                {SEVERITY_LABELS[w.severity as SeverityLevel]}
              </span>
            </div>
            <div className="home-trending-lang">
              {w.language?.flag_emoji || "🌍"}{" "}
              {w.language?.name}
            </div>
            <div className="home-trending-meaning">{w.meaning}</div>
            <div className="home-trending-views">
              {w.views.toLocaleString()} views
            </div>
          </Link>
        ))}
      </div>

      {/* LATEST FROM THE BLOG */}
      {latestArticles.length > 0 && (
        <>
          <div className="section-head">
            <h2>Latest from the Blog</h2>
            <Link href="/blog" className="see-all">
              all articles →
            </Link>
          </div>
          <div className="home-blog-grid">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="home-blog-card"
              >
                <div className="home-blog-meta">
                  <span className="home-blog-category">
                    {ARTICLE_CATEGORIES[article.category]}
                  </span>
                  <span className="home-blog-date">
                    {new Date(article.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="home-blog-title">{article.title}</h3>
                <p className="home-blog-excerpt">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* WHY DOES THIS EXIST? */}
      <div className="section-head">
        <h2>Why does this exist?</h2>
      </div>
      <div className="home-mission">
        <p>
          Profanity is one of the most universal — and least documented — parts
          of human language. Every culture has words that shock, insult, and
          release tension. SwearDictionary catalogs them with the same rigor
          linguists give any other vocabulary: etymology, severity, regional
          variation, cultural context.
        </p>
        <p>
          This is an educational project. We believe understanding taboo language
          is part of understanding culture — whether you&apos;re a language
          learner, a traveler, a writer, or just curious about the words your
          phrasebook left out.
        </p>
      </div>

      {/* CALLOUT */}
      <div className="callout">
        <div className="callout-icon">🤬</div>
        <div>
          <h3>Know a word we&apos;re missing?</h3>
          <p>
            We&apos;re building the most comprehensive profanity database on the
            internet — and we need native speakers.{" "}
            <Link href="/submit">Submit a word</Link> and help us fill the gaps.
            Your grandmother would be so proud.
          </p>
        </div>
      </div>
      </div>
    </main>
  );
}
