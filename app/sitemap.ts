import type { MetadataRoute } from "next";
import { getLanguages } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://sweardictionary.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = await getLanguages();

  const { data: words } = await supabase
    .from("words")
    .select("slug, updated_at, language:languages(slug)")
    .eq("is_published", true);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/words`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/languages`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const languagePages: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: `${BASE_URL}/language/${lang.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const wordPages: MetadataRoute.Sitemap = (words ?? []).map(
    (w: Record<string, unknown>) => ({
      url: `${BASE_URL}/language/${(w.language as Record<string, string>)?.slug}/${w.slug}`,
      lastModified: w.updated_at ? new Date(w.updated_at as string) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...languagePages, ...wordPages];
}
