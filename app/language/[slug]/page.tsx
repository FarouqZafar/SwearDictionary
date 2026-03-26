import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLanguageBySlug,
  getAllWordsByLanguage,
  getAllLanguageSlugs,
} from "@/lib/queries";
import WordFilters from "./WordFilters";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllLanguageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const language = await getLanguageBySlug(slug);
  if (!language) return { title: "Language not found" };

  const title = `${language.name} swear words — ${language.word_count} curse words with meaning & severity`;
  const description = language.description
    || `Browse ${language.word_count} swear words in ${language.name} with severity ratings, translations, and cultural context.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://sweardictionary.com/language/${slug}`,
      siteName: "SwearDictionary",
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const language = await getLanguageBySlug(slug);
  if (!language) notFound();

  const words = await getAllWordsByLanguage(language.id);

  return (
    <div className="lang-page">
      {/* Header */}
      <div className="lang-page-header">
        <div className="lang-page-header-left">
          <nav className="breadcrumb">
            <Link href="/languages">languages</Link>
            <span className="sep">/</span>
            <span>{language.slug}</span>
          </nav>
          <h1 className="lang-page-title">
            {language.name} <em>Vocabulary</em>
          </h1>
        </div>
        <div className="lang-page-header-right">
          <span className="lang-total-label">total words</span>
          <span className="lang-total-count">{language.word_count}</span>
        </div>
      </div>

      {/* Sidebar + Grid */}
      <WordFilters
        words={words}
        languageSlug={slug}
        languageName={language.name}
        nativeName={language.native_name}
      />
    </div>
  );
}
