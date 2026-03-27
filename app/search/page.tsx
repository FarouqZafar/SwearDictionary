import Link from "next/link";
import type { Metadata } from "next";
import { searchWords } from "@/lib/queries";
import { SEVERITY_LABELS, SEVERITY_CLASSES, type SeverityLevel } from "@/types";
import type { Language } from "@/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  return {
    title: query ? `Search: ${query} — SwearDictionary` : "Search — SwearDictionary",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchWords(query) : [];

  // Group results by language
  const grouped = new Map<string, { language: Language; words: typeof results }>();
  for (const word of results) {
    const langId = word.language_id;
    if (!grouped.has(langId)) {
      grouped.set(langId, { language: word.language, words: [] });
    }
    grouped.get(langId)!.words.push(word);
  }

  return (
    <main className="search-page">
      <div className="search-page-container">
        {/* Search form */}
        <form action="/search" method="GET" className="search-page-form">
          <div className="search-page-input-wrap">
            <svg
              className="search-page-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
              defaultValue={query}
              placeholder='Search for a word... (e.g. "putain", "scheisse", "fuck")'
              className="search-page-input"
              autoFocus
            />
          </div>
        </form>

        {/* Results heading */}
        {query && (
          <div className="search-results-header">
            <h1 className="search-results-title">
              Results for &ldquo;{query}&rdquo;
            </h1>
            <span className="search-results-count">
              {results.length} {results.length === 1 ? "word" : "words"} found
            </span>
          </div>
        )}

        {/* No query state */}
        {!query && (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <p>Type a word to search across all languages.</p>
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">🤷</div>
            <p>No words found for &ldquo;{query}&rdquo;.</p>
            <p className="search-empty-sub">
              Know one we&apos;re missing?{" "}
              <Link href="/submit" className="search-empty-link">
                Submit a word
              </Link>
            </p>
          </div>
        )}

        {/* Grouped results */}
        {Array.from(grouped.values()).map(({ language, words }) => (
          <section key={language.id} className="search-lang-group">
            <div className="search-lang-header">
              <span className="search-lang-flag">
                {language.flag_emoji || "🌍"}
              </span>
              <h2 className="search-lang-name">{language.name}</h2>
              <span className="search-lang-count">{words.length}</span>
            </div>
            <div className="search-results-grid">
              {words.map((word) => (
                <Link
                  key={word.id}
                  href={`/language/${language.slug}/${word.slug}`}
                  className="search-result-card"
                >
                  <div className="search-result-top">
                    <h3 className="search-result-word">{word.word}</h3>
                    <span
                      className={`severity-badge ${SEVERITY_CLASSES[word.severity as SeverityLevel]}`}
                    >
                      {SEVERITY_LABELS[word.severity as SeverityLevel]}
                    </span>
                  </div>
                  {(word.english_equivalent || word.literal_translation) && (
                    <p className="search-result-translation">
                      {word.english_equivalent || word.literal_translation}
                    </p>
                  )}
                  {word.meaning && (
                    <p className="search-result-meaning">
                      {word.meaning.length > 120
                        ? word.meaning.slice(0, 120) + "..."
                        : word.meaning}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
