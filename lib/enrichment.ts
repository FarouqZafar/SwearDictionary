// A word is "enriched" — and therefore worth indexing — once it has at least
// 3 example sentences AND a cultural context over 200 chars. Thin, unenriched
// pages are noindexed to keep Google's view of the domain high-quality; they
// flip to indexable automatically once they clear this bar.
export function isWordEnriched(w: {
  example_sentences?: unknown;
  cultural_context?: unknown;
}): boolean {
  const sentences = w.example_sentences;
  const ctx = typeof w.cultural_context === "string" ? w.cultural_context : "";
  return Array.isArray(sentences) && sentences.length >= 3 && ctx.length > 200;
}
