// Quick check: list words updated in the last N minutes.
// Output formatted to match docs/enriched-words.md table format.
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const minutes = Number(process.argv[2] ?? 60);
const startIndex = Number(process.argv[3] ?? 1);
const since = new Date(Date.now() - minutes * 60_000).toISOString();

const { data, error } = await supabase
  .from("words")
  .select("id, word, slug, views, language:languages(slug, name)")
  .gte("updated_at", since)
  .order("views", { ascending: false });

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Words updated in last ${minutes} min: ${data.length}\n`);
for (let i = 0; i < data.length; i++) {
  const w = data[i];
  const lang = w.language?.slug ?? "?";
  console.log(
    `| ${startIndex + i} | \`${w.id}\` | ${lang} | ${w.word} | ${w.slug} | ${w.views} |`
  );
}
