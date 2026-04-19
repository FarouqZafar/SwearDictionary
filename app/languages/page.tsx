import type { Metadata } from "next";
import { getLanguages } from "@/lib/queries";
import LanguageGrid from "./LanguageGrid";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Swear Words by Language — SwearDictionary",
  description:
    "Browse swear words & curse words from 40+ languages. Spanish, French, German, Japanese, Arabic — every language rated, translated & explained.",
  openGraph: {
    title: "Swear Words by Language — SwearDictionary",
    description:
      "Browse swear words & curse words from 40+ languages. Every language rated, translated & explained.",
    type: "website",
    url: "https://sweardictionary.com/languages",
    siteName: "SwearDictionary",
  },
  twitter: {
    card: "summary",
    title: "Swear Words by Language — SwearDictionary",
    description:
      "Browse swear words & curse words from 40+ languages. Every language rated, translated & explained.",
  },
  alternates: {
    canonical: "https://sweardictionary.com/languages",
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
            <h1 className="languages-title">
              Swear words by <em>language</em>
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
