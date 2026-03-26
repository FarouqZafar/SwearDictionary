import { getLanguages, getTrendingWords, getTotalWordCount } from "@/lib/queries";
import { SEVERITY_LABELS, SEVERITY_CLASSES, type SeverityLevel } from "@/types";

// Language flag mapping (for languages that don't have flag_emoji in DB)
const FLAG_MAP: Record<string, string> = {
  arabic: "🇸🇦",
  english: "🇬🇧",
  german: "🇩🇪",
  turkish: "🇹🇷",
  "farsi-persian": "🇮🇷",
  spanish: "🇪🇸",
  french: "🇫🇷",
  japanese: "🇯🇵",
  russian: "🇷🇺",
  korean: "🇰🇷",
  italian: "🇮🇹",
  portuguese: "🇧🇷",
};

// Short previews for featured language cards
const LANG_PREVIEWS: Record<string, string> = {
  turkish:
    'Turkish profanity is deeply tied to honor and family respect. From the versatile <em>siktir</em> to creative animal insults like <em>eşşoğlueşşek</em>, it\'s an art form.',
  german:
    'Strong, guttural, satisfying. <em>Scheiße</em> is just the beginning — Germans compound everything into gems like <em>Arschgeige</em> (butt violin).',
  arabic:
    'Arabic profanity revolves around family honor. Insults targeting mothers or sisters can provoke physical violence — it\'s serious business.',
  english:
    'The global standard. <em>Fuck</em> works as every part of speech, and <em>cunt</em> ranges from nuclear (US) to casual greeting (Australia).',
  "farsi-persian":
    'Persian insults are poetic yet devastating. Combining animal comparisons with creative compound curses.',
};

export const revalidate = 3600; // revalidate every hour

