import type { Metadata } from "next";
import { getAllWords, getLanguages } from "@/lib/queries";
import WordsGrid from "./WordsGrid";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const words = await getAllWords();
  const title = `All Swear Words — ${words.length} curse words across every language | SwearDictionary`;
  const description = `Browse ${words.length} swear words across ${new Set(words.map((w) => w.language.id)).size}+ languages. Filter by severity, category, or language. Every word rated, translated, and explained.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://sweardictionary.com/words",
      siteName: "SwearDictionary",
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function WordsPage() {
  const [words, languages] = await Promise.all([
    getAllWords(),
    getLanguages(),
  ]);

  return (
    <main className="words-main">
      <div className="words-container">
        {/* Header */}
        <div className="words-header">
          <div className="words-header-left">
            <nav className="breadcrumb">
              <span>words</span>
              <span className="sep">/</span>
              <span>all</span>
            </nav>
            <h1 className="words-title">
              Every Swear Word. <em>Every Language.</em>
            </h1>
            <p className="words-subtitle">
              The complete, unfiltered encyclopedia. Browse, filter, and
              discover profanity from {languages.length} languages — rated by
              severity and served with cultural context.
            </p>
          </div>
          <div className="words-header-right">
            <span className="words-total-label">total words</span>
            <span className="words-total-count">{words.length}</span>
          </div>
        </div>

        {/* Interactive grid */}
        <WordsGrid words={words} languages={languages} />
      </div>
    </main>
  );
}
