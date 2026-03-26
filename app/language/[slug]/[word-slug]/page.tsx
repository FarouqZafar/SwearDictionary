import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getWordBySlug, getRelatedWords, getAllWordSlugs } from "@/lib/queries";
import { SEVERITY_LABELS, type SeverityLevel } from "@/types";
import ViewTracker from "./ViewTracker";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllWordSlugs();
  return slugs.map((s) => ({ slug: s.slug, "word-slug": s.wordSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; "word-slug": string }>;
}): Promise<Metadata> {
  const { slug, "word-slug": wordSlug } = await params;
  const word = await getWordBySlug(slug, wordSlug);
  if (!word) return { title: "Word not found" };

  const title = `${word.word} — ${word.language.name} swear word meaning, severity & usage`;
  const description = word.meaning
    || `Learn the meaning, severity, and cultural context of "${word.word}" in ${word.language.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://sweardictionary.com/language/${slug}/${wordSlug}`,
      siteName: "SwearDictionary",
    },
    twitter: { card: "summary", title, description },
  };
}

const FLAG_MAP: Record<string, string> = {
  arabic: "🇸🇦", chinese: "🇨🇳", english: "🇬🇧", french: "🇫🇷",
  german: "🇩🇪", hindi: "🇮🇳", italian: "🇮🇹", japanese: "🇯🇵",
  korean: "🇰🇷", kurdish: "🇮🇶", portuguese: "🇧🇷", russian: "🇷🇺",
  spanish: "🇪🇸", turkish: "🇹🇷", vietnamese: "🇻🇳", "farsi-persian": "🇮🇷",
};

function severityColor(sev: number): string {
  if (sev <= 1) return "var(--green)";
  if (sev === 2) return "var(--yellow)";
  if (sev === 3) return "var(--orange)";
  if (sev === 4) return "var(--red)";
  return "var(--skull)";
}

