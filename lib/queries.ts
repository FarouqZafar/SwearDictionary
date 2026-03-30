import { supabase } from "./supabase";
import type { Language, Word, Article } from "@/types";

export async function getLanguages(): Promise<Language[]> {
  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .order("word_count", { ascending: false });

  if (error) {
    console.error("Failed to fetch languages:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTrendingWords(limit = 6): Promise<(Word & { language: Language })[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*, language:languages(*)")
    .eq("is_published", true)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch trending words:", error.message);
    return [];
  }
  return (data ?? []) as (Word & { language: Language })[];
}

export async function getWordsByLanguage(
  languageId: string,
  limit = 5
): Promise<Word[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("language_id", languageId)
    .eq("is_published", true)
    .order("severity", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch words:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTotalWordCount(): Promise<number> {
  const { count, error } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  if (error) return 0;
  return count ?? 0;
}

export async function getLanguageBySlug(slug: string): Promise<Language | null> {
  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to fetch language:", error.message);
    return null;
  }
  return data;
}

export async function getAllWordsByLanguage(languageId: string): Promise<Word[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("language_id", languageId)
    .eq("is_published", true)
    .order("views", { ascending: false });

  if (error) {
    console.error("Failed to fetch words:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllLanguageSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("languages")
    .select("slug");

  if (error) {
    console.error("Failed to fetch language slugs:", error.message);
    return [];
  }
  return (data ?? []).map((l) => l.slug);
}

export async function getWordBySlug(
  languageSlug: string,
  wordSlug: string
): Promise<(Word & { language: Language }) | null> {
  const lang = await getLanguageBySlug(languageSlug);
  if (!lang) return null;

  const decoded = decodeURIComponent(wordSlug);

  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("language_id", lang.id)
    .eq("slug", decoded)
    .eq("is_published", true)
    .limit(1);

  if (error) {
    console.error("Failed to fetch word:", error.message);
    return null;
  }
  const word = data?.[0];
  return word ? { ...word, language: lang } : null;
}

export async function getRelatedWords(
  languageId: string,
  excludeSlug: string,
  limit = 6
): Promise<Word[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("language_id", languageId)
    .eq("is_published", true)
    .neq("slug", excludeSlug)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch related words:", error.message);
    return [];
  }
  return data ?? [];
}

export async function searchWords(
  query: string,
  limit = 50
): Promise<(Word & { language: Language })[]> {
  const q = query.trim();
  if (!q) return [];

  const { data, error } = await supabase
    .from("words")
    .select("*, language:languages(*)")
    .eq("is_published", true)
    .or(
      `word.ilike.%${q}%,literal_translation.ilike.%${q}%,english_equivalent.ilike.%${q}%,meaning.ilike.%${q}%`
    )
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to search words:", error.message);
    return [];
  }
  return (data ?? []) as (Word & { language: Language })[];
}

export async function getAllWords(): Promise<(Word & { language: Language })[]> {
  // Supabase default limit is 1000 rows — fetch in batches
  const all: (Word & { language: Language })[] = [];
  const batchSize = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("words")
      .select("*, language:languages(*)")
      .eq("is_published", true)
      .order("views", { ascending: false })
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error("Failed to fetch all words:", error.message);
      break;
    }
    const batch = (data ?? []) as (Word & { language: Language })[];
    all.push(...batch);
    if (batch.length < batchSize) break;
    offset += batchSize;
  }

  return all;
}

// Returns one high-severity word per language (top N languages by word count).
// Used as a diverse fallback for trending/WotD when views are all zero.
export async function getDiverseFeaturedWords(
  languageCount = 8
): Promise<(Word & { language: Language })[]> {
  // Get top languages by word count
  const { data: langs, error: langError } = await supabase
    .from("languages")
    .select("id, name, slug, flag_emoji, native_name, word_count")
    .order("word_count", { ascending: false })
    .limit(languageCount);

  if (langError || !langs) return [];

  // For each language, get the highest-severity published word
  const results: (Word & { language: Language })[] = [];
  await Promise.all(
    langs.map(async (lang) => {
      const { data: words } = await supabase
        .from("words")
        .select("*")
        .eq("language_id", lang.id)
        .eq("is_published", true)
        .order("severity", { ascending: false })
        .limit(1);
      if (words?.[0]) {
        results.push({ ...words[0], language: lang as Language });
      }
    })
  );

  return results;
}

