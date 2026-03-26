import type { Metadata } from "next";
import { getLanguages } from "@/lib/queries";
import LanguageGrid from "./LanguageGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Languages — SwearDictionary",
  description:
    "Browse profanity across 40+ languages and counting. From subtle insults to explosive exclamations, discover how the world expresses frustration.",
  openGraph: {
    title: "All Languages — SwearDictionary",
    description:
      "Browse profanity across 40+ languages. Discover how the world swears.",
    type: "website",
    url: "https://sweardictionary.com/languages",
    siteName: "SwearDictionary",
  },
  twitter: {
    card: "summary",
    title: "All Languages — SwearDictionary",
  },
};

export default async function LanguagesPage() {
  const languages = await getLanguages();

  return (
    <main className="languages-main">
      <div className="languages-container">
        {/* Header */}
        <div className="languages-header">
          <div className="languages-header-left">
            <nav className="breadcrumb">
              <a href="/">languages</a>
              <span className="sep">/</span>
              <span>all</span>
            </nav>
            <h1 className="languages-title">
              All <em>Languages</em>
            </h1>
            <p className="languages-desc">
              Browse profanity across {languages.length} languages and counting.
              From subtle insults to explosive exclamations, discover how the
              world expresses frustration.
            </p>
          </div>
          <div className="languages-header-right">
            <span className="languages-total-label">Total Languages</span>
            <span className="languages-total-count">{languages.length}</span>
          </div>
        </div>

        {/* Client component handles search, sort, grid */}
        <LanguageGrid languages={languages} />
      </div>
    </main>
  );
}
