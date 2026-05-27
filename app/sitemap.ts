import type { MetadataRoute } from "next";
import { getLanguages, getPublishedArticles } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

export const revalidate = false;

const BASE_URL = "https://sweardictionary.com";
const FIXED_DATE = "2026-03-27";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [languages, articles] = await Promise.all([
    getLanguages(),
    getPublishedArticles(),
  ]);

  let words: Record<string, unknown>[] = [];
  let from = 0;
  const batchSize = 1000;

  while (true) {
    const { data } = await supabase
      .from("words")
      .select("slug, updated_at, language_id, example_sentences, cultural_context, language:languages(slug)")
      .eq("is_published", true)
      .range(from, from + batchSize - 1);

    if (!data || data.length === 0) break;
    words = [...words, ...data];
    if (data.length < batchSize) break;
    from += batchSize;
  }

  // Build a map of language_id → most recent word updated_at
  const langLastUpdated = new Map<string, string>();
  for (const w of words ?? []) {
    const lid = w.language_id as string;
    const updated = w.updated_at as string;
    if (!langLastUpdated.has(lid) || updated > langLastUpdated.get(lid)!) {
      langLastUpdated.set(lid, updated);
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: FIXED_DATE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/words`, lastModified: FIXED_DATE, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/languages`, lastModified: FIXED_DATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: FIXED_DATE, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/blog`, lastModified: FIXED_DATE, changeFrequency: "weekly", priority: 0.7 },
  ];

  const languagePages: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: `${BASE_URL}/language/${lang.slug}`,
    lastModified: langLastUpdated.get(lang.id) || FIXED_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Only include enriched words in sitemap (3+ example sentences AND 200+ char cultural context)
  const enrichedWords = (words ?? []).filter((w: Record<string, unknown>) => {
    const sentences = w.example_sentences as unknown[] | null;
    const ctx = w.cultural_context as string | null;
    return Array.isArray(sentences) && sentences.length >= 3 && (ctx || "").length > 200;
  });

  const wordPages: MetadataRoute.Sitemap = enrichedWords.map(
    (w: Record<string, unknown>) => ({
      url: `${BASE_URL}/language/${(w.language as Record<string, string>)?.slug}/${w.slug}`,
      lastModified: w.updated_at ? new Date(w.updated_at as string) : FIXED_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : FIXED_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...languagePages, ...wordPages, ...articlePages];
}
