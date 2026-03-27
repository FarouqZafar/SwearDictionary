import type { Metadata } from "next";
import Link from "next/link";
import { getLanguages, getTotalWordCount, getTrendingWords } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About SwearDictionary — Multilingual Profanity Encyclopedia",
  description:
    "SwearDictionary catalogs swear words & profanity from 40+ languages with severity ratings, cultural context & real usage examples.",
  openGraph: {
    title: "About SwearDictionary — Multilingual Profanity Encyclopedia",
    description:
      "SwearDictionary catalogs swear words & profanity from 40+ languages with severity ratings, cultural context & real usage examples.",
    type: "website",
    url: "https://sweardictionary.com/about",
    siteName: "SwearDictionary",
  },
  twitter: {
    card: "summary",
    title: "About SwearDictionary — Multilingual Profanity Encyclopedia",
    description:
      "SwearDictionary catalogs swear words & profanity from 40+ languages with severity ratings, cultural context & real usage examples.",
  },
  alternates: { canonical: "https://sweardictionary.com/about" },
};

export default async function AboutPage() {
  const [languages, wordCount, trendingWords] = await Promise.all([
    getLanguages(),
    getTotalWordCount(),
    getTrendingWords(5),
  ]);

  const topLanguages = languages.slice(0, 5);

  return (
    <main className="about-page">
      <div className="about-hero">
        <h1>
          We&apos;re building the internet&apos;s most comprehensive profanity
          database.
        </h1>
        <p className="about-hero-sub">
          Your grandmother would not approve.
        </p>
      </div>

      <section className="about-section">
        <h2 className="about-section-label">What is this</h2>
        <p>
          SwearDictionary is a browsable encyclopedia of swear words across{" "}
          {languages.length}+ languages — complete with severity ratings,
          cultural context, pronunciation guides, and real usage examples. Built
          for language learners, travelers, writers, content moderators, and the
          just-plain-curious who want to understand how the world actually talks
          when the filter comes off.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-label">Why</h2>
        <p>
          Every existing swear word site is either ugly, incomplete, or just a
          flat word list with no context. We wanted something that actually
          explains the culture behind the cursing — why certain words hit harder
          in some regions, how severity shifts between generations, and what
          you&apos;d actually hear on the street versus what a textbook would
          never teach you.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-label">The numbers</h2>
        <div className="about-stats">
          <div className="about-stat">
            <span className="about-stat-num">{languages.length}</span>
            <span className="about-stat-label">Languages</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num">{wordCount.toLocaleString()}</span>
            <span className="about-stat-label">Words</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num">5</span>
            <span className="about-stat-label">Severity levels</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-label">Contribute</h2>
        <p>
          Know a word we&apos;re missing? We&apos;re building a submission
          system so native speakers can contribute words, corrections, and
          cultural context. In the meantime, reach out at{" "}
          <a href="mailto:hello@sweardictionary.com" style={{ color: "var(--accent)" }}>
            hello@sweardictionary.com
          </a>
          .
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-label">Popular languages</h2>
        <div className="about-links">
          {topLanguages.map((lang) => (
            <Link key={lang.id} href={`/language/${lang.slug}`} className="about-link">
              {lang.flag_emoji || "🌍"} {lang.name} ({lang.word_count} words)
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-label">Most viewed words</h2>
        <div className="about-links">
          {trendingWords.map((w) => (
            <Link key={w.id} href={`/language/${w.language?.slug}/${w.slug}`} className="about-link">
              {w.word} — {w.language?.name}
            </Link>
          ))}
        </div>
      </section>

      <p className="about-footer-note">Made with questionable intentions.</p>
    </main>
  );
}
