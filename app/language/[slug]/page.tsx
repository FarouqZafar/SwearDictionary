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

  const title = `${language.name} swear words — ${language.word_count} curse words & insults`;
  const description = language.description
    || `Browse ${language.word_count} ${language.name} swear words, curse words & insults. Severity ratings, translations, and cultural context.`;

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
    alternates: { canonical: `https://sweardictionary.com/language/${slug}` },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${language.name} swear words`,
    description:
      language.description ||
      `Browse ${language.word_count} swear words in ${language.name} with severity ratings, translations, and cultural context.`,
    inLanguage: language.name,
    url: `https://sweardictionary.com/language/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sweardictionary.com" },
      { "@type": "ListItem", position: 2, name: "Languages", item: "https://sweardictionary.com/languages" },
      { "@type": "ListItem", position: 3, name: language.name },
    ],
  };

  return (
    <main className="lang-main">
      <div className="lang-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Header */}
      <div className="lang-page-header">
        <div className="lang-page-header-left">
          <nav className="word-breadcrumb">
            <Link href="/languages">languages</Link>
            <span className="word-bc-sep">/</span>
            <span className="word-bc-lang">
              <span className="word-bc-flag">{language.flag_emoji || "🌍"}</span>
              <span className="word-bc-current">{language.slug}</span>
            </span>
          </nav>
          <h1 className="lang-page-title">
            {language.name} <em>swear words</em>
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
        isoCode={language.iso_code}
      />
    </div>
    </main>
  );
}
