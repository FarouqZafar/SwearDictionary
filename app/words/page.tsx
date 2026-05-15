import type { Metadata } from "next";
import { getAllWords, getLanguages } from "@/lib/queries";
import WordsGrid from "./WordsGrid";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const words = await getAllWords();
  const langCount = new Set(words.map((w) => w.language.id)).size;
  const title = `Swear Words from Every Language | SwearDictionary`;
  const description = `Browse ${words.length.toLocaleString()} swear words & curse words from ${langCount}+ languages. Filter by severity, category, or language. Every word rated, translated & explained.`;

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
    alternates: { canonical: "https://sweardictionary.com/words" },
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