export async function getAllWordSlugs(): Promise<{ slug: string; wordSlug: string }[]> {
  // Supabase default limit is 1000 rows — fetch in batches
  const all: { slug: string; wordSlug: string }[] = [];
  const batchSize = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("words")
      .select("slug, language:languages(slug)")
      .eq("is_published", true)
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error("Failed to fetch word slugs:", error.message);
      break;
    }
    const batch = (data ?? []).map((w: Record<string, unknown>) => ({
      slug: (w.language as Record<string, string>)?.slug ?? "",
      wordSlug: w.slug as string,
    }));
    all.push(...batch);
    if ((data ?? []).length < batchSize) break;
    offset += batchSize;
  }

  return all;
}

export async function getWordInOtherLanguages(
  word: { english_equivalent: string | null; categories: string[]; severity: number },
  excludeLanguageId: string,
  limit = 6
): Promise<(Word & { language: Language })[]> {
  // Strategy 1: Match by english_equivalent terms
  let results = await matchByEquivalent(word.english_equivalent, excludeLanguageId, limit);

  // Strategy 2: If not enough results, fill with same categories + similar severity
  if (results.length < limit) {
    const existingLangIds = new Set(results.map((r) => r.language_id));
    existingLangIds.add(excludeLanguageId);
    const fallback = await matchByCategory(word.categories, word.severity, existingLangIds, limit - results.length);
    results = [...results, ...fallback];
  }

  return results;
}

async function matchByEquivalent(
  englishEquivalent: string | null,
  excludeLanguageId: string,
  limit: number
): Promise<(Word & { language: Language })[]> {
  if (!englishEquivalent) return [];

  // Split "fuck / shit / damn" into individual terms
  const terms = englishEquivalent
    .split(/[\/,]/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length >= 3);

  if (terms.length === 0) return [];

  const orFilters = terms
    .slice(0, 4)
    .map((t) => `english_equivalent.ilike.%${t}%`)
    .join(",");

  const { data, error } = await supabase
    .from("words")
    .select("*, language:languages(*)")
    .eq("is_published", true)
    .neq("language_id", excludeLanguageId)
    .or(orFilters)
    .order("views", { ascending: false })
    .limit(limit * 5);

  if (error) return [];

  const seen = new Set<string>();
  const results: (Word & { language: Language })[] = [];
  for (const row of (data ?? []) as (Word & { language: Language })[]) {
    if (seen.has(row.language_id)) continue;
    seen.add(row.language_id);
    results.push(row);
    if (results.length >= limit) break;
  }
  return results;
}

async function matchByCategory(
  categories: string[],
  severity: number,
  excludeLangIds: Set<string>,
  limit: number
): Promise<(Word & { language: Language })[]> {
  if (categories.length === 0 || limit <= 0) return [];

  // Find words with overlapping categories and similar severity (±1)
  const { data, error } = await supabase
    .from("words")
    .select("*, language:languages(*)")
    .eq("is_published", true)
    .gte("severity", Math.max(1, severity - 1))
    .lte("severity", Math.min(5, severity + 1))
    .overlaps("categories", categories)
    .order("views", { ascending: false })
    .limit(limit * 5);

  if (error) return [];

  const seen = new Set<string>();
  const results: (Word & { language: Language })[] = [];
  for (const row of (data ?? []) as (Word & { language: Language })[]) {
    if (excludeLangIds.has(row.language_id)) continue;
    if (seen.has(row.language_id)) continue;
    seen.add(row.language_id);
    results.push(row);
    if (results.length >= limit) break;
  }
  return results;
}

export async function getMoreWordsInLanguage(
  languageId: string,
  excludeSlug: string,
  excludeSlugs: string[],
  limit = 8
): Promise<Word[]> {
  const allExclude = [excludeSlug, ...excludeSlugs];
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("language_id", languageId)
    .eq("is_published", true)
    .not("slug", "in", `(${allExclude.join(",")})`)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch more words:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Blog Articles ──────────────────────────────────────────

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch articles:", error.message);
    return [];
  }
  return (data ?? []) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }
  return data as Article;
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .eq("category", category)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch articles by category:", error.message);
    return [];
  }
  return (data ?? []) as Article[];
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.error("Failed to fetch article slugs:", error.message);
    return [];
  }
  return (data ?? []).map((a) => a.slug);
}

export async function getLatestArticles(limit = 2): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch latest articles:", error.message);
    return [];
  }
  return (data ?? []) as Article[];
}
