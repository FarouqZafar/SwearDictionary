"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Word } from "@/types";
import { type SeverityLevel } from "@/types";

const CARDS_PER_PAGE = 18;

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

function severityColor(sev: number): string {
  if (sev <= 1) return "var(--green)";
  if (sev === 2) return "var(--yellow)";
  if (sev === 3) return "var(--orange)";
  if (sev === 4) return "var(--red)";
  return "var(--skull)";
}

function categoryLabel(cats: string[]): string {
  if (!cats.length) return "";
  return cats
    .slice(0, 2)
    .map((c) => c.replace("_", " "))
    .join(", ");
}

export default function WordFilters({
  words,
  languageSlug,
  languageName,
  nativeName,
}: {
  words: Word[];
  languageSlug: string;
  languageName: string;
  nativeName: string | null;
}) {
  const [severityFilter, setSeverityFilter] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
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
      result = result.filter((w) => w.severity >= opt.min && w.severity <= opt.max);
    }

    if (selectedCategories.size > 0) {
      result = result.filter((w) =>
        w.categories.some((c) => selectedCategories.has(c))
      );
    }

    return result;
  }, [words, severityFilter, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  // Quick stats
  const highSeverityPct = words.length
    ? Math.round((words.filter((w) => w.severity >= 4).length / words.length) * 100)
    : 0;
  const categoryCounts = words.reduce<Record<string, number>>((acc, w) => {
    w.categories.forEach((c) => { acc[c] = (acc[c] || 0) + 1; });
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  // Page numbers for pagination
  const pageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    const q = input?.value.trim();
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  return (
    <div className="lang-body-wrap">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="lang-search-form">
        <div className="lang-search-wrap">
          <svg
            className="lang-search-icon"
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
            placeholder={`Search words in ${languageName}...`}
            className="lang-search-input"
          />
        </div>
      </form>

      <div className="lang-body">
      {/* Sidebar */}
      <aside className="lang-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-label">Filters</h3>

          <div className="sidebar-field">
            <div className="sidebar-field-header">
              <span>Severity Level</span>
              <span className="sidebar-field-value">1 — 5</span>
            </div>
            <div className="severity-pills">
              {SEVERITY_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  className={`sev-pill ${severityFilter === i ? "active" : ""}`}
                  onClick={() => { setSeverityFilter(i); setPage(1); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-field">
            <span className="sidebar-sublabel">Language</span>
            <div className="sidebar-lang-display">
              {languageName}{nativeName ? ` (${nativeName})` : ""}
            </div>
          </div>

          <div className="sidebar-field">
            <span className="sidebar-sublabel">Categories</span>
            <div className="category-checks">
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
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-label">Quick Stats</h3>
          <div className="stat-row">
            <span>High Severity</span>
            <span className="stat-value" style={{ color: "var(--red)" }}>{highSeverityPct}%</span>
          </div>
          {topCategories.map(([cat, count]) => (
            <div key={cat} className="stat-row">
              <span>{cat.replace("_", " ")}</span>
              <span className="stat-value">{count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Card Grid */}
      <div className="lang-grid-area">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤷</div>
            <p>No words match those filters.</p>
          </div>
        ) : (
          <>
            <div className="word-card-grid">
              {paginated.map((w) => (
                <Link
                  key={w.id}
                  href={`/language/${languageSlug}/${w.slug}`}
                  className="word-card"
                >
                  <div className="word-card-top">
                    <span
                      className="word-card-sev"
                      style={{ color: severityColor(w.severity) }}
                    >
                      {w.severity} / 5
                    </span>
                    <span className="word-card-cat">
                      {categoryLabel(w.categories)}
                    </span>
                  </div>
                  <h3 className="word-card-name">{w.word}</h3>
                  {w.ipa_pronunciation && (
                    <span className="word-card-ipa">/{w.ipa_pronunciation}/</span>
                  )}
                  {w.meaning && (
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
                    <span key={`dots-${i}`} className="page-dots">...</span>
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
    </div>
    </div>
  );
}
