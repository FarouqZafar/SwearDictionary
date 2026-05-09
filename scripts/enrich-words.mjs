// Enriches the top N words by view count with example_sentences,
// cultural_context, and regional_variations using Gemini.
//
// Run: node --env-file=.env scripts/enrich-words.mjs

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const LIMIT = 10;
const MODEL = "gemini-2.5-flash";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

for (const [k, v] of Object.entries({ SUPABASE_URL, SUPABASE_KEY, GEMINI_KEY })) {
  if (!v) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    example_sentences: {
      type: SchemaType.ARRAY,
      description: "Exactly 5 sentences, each showing a different real-life use",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          original: { type: SchemaType.STRING },
          translation: { type: SchemaType.STRING },
        },
        required: ["original", "translation"],
      },
    },
    cultural_context: {
      type: SchemaType.STRING,
      description: "2-3 paragraphs, 200-300 words total",
    },
    regional_variations: {
      type: SchemaType.ARRAY,
      description: "Empty array if no genuine regional differences exist",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          region: { type: SchemaType.STRING },
          severity: { type: SchemaType.INTEGER },
          note: { type: SchemaType.STRING },
        },
        required: ["region", "severity", "note"],
      },
    },
  },
  required: ["example_sentences", "cultural_context", "regional_variations"],
};

const model = genAI.getGenerativeModel({
  model: MODEL,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema,
    temperature: 0.9,
  },
});

const SYSTEM_PROMPT = `You are a linguist and cultural guide writing entries for a profanity dictionary. Your job is to enrich an existing entry with three fields. Output JSON matching the response schema exactly.

example_sentences — exactly 5 sentences as [{original, translation}]:
  Each sentence shows the word in a different real-life situation:
    1. Someone angry/frustrated
    2. Casual use between friends
    3. Humorous or ironic use
    4. Used as an intensifier or in a compound phrase
    5. A reaction to something surprising
  Sentences must sound like something a real native speaker would text or say out loud — not textbook sentences.
  "original" is in the word's language. "translation" is the English translation of the same sentence.

cultural_context — 2-3 paragraphs, 200-300 words total:
  Paragraph 1: how the word actually functions in daily speech. Is it losing or gaining offensiveness over time? Do older people react differently than younger people? Is it gendered?
  Paragraph 2: regional or contextual differences within places that share the language. Compound phrases or derivatives that are common.
  Paragraph 3: one interesting cultural nugget — origin story, pop culture moment, or "did you know" fact. Something a reader would screenshot and send to a friend.
  Tone: conversational, like a well-traveled friend explaining it. Not Wikipedia, not a textbook.
  Do NOT use filler phrases like "It's worth noting", "This versatile word", "In conclusion", or "Interestingly enough".

regional_variations — array of {region, severity, note}:
  Only populate if there are genuine regional differences. If the word is only used in one region or differences are trivial, return an empty array.
  severity is an integer 1-5.
  Example: {region: "Quebec", severity: 5, note: "Much more offensive than in France — considered a direct personal attack rather than a casual exclamation"}

Do not invent facts. If you don't know, omit rather than make something up.`;

function buildUserPrompt(w) {
  const lang = w.language?.name || "Unknown";
  const cats = (w.categories || []).join(", ") || "none";
  return `Enrich this entry:

word: ${w.word}
language: ${lang}
english_equivalent: ${w.english_equivalent || "(none)"}
literal_translation: ${w.literal_translation || "(none)"}
severity: ${w.severity}/5
categories: ${cats}
existing_meaning: ${w.meaning || "(none)"}

Return JSON with example_sentences, cultural_context, and regional_variations only.`;
}

async function main() {
  console.log(`Fetching top ${LIMIT} words by views DESC...`);
  const { data: words, error } = await supabase
    .from("words")
    .select(
      "id, word, slug, severity, categories, english_equivalent, literal_translation, meaning, views, language:languages(slug, name)"
    )
    .eq("is_published", true)
    .order("views", { ascending: false })
    .limit(LIMIT);

  if (error) {
    console.error(`Query failed: ${error.message}`);
    process.exit(1);
  }
  if (!words?.length) {
    console.error("No words returned.");
    process.exit(1);
  }

  console.log(`Got ${words.length} words. Starting enrichment with ${MODEL}.\n`);

  const updated = [];
  const failed = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const langSlug = w.language?.slug || "unknown";
    const tag = `[${i + 1}/${words.length}] ${w.word} (${langSlug}, ${w.views} views)`;
    process.stdout.write(`${tag} ... `);

    try {
      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: buildUserPrompt(w) },
      ]);
      const text = result.response.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json.example_sentences) || json.example_sentences.length !== 5) {
        throw new Error(`expected 5 example_sentences, got ${json.example_sentences?.length}`);
      }
      if (!json.cultural_context || typeof json.cultural_context !== "string") {
        throw new Error("missing cultural_context");
      }
      if (!Array.isArray(json.regional_variations)) {
        throw new Error("regional_variations must be an array");
      }

      const { error: upErr } = await supabase
        .from("words")
        .update({
          example_sentences: json.example_sentences,
          cultural_context: json.cultural_context,
          regional_variations: json.regional_variations,
        })
        .eq("id", w.id);

      if (upErr) throw new Error(`db update: ${upErr.message}`);

      const url = `https://sweardictionary.com/language/${langSlug}/${w.slug}`;
      console.log(`done — ${url}`);
      updated.push({ word: w.word, url });
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      failed.push({ word: w.word, language: langSlug, reason: e.message });
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated.length}/${words.length}`);
  if (updated.length) {
    console.log(`\nURLs:`);
    for (const u of updated) console.log(`  ${u.url}`);
  }
  if (failed.length) {
    console.log(`\nFailed:`);
    for (const f of failed) console.log(`  ${f.word} (${f.language}): ${f.reason}`);
  }
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