function severityDesc(sev: number): string {
  switch (sev) {
    case 1: return "Mild. Safe in most casual settings. Your grandma might use it.";
    case 2: return "Moderate. Common in everyday speech but not for polite company.";
    case 3: return "Strong. Will turn heads in public. Normal among close friends.";
    case 4: return "Severe. Not appropriate for professional settings or around strangers.";
    case 5: return "Nuclear. The worst it gets. Will provoke strong reactions anywhere.";
    default: return "";
  }
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ slug: string; "word-slug": string }>;
}) {
  const { slug, "word-slug": wordSlug } = await params;
  const word = await getWordBySlug(slug, wordSlug);
  if (!word) notFound();

  const related = await getRelatedWords(word.language_id, word.slug);
  const flag = word.language.flag_emoji || FLAG_MAP[slug] || "🌍";
  const categories = word.categories.map((c) => c.replace("_", " ")).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word.word,
    description: word.meaning || `${word.word} — a ${word.language.name} swear word`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "SwearDictionary",
      url: "https://sweardictionary.com",
    },
    inLanguage: word.language.iso_code || word.language.name,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sweardictionary.com" },
      { "@type": "ListItem", position: 2, name: word.language.name, item: `https://sweardictionary.com/language/${slug}` },
      { "@type": "ListItem", position: 3, name: word.word },
    ],
  };

  return (
    <main className="word-page">
      <ViewTracker wordId={word.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="word-page-container">
        {/* Breadcrumb */}
        <nav className="word-breadcrumb">
          <Link href="/languages">languages</Link>
          <span className="word-bc-sep">/</span>
          <Link href={`/language/${slug}`} className="word-bc-lang">
            <span className="word-bc-flag">{flag}</span> {slug}
          </Link>
          <span className="word-bc-sep">/</span>
          <span className="word-bc-current">{word.word}</span>
        </nav>

        {/* Two-column layout */}
        <div className="word-layout">
          {/* Main content */}
          <div className="word-main">
            {/* Hero */}
            <section className="word-hero">
              <h1 className="word-hero-title">{word.word}</h1>
              <div className="word-hero-meta">
                {word.ipa_pronunciation && (
                  <span className="word-ipa-badge">/{word.ipa_pronunciation}/</span>
                )}
                {categories && (
                  <>
                    <span className="word-meta-dot" />
                    <span className="word-categories-text">{categories}</span>
                  </>
                )}
              </div>

              {word.literal_translation && (
                <div className="word-literal">
                  <h2 className="word-section-label">Literal Translation</h2>
                  <p className="word-literal-text">{word.literal_translation}</p>
                </div>
              )}
            </section>

            {/* Meaning / Usage */}
            {word.meaning && (
              <section className="word-section">
                <h2 className="word-section-label word-section-label--accent">
                  <span className="word-label-line" /> Meaning &amp; Usage
                </h2>
                <div className="word-definition-card word-definition-card--primary">
                  <div className="word-def-accent-bar" />
                  <div className="word-def-body">
                    <span className="word-def-num">01</span>
                    <div>
                      <h3 className="word-def-title">
                        {word.english_equivalent
                          ? `"${word.english_equivalent}"`
                          : "Primary Usage"}
                      </h3>
                      <p className="word-def-text">{word.meaning}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Example */}
            {word.example_usage && (
              <section className="word-section">
                <h2 className="word-section-label">
                  <span className="word-label-line word-label-line--dim" /> Examples in the Wild
                </h2>
                <div className="word-example-row">
                  <div className="word-example-text">
                    <p className="word-example-original">{word.example_usage}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Example sentences from JSON */}
            {word.example_sentences && word.example_sentences.length > 0 && (
              <section className="word-section">
                {!word.example_usage && (
                  <h2 className="word-section-label">
                    <span className="word-label-line word-label-line--dim" /> Examples in the Wild
                  </h2>
                )}
                <div className="word-examples-list">
                  {word.example_sentences.map((ex, i) => (
                    <div key={i} className="word-example-row">
                      <div className="word-example-text">
                        <p className="word-example-original">
                          &ldquo;{ex.original}&rdquo;
                        </p>
                        <p className="word-example-translation">
                          &ldquo;{ex.translation}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="word-sidebar">
            {/* Severity */}
            <div className="word-severity-card">
              <h3 className="word-sidebar-label">Severity Rating</h3>
              <div className="word-severity-score">
                <span className="word-severity-num">{word.severity}</span>
                <span className="word-severity-of">/ 5</span>
              </div>
              <div className="word-severity-bar">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`word-sev-segment ${i === 1 ? "first" : ""} ${i === 5 ? "last" : ""}`}
                    style={{
                      background:
                        i <= word.severity
                          ? severityColor(word.severity)
                          : "var(--border)",
                    }}
                  />
                ))}
              </div>
              <p className="word-severity-desc">
                <strong>
                  {SEVERITY_LABELS[word.severity as SeverityLevel]
                    ? SEVERITY_LABELS[word.severity as SeverityLevel].charAt(0).toUpperCase() +
                      SEVERITY_LABELS[word.severity as SeverityLevel].slice(1)
                    : ""}
                  .
                </strong>{" "}
                {severityDesc(word.severity)}
              </p>
            </div>

            {/* Cultural Context */}
            {word.cultural_context && (
              <div className="word-context-block">
                <h3 className="word-context-title">Cultural Context</h3>
                <p className="word-context-text">{word.cultural_context}</p>
              </div>
            )}

            {/* Related Words */}
            {related.length > 0 && (
              <div className="word-related">
                <div className="word-related-header">
                  <h3 className="word-sidebar-label">Related Words</h3>
                </div>
                <div className="word-related-list">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/language/${slug}/${r.slug}`}
                      className="word-related-card"
                    >
                      <div>
                        <h4 className="word-related-name">{r.word}</h4>
                        <p className="word-related-translation">
                          {r.english_equivalent || r.literal_translation || ""}
                        </p>
                      </div>
                      <span
                        className="word-related-sev"
                        style={{ color: severityColor(r.severity) }}
                      >
                        {SEVERITY_LABELS[r.severity as SeverityLevel] || ""}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Audio button placeholder */}
            {word.ipa_pronunciation && (
              <button className="word-audio-btn">
                <div className="word-audio-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Listen to pronunciation</span>
              </button>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
