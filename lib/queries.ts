import { supabase } from "./supabase";
import type { Language, Word } from "@/types";

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