export default async function HomePage() {
  const [languages, trendingWords, totalWords] = await Promise.all([
    getLanguages(),
    getTrendingWords(6),
    getTotalWordCount(),
  ]);

  // Sort: most words first for the featured card
  const sortedLangs = [...languages].sort(
    (a, b) => b.word_count - a.word_count
  );
  const featured = sortedLangs[0];
  const gridLangs = sortedLangs.slice(1, 5);
  const miniLangs = sortedLangs.slice(0, 5);

  // Split trending: first is big, next 2 are stacked, rest are in flat row
  const bigWord = trendingWords[0];
  const stackedWords = trendingWords.slice(1, 3);
  const rowWords = trendingWords.slice(3, 6);

  return (
    <>
      {/* HERO — intentionally left-aligned, not centered */}
      <section className="hero">
        <div className="hero-eyebrow">
          {totalWords.toLocaleString()}+ words · {languages.length} languages ·
          zero filter
        </div>
        <h1>
          Learn how to offend
          <br />
          people <span className="italic">properly.</span>
        </h1>
        <p className="hero-sub">
          The only dictionary your teacher <strong>definitely</strong> didn't
          recommend. Explore swear words, insults, and creative profanity across
          every language — with severity ratings, cultural context, and the kind
          of detail you won't find on Duolingo.
        </p>

        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder='Try "scheisse", "putain", or just "fuck"...'
          />
        </div>
        <div className="search-hint">
          Popular right now: <span>joder</span> · <span>kuso</span> ·{" "}
          <span>cazzo</span> · <span>blyat</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-row">
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

      {/* LANGUAGES — asymmetric grid */}
      <div className="section-head">
        <h2>Browse by language</h2>
        <a href="/languages" className="see-all">
          all {languages.length} languages →
        </a>
      </div>

      <div className="lang-grid">
        {/* Featured: tall card spanning 2 rows */}
        {featured && (
          <a
            href={`/language/${featured.slug}`}
            className="lang-card featured"
          >
            <div>
              <span className="flag">
                {featured.flag_emoji || FLAG_MAP[featured.slug] || "🌍"}
              </span>
              <div className="lang-name">{featured.name}</div>
              <div className="lang-count">{featured.word_count} words</div>
              <div
                className="preview"
                dangerouslySetInnerHTML={{
                  __html:
                    LANG_PREVIEWS[featured.slug] ||
                    featured.description ||
                    "",
                }}
              />
            </div>
          </a>
        )}

        {/* Remaining 4 grid cards */}
        {gridLangs.map((lang) => (
          <a
            key={lang.id}
            href={`/language/${lang.slug}`}
            className="lang-card"
          >
            <span className="flag">
              {lang.flag_emoji || FLAG_MAP[lang.slug] || "🌍"}
            </span>
            <div className="lang-name">{lang.name}</div>
            <div className="lang-count">{lang.word_count} words</div>
            <div
              className="preview"
              dangerouslySetInnerHTML={{
                __html:
                  LANG_PREVIEWS[lang.slug] ||
                  (lang.description
                    ? lang.description.split(".").slice(0, 1).join(".") + "."
                    : ""),
              }}
            />
          </a>
        ))}
      </div>

      {/* Mini row */}
      <div className="lang-row">
        {miniLangs.map((lang) => (
          <a
            key={lang.id}
            href={`/language/${lang.slug}`}
            className="lang-mini"
          >
            <span className="flag">
              {lang.flag_emoji || FLAG_MAP[lang.slug] || "🌍"}
            </span>
            <div className="name">{lang.name}</div>
            <div className="ct">{lang.word_count} words</div>
          </a>
        ))}
      </div>

      {/* TRENDING / WORTH KNOWING */}
      <div className="section-head">
        <h2>Worth knowing</h2>
        <a href="#" className="see-all">
          trending →
        </a>
      </div>

      <div className="editorial">
        {/* Big card */}
        {bigWord && (
          <a
            href={`/language/${bigWord.language?.slug}/${bigWord.slug}`}
            className="word-card"
          >
            <div className="word-card-top">
              <div>
                <span className="word">{bigWord.word}</span>
                <span className="word-lang">
                  {" "}
                  {bigWord.language?.flag_emoji ||
                    FLAG_MAP[bigWord.language?.slug] ||
                    ""}
                </span>
              </div>
              <span
                className={`severity-badge ${SEVERITY_CLASSES[bigWord.severity as SeverityLevel]}`}
              >
                {SEVERITY_LABELS[bigWord.severity as SeverityLevel]}
              </span>
            </div>
            <div className="meaning">{bigWord.meaning}</div>
            {bigWord.cultural_context && (
              <div className="context">
                <strong>Cultural note:</strong> {bigWord.cultural_context}
              </div>
            )}
          </a>
        )}

        {/* Stacked smaller cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stackedWords.map((w) => (
            <a
              key={w.id}
              href={`/language/${w.language?.slug}/${w.slug}`}
              className="word-card"
            >
              <div className="word-card-top">
                <div>
                  <span className="word" style={{ fontSize: "22px" }}>
                    {w.word}
                  </span>
                  <span className="word-lang">
                    {" "}
                    {w.language?.flag_emoji ||
                      FLAG_MAP[w.language?.slug] ||
                      ""}
                  </span>
                </div>
                <span
                  className={`severity-badge ${SEVERITY_CLASSES[w.severity as SeverityLevel]}`}
                >
                  {SEVERITY_LABELS[w.severity as SeverityLevel]}
                </span>
              </div>
              <div className="meaning">{w.meaning}</div>
            </a>
          ))}
        </div>
      </div>

      {/* More words in a flat row */}
      {rowWords.length > 0 && (
        <div className="word-row">
          {rowWords.map((w) => (
            <a
              key={w.id}
              href={`/language/${w.language?.slug}/${w.slug}`}
              className="word-card"
            >
              <div className="word-card-top">
                <div>
                  <span className="word">{w.word}</span>
                  <span className="word-lang">
                    {" "}
                    {w.language?.flag_emoji ||
                      FLAG_MAP[w.language?.slug] ||
                      ""}
                  </span>
                </div>
                <span
                  className={`severity-badge ${SEVERITY_CLASSES[w.severity as SeverityLevel]}`}
                >
                  {SEVERITY_LABELS[w.severity as SeverityLevel]}
                </span>
              </div>
              <div className="meaning">{w.meaning}</div>
            </a>
          ))}
        </div>
      )}

      {/* CALLOUT */}
      <div className="callout">
        <div className="callout-icon">🤬</div>
        <div>
          <h3>Know a word we're missing?</h3>
          <p>
            We're building the most comprehensive profanity database on the
            internet — and we need native speakers.{" "}
            <a href="/submit">Submit a word</a> and help us fill the gaps. Your
            grandmother would be so proud.
          </p>
        </div>
      </div>
    </>
  );
}
