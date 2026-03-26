"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Language } from "@/types";

const FLAG_MAP: Record<string, string> = {
  arabic: "🇸🇦",
  chinese: "🇨🇳",
  english: "🇬🇧",
  french: "🇫🇷",
  german: "🇩🇪",
  hindi: "🇮🇳",
  italian: "🇮🇹",
  japanese: "🇯🇵",
  korean: "🇰🇷",
  kurdish: "🇮🇶",
  portuguese: "🇧🇷",
  russian: "🇷🇺",
  spanish: "🇪🇸",
  turkish: "🇹🇷",
  vietnamese: "🇻🇳",
  "farsi-persian": "🇮🇷",
};

type SortOption = "words_desc" | "words_asc" | "alpha";

export default function LanguageGrid({
  languages,
}: {
  languages: Language[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("words_desc");

  const filtered = useMemo(() => {
    let result = [...languages];

    if (search.trim()) {
      const q = search.toLowerCase();
      const matches = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.native_name && l.native_name.toLowerCase().includes(q)) ||
          l.slug.includes(q)
      );
      // Only filter if at least one language matches — otherwise the user
      // is likely typing a word to search, so keep showing all languages.
      if (matches.length > 0) result = matches;
    }

    switch (sort) {
      case "words_asc":
        result.sort((a, b) => a.word_count - b.word_count);
        break;
      case "alpha":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "words_desc":
      default:
        result.sort((a, b) => b.word_count - a.word_count);
        break;
    }

    return result;
  }, [languages, search, sort]);

  const featured = filtered[0];
  const grid = filtered.slice(1);

  const flag = (lang: Language) =>
    lang.flag_emoji || FLAG_MAP[lang.slug] || "🌍";

  const preview = (lang: Language) => {
    if (lang.description) return lang.description;
    if (lang.cultural_notes) {
      return lang.cultural_notes.split(".").slice(0, 2).join(".") + ".";
    }
    return `Explore swear words in ${lang.name}.`;
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = search.trim();
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  return (
    <>
      {/* Filter languages + Sort */}
      <form onSubmit={handleSearchSubmit} className="languages-controls">
        <div className="languages-search-wrap">
          <svg
            className="languages-search-icon"
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
            placeholder="Search languages or words... (press Enter to search words)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="languages-search-input"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="languages-sort-select"
        >
          <option value="words_desc">Most Words</option>
          <option value="words_asc">Fewest Words</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </form>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🤷</div>
          <p>No languages match &ldquo;{search}&rdquo;.</p>
        </div>
      )}

      {/* Featured card */}
      {featured && (
        <div className="languages-featured">
          <Link
            href={`/language/${featured.slug}`}
            className="featured-lang-card"
          >
            <div className="featured-lang-bg">{flag(featured)}</div>
            <div className="featured-lang-content">
              <div className="featured-lang-info">
                <div className="featured-lang-head">
                  <span className="featured-lang-flag">{flag(featured)}</span>
                  <h2 className="featured-lang-name">{featured.name}</h2>
                </div>
                <div className="featured-lang-meta">
                  {featured.word_count} words
                  <span className="featured-lang-dot">·</span>
                  Featured
                </div>
                <p className="featured-lang-desc">{preview(featured)}</p>
              </div>
              <div className="featured-lang-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid */}
      {grid.length > 0 && (
        <div className="languages-grid">
          {grid.map((lang) => (
            <Link
              key={lang.id}
              href={`/language/${lang.slug}`}
              className="lang-grid-card"
            >
              <div className="lang-grid-card-head">
                <span className="lang-grid-flag">{flag(lang)}</span>
                <h3 className="lang-grid-name">{lang.name}</h3>
              </div>
              <div className="lang-grid-meta">
                {lang.word_count} words
              </div>
              <p className="lang-grid-desc">{preview(lang)}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
