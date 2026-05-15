import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getWordBySlug, getWordInOtherLanguages, getMoreWordsInLanguage, getAllWordSlugs } from "@/lib/queries";
import { SEVERITY_LABELS, type SeverityLevel } from "@/types";
import ViewTracker from "./ViewTracker";
import { LANGUAGE_LOCALE_MAP } from "@/lib/hreflang";
import PronounceButton from "./PronounceButton";
import { cleanIpa } from "@/lib/ipa";

export const revalidate = false;
export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await getAllWordSlugs();
  return all.map(({ slug, wordSlug }) => ({ slug, "word-slug": wordSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; "word-slug": string }>;
}): Promise<Metadata> {
  const { slug, "word-slug": wordSlug } = await params;
  const word = await getWordBySlug(slug, wordSlug);
  if (!word) return { title: "Word not found" };

  const title = `${word.word} meaning in ${word.language.name} — SwearDictionary`;
  const meaningSnippet = word.meaning
    ? word.meaning.slice(0, 70).trimEnd()
    : `a ${word.language.name} swear word`;
  const description = `What does "${word.word}" mean? ${meaningSnippet}... Severity rating & cultural context.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://sweardictionary.com/language/${slug}/${wordSlug}`,
      siteName: "SwearDictionary",
      images: [{ url: "https://sweardictionary.com/og-default.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `https://sweardictionary.com/language/${slug}/${wordSlug}`,
    },
  };
}

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

  const otherLanguages = await getWordInOtherLanguages(word, word.language_id);
  const moreWords = await getMoreWordsInLanguage(word.language_id, word.slug, []);
  const flag = word.language.flag_emoji || "🌍";
  const categories = word.categories.map((c) => c.replace("_", " ")).join(", ");

  const langCode = word.language.iso_code || LANGUAGE_LOCALE_MAP[slug] || "en";
  const wordUrl = `https://sweardictionary.com/language/${slug}/${wordSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word.word,
    description: word.meaning || `${word.word} — a ${word.language.name} swear word`,
    url: wordUrl,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `${word.language.name} swear words`,
      url: `https://sweardictionary.com/language/${slug}`,
    },
    inLanguage: langCode,
  };

  const faqEntries: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] = [];
  if (word.meaning) {
    faqEntries.push({
      "@type": "Question",
      name: `What does ${word.word} mean?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: word.meaning,
      },
    });
  }
  if (word.ipa_pronunciation) {
    faqEntries.push({
      "@type": "Question",
      name: `How do you pronounce ${word.word}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${word.word} is pronounced [${cleanIpa(word.ipa_pronunciation)}] in IPA.`,
      },
    });
  }
  if (word.english_equivalent) {
    faqEntries.push({
      "@type": "Question",
      name: `What is the English equivalent of ${word.word}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `The closest English equivalent of ${word.word} is "${word.english_equivalent}".`,
      },
    });
  }
  const faqLd = faqEntries.length >= 2 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries,
  } : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sweardictionary.com" },
      { "@type": "ListItem", position: 2, name: word.language.name, item: `https://sweardictionary.com/language/${slug}` },
      { "@type": "ListItem", position: 3, name: word.word, item: wordUrl },
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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
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
                  <span className="word-ipa-badge">{cleanIpa(word.ipa_pronunciation)}</span>
                )}
                <PronounceButton
                  word={word.word}
                  languageSlug={slug}
                  isoCode={word.language.iso_code}
                />
                {categories && (
                  <>
                    <span className="word-meta-dot" />
                    <span className="word-categories-text">{categories}</span>
                  </>
                )}
              </div>
              <p className="word-intro-sentence">
                What does <strong>{word.word}</strong> mean?{" "}
                {word.word} is a {word.language.name}{" "}
                {SEVERITY_LABELS[word.severity as SeverityLevel] || "swear word"}
                {word.english_equivalent
                  ? <> that translates to &ldquo;{word.english_equivalent}&rdquo; in English.</>
                  : <>.</>
                }
              </p>

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

            {/* Regional Variations */}
            {word.regional_variations && word.regional_variations.length > 0 && (
              <section className="word-section">
                <h2 className="word-section-label">
                  <span className="word-label-line word-label-line--dim" /> Regional Variations
                </h2>
                <div className="word-regions-grid">
                  {word.regional_variations.map((rv, i) => {
                    // Handle both string[] and {region, severity, note}[] formats
                    const isString = typeof rv === "string";
                    const region = isString ? rv : rv.region;
                    const sev = isString ? null : rv.severity;
                    const note = isString ? null : rv.note;
                    return (
                      <div key={i} className="word-region-card">
                        <div className="word-region-header">
                          <span className="word-region-name">{region}</span>
                          {sev && (
                            <span
                              className="word-region-sev"
                              style={{ color: severityColor(sev) }}
                            >
                              {SEVERITY_LABELS[sev as SeverityLevel] || ""}
                            </span>
                          )}
                        </div>
                        {note && <p className="word-region-note">{note}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* When to use / When NOT to use */}
            <section className="word-section">
              <h2 className="word-section-label word-section-label--accent">
                <span className="word-label-line" /> When to Use It
              </h2>
              <div className="word-usage-grid">
                <div className="word-usage-card word-usage-card--do">
                  <h3 className="word-usage-card-title word-usage-card-title--do">Context</h3>
                  <ul className="word-usage-list">
                    {word.severity <= 2 && <li>Casual conversations with friends</li>}
                    {word.severity <= 3 && <li>Informal settings where profanity is accepted</li>}
                    {word.severity >= 3 && <li>Expressing strong frustration or emphasis</li>}
                    {word.severity >= 4 && <li>Only among very close friends who share this register</li>}
                    {word.categories.includes("exclamation") && <li>As a spontaneous exclamation</li>}
                    {word.categories.includes("insult") && <li>Direct confrontation (use with caution)</li>}
                  </ul>
                </div>
                <div className="word-usage-card word-usage-card--dont">
                  <h3 className="word-usage-card-title word-usage-card-title--dont">Avoid</h3>
                  <ul className="word-usage-list">
                    <li>Professional or formal settings</li>
                    {word.severity >= 3 && <li>Around elders or authority figures</li>}
                    {word.severity >= 4 && <li>Public spaces — will cause genuine offense</li>}
                    {word.severity >= 5 && <li>Almost any situation — this is as offensive as it gets</li>}
                    {word.categories.includes("religious") && <li>Around religious or conservative communities</li>}
                    {word.categories.includes("sexual") && <li>Mixed company or unfamiliar social groups</li>}
                    <li>Job interviews, meetings, or customer-facing situations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cultural Context */}
            {word.cultural_context && (
              <section className="word-section">
                <div className="word-context-block">
                  <h3 className="word-context-title">Cultural Context</h3>
                  {word.cultural_context
                    .split(/\n\s*\n/)
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0)
                    .map((para, i) => (
                      <p key={i} className="word-context-text">
                        {para}
                      </p>
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

            {/* In Other Languages */}
            {otherLanguages.length > 0 && (
              <div className="word-related">
                <div className="word-related-header">
                  <h3 className="word-sidebar-label">In Other Languages</h3>
                </div>
                <div className="word-related-list">
                  {otherLanguages.map((ol) => (
                    <Link
                      key={ol.id}
                      href={`/language/${ol.language.slug}/${ol.slug}`}
                      className="word-related-card"
                    >
                      <div>
                        <div className="word-other-lang-row">
                          <span className="word-other-lang-flag">{ol.language.flag_emoji || "🌍"}</span>
                          <span className="word-other-lang-name">{ol.language.name}</span>
                        </div>
                        <h4 className="word-related-name">{ol.word}</h4>
                        {ol.english_equivalent && (
                          <p className="word-related-translation">
                            &ldquo;{ol.english_equivalent}&rdquo;
                          </p>
                        )}
                      </div>
                      <span
                        className="word-related-sev"
                        style={{ color: severityColor(ol.severity) }}
                      >
                        {SEVERITY_LABELS[ol.severity as SeverityLevel] || ""}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>

        {/* More in [Language] */}
        {moreWords.length > 0 && (
          <section className="word-more-section">
            <div className="word-more-header">
              <h2 className="word-more-title">
                More in {word.language.name} {flag}
              </h2>
              <Link href={`/language/${slug}`} className="word-more-link">
                View all →
              </Link>
            </div>
            <div className="word-more-grid">
              {moreWords.map((mw) => (
                <Link
                  key={mw.id}
                  href={`/language/${slug}/${mw.slug}`}
                  className="word-card"
                >
                  <div className="word-card-top">
                    <span
                      className="word-card-sev"
                      style={{ color: severityColor(mw.severity) }}
                    >
                      {mw.severity} / 5
                    </span>
                    <span className="word-card-cat">
                      {mw.categories.slice(0, 2).map((c) => c.replace("_", " ")).join(", ")}
                    </span>
                  </div>
                  <div className="word-card-name-row">
                    <h3 className="word-card-name">{mw.word}</h3>
                  </div>
                  {mw.ipa_pronunciation && (
                    <span className="word-card-ipa">{cleanIpa(mw.ipa_pronunciation)}</span>
                  )}
                  {mw.english_equivalent && (
                    <p className="word-card-equiv">&ldquo;{mw.english_equivalent}&rdquo;</p>
                  )}
                  {mw.meaning && (
                    <p className="word-card-meaning">{mw.meaning}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}


      </div>
    </main>
  );
}
