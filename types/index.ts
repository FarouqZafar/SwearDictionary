export interface Language {
  id: string;
  name: string;
  slug: string;
  native_name: string | null;
  iso_code: string | null;
  flag_emoji: string | null;
  word_count: number;
  description: string | null;
  cultural_notes: string | null;
  created_at: string;
}

export interface Word {
  id: string;
  language_id: string;
  word: string;
  slug: string;
  literal_translation: string | null;
  english_equivalent: string | null;
  severity: number;
  categories: string[];
  meaning: string | null;
  cultural_context: string | null;
  example_usage: string | null;
  example_sentences: { original: string; translation: string }[];
  regional_variations: { region: string; severity: number; note: string }[];
  ipa_pronunciation: string | null;
  audio_url: string | null;
  related_words: string[];
  is_published: boolean;
  submitted_by: string | null;
  views: number;
  impressions: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: "linguistic" | "cultural" | "celebrity" | "movie-tv";
  tags: string[];
  published_at: string;
  is_published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export const ARTICLE_CATEGORIES: Record<string, string> = {
  linguistic: "Linguistic",
  cultural: "Cultural",
  celebrity: "Celebrity",
  "movie-tv": "Film & TV",
};

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  1: "mild",
  2: "moderate",
  3: "strong",
  4: "severe",
  5: "nuclear",
};

export const SEVERITY_CLASSES: Record<SeverityLevel, string> = {
  1: "sev-mild",
  2: "sev-moderate",
  3: "sev-strong",
  4: "sev-severe",
  5: "sev-nuclear",
};
