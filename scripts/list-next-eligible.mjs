// Lists the top-N eligible (not-yet-enriched) words by views, with full data.
// Skip filter matches enrich-words.mjs: skipped if 3+ sentences AND context >200 chars.
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const N = Number(process.argv[2] ?? 10);

const all = [];
let from = 0;
const PAGE = 1000;
while (true) {
  const { data, error } = await supabase
    .from("words")
    .select(
      "id, word, slug, severity, categories, english_equivalent, literal_translation, meaning, views, example_sentences, cultural_context, language:languages(slug, name)"
    )
    .eq("is_published", true)
    .order("views", { ascending: false })
    .range(from, from + PAGE - 1);
  if (error) { console.error(error.message); process.exit(1); }
  if (!data?.length) break;
  all.push(...data);
  if (data.length < PAGE) break;
  from += PAGE;
}

const eligible = all.filter((w) => {
  const sCount = Array.isArray(w.example_sentences) ? w.example_sentences.length : 0;
  const cLen = (w.cultural_context || "").length;
  return !(sCount >= 3 && cLen > 200);
});

console.log(`${all.length} published, ${eligible.length} eligible.\n`);
console.log(JSON.stringify(eligible.slice(0, N), null, 2));
