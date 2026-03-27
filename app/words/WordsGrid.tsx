"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Word, Language } from "@/types";
import PronounceButton from "@/app/language/[slug]/[word-slug]/PronounceButton";

const CARDS_PER_PAGE = 12;

const SEVERITY_OPTIONS = [
  { value: 0, label: "All", min: 1, max: 5 },
  { value: 1, label: "Mild (1–2)", min: 1, max: 2 },
  { value: 2, label: "Moderate (3)", min: 3, max: 3 },
  { value: 3, label: "Strong (4)", min: 4, max: 4 },
  { value: 4, label: "Severe (5)", min: 5, max: 5 },
];

const CATEGORY_OPTIONS = [
  "insult",
  "exclamation",
  "sexual",
  "scatological",
  "religious",
  "body_part",
];

type SortOption = "views" | "severity" | "alpha" | "newest";

function severityColor(sev: number): string {
  if (sev <= 1) return "var(--green)";
  if (sev === 2) return "var(--yellow)";
  if (sev === 3) return "var(--orange)";
  if (sev === 4) return "var(--red)";
  return "var(--skull)";
}

function severityLabel(sev: number): string {
  if (sev <= 1) return "mild";
  if (sev === 2) return "moderate";
  if (sev === 3) return "strong";
  if (sev === 4) return "severe";
  return "nuclear";
}

function categoryLabel(cats: string[]): string {
  if (!cats.length) return "";
  return cats
    .slice(0, 2)
    .map((c) => c.replace("_", " "))
    .join(", ");
}

export default function WordsGrid({
  words,
  languages,
}: {
  words: (Word & { language: Language })[];
  languages: Language[];
}) {
  const [severityFilter, setSeverityFilter] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("views");
  const [page, setPage] = useState(1);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...words];

    if (severityFilter > 0) {
      const opt = SEVERITY_OPTIONS[severityFilter];
      result = result.filter(
        (w) => w.severity >= opt.min && w.severity <= opt.max
      );
    }

    if (selectedCategories.size > 0) {
      result = result.filter((w) =>
        w.categories.some((c) => selectedCategories.has(c))
      );
    }

    if (languageFilter !== "all") {
      result = result.filter((w) => w.language.slug === languageFilter);
    }

    switch (sort) {
      case "severity":
        result.sort((a, b) => b.severity - a.severity);
        break;
      case "alpha":
        result.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "views":
      default:
        result.sort((a, b) => b.views - a.views);
        break;
    }

    return result;
  }, [words, severityFilter, selectedCategories, languageFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const activeFilterCount =
    (severityFilter > 0 ? 1 : 0) +
    selectedCategories.size +
    (languageFilter !== "all" ? 1 : 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    const q = input?.value.trim();
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  const handleRandomWord = () => {
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    window.location.href = `/language/${random.language.slug}/${random.slug}`;
  };

  const pageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="words-body">
      {/* Search bar */}
      <div className="words-search-row">
        <form onSubmit={handleSearch} className="words-search-form">
          <div className="words-search-wrap">
            <svg
              className="words-search-icon"
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
              placeholder="Search for a word... (press Enter)"
              className="words-search-input"
            />
          </div>
        </form>
        <button
          type="button"
          className="words-random-btn"
          onClick={handleRandomWord}
        >
          <svg
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
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
          </svg>
          <span className="words-random-text">Random Word</span>
        </button>
      </div>

      {/* Filters */}
      <div className="words-filters">
        <div className="words-filters-row">
          {/* Severity pills */}
          <div className="words-filter-group">
            <span className="words-filter-label">Severity</span>
            <div className="words-severity-pills">
              {SEVERITY_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  className={`sev-pill ${severityFilter === i ? "active" : ""}`}
                  onClick={() => {
                    setSeverityFilter(i);
                    setPage(1);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language dropdown */}
          <div className="words-filter-group">
            <span className="words-filter-label">Language</span>
            <select
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                setPage(1);
              }}
              className="words-lang-select"
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.slug}>
                  {lang.flag_emoji || "🌍"} {lang.name} ({lang.word_count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="words-filter-group">
            <span className="words-filter-label">Sort</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOption);
                setPage(1);
              }}
              className="words-sort-select"
            >
              <option value="views">Most Viewed</option>
              <option value="severity">Severity (high→low)</option>
              <option value="alpha">A — Z</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Category checkboxes */}
        <div className="words-filter-group">
          <span className="words-filter-label">Categories</span>
          <div className="words-category-row">
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} className="category-check">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Active filter count */}
        {activeFilterCount > 0 && (
          <div className="words-filter-status">
            <span className="words-filter-count">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
              active
            </span>
            <span className="words-filter-sep">·</span>
            <span className="words-result-count">
              {filtered.length} word{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              className="words-clear-btn"
              onClick={() => {
                setSeverityFilter(0);
                setSelectedCategories(new Set());
                setLanguageFilter("all");
                setPage(1);
              }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Word card grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤷</div>
          <p>No words match those filters.</p>
        </div>
      ) : (
        <>
          <div className="words-card-grid">
            {paginated.map((w) => (
              <Link
                key={w.id}
                href={`/language/${w.language.slug}/${w.slug}`}
                className="word-card"
              >
                <div className="word-card-top">
                  <span
                    className="word-card-sev"
                    style={{ color: severityColor(w.severity) }}
                  >
                    {severityLabel(w.severity)}
                  </span>
                  <span className="word-card-cat">
                    {categoryLabel(w.categories)}
                  </span>
                </div>
                <div className="word-card-name-row">
                  <h3 className="word-card-name">{w.word}</h3>
                  <PronounceButton
                    word={w.word}
                    languageSlug={w.language.slug}
                    isoCode={w.language.iso_code}
                    className="pronounce-btn--card"
                    iconSize={14}
                  />
                </div>
                <div className="word-card-lang">
                  <span className="word-card-flag">
                    {w.language.flag_emoji || "🌍"}
                  </span>
                  <span className="word-card-lang-name">
                    {w.language.name}
                  </span>
                </div>
                {w.english_equivalent && (
                  <p className="word-card-meaning">
                    &ldquo;{w.english_equivalent}&rdquo;
                    {w.meaning
                      ? ` — ${w.meaning}`
                      : ""}
                  </p>
                )}
                {!w.english_equivalent && w.meaning && (
                  <p className="word-card-meaning">{w.meaning}</p>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                &larr;
              </button>
              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="page-dots">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${currentPage === p ? "active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
