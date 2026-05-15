// Enriches published words with example_sentences, cultural_context, and
// regional_variations using Gemini.
//
// Skip filter: word is skipped if it has 3+ example_sentences AND
// cultural_context > 200 chars. Otherwise it's eligible.
//
// Merge logic:
//   - example_sentences: replace if existing <3, append to reach 5 if 3-4,
//     keep as-is if >=5.
//   - cultural_context: replace if existing <=200 chars, else keep.
//   - regional_variations: set only if existing is empty.
//
// Run: node --env-file=.env scripts/enrich-words.mjs

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const MODEL = "gemini-2.5-flash-lite";
const DELAY_MS = 6000;            // ~10 RPM, fits free tier
const MAX_WORDS = 3;              // probe tightened prompt on flash-lite
const PROGRESS_INTERVAL = 10;
const BATCH_BOUNDARY = 50;
const MIN_SENTENCES = 3;
const MIN_CONTEXT_CHARS = 200;
const TARGET_SENTENCES = 5;
const MAX_RETRIES = 3;
const MIN_CONTEXT_WORDS = 200;
const MIN_CONTEXT_PARAGRAPHS = 2;
const VALIDATION_RETRIES = 2;

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
      description: "2-3 paragraphs separated by blank lines, minimum 300 words total",
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

cultural_context — REQUIREMENTS (read carefully):
  Cultural context MUST be 2-3 separate paragraphs, minimum 300 words total.
  Each paragraph should cover a distinct angle. Do NOT write a single short paragraph.
  Separate paragraphs with a blank line (two newlines: \\n\\n).

  Paragraph 1 — Daily-speech function: how the word actually functions in daily speech. Is it losing or gaining offensiveness over time? Do older people react differently than younger people? Is it gendered? Concrete behavioral detail, not generalities.
  Paragraph 2 — Regional/contextual nuance: regional or contextual differences within places that share the language. Compound phrases, derivatives, code-switching habits. At least one specific example.
  Paragraph 3 — A cultural nugget: one interesting cultural nugget — origin story, pop culture moment, or "did you know" fact. Something a reader would screenshot and send to a friend. Be specific (a film, a song, a year, a specific incident).

  Tone: conversational, like a well-traveled friend explaining it. Not Wikipedia, not a textbook.
  Do NOT use filler phrases like "It's worth noting", "This versatile word", "In conclusion", or "Interestingly enough".
  Do NOT pad to hit the word count — every sentence should add real information.

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function needsEnrichment(w) {
  const sCount = Array.isArray(w.example_sentences) ? w.example_sentences.length : 0;
  const cLen = (w.cultural_context || "").length;
  return !(sCount >= MIN_SENTENCES && cLen > MIN_CONTEXT_CHARS);
}

async function fetchAllPublished() {
  const all = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from("words")
      .select(
        "id, word, slug, severity, categories, english_equivalent, literal_translation, meaning, views, example_sentences, cultural_context, regional_variations, language:languages(slug, name)"
      )
      .eq("is_published", true)
      .order("views", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

function parseRetryDelay(msg) {
  const m = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
  return m ? Math.ceil(parseFloat(m[1]) * 1000) + 1000 : null;
}

function isDailyQuotaError(msg) {
  return /PerDay|per_day|RPD|daily/i.test(msg);
}

function validateEnrichment(enrichment) {
  if (
    !Array.isArray(enrichment.example_sentences) ||
    enrichment.example_sentences.length !== 5
  ) {
    return `expected 5 example_sentences, got ${enrichment.example_sentences?.length}`;
  }
  if (!enrichment.cultural_context || typeof enrichment.cultural_context !== "string") {
    return "missing cultural_context";
  }
  const ctx = enrichment.cultural_context;
  const words = ctx.split(/\s+/).filter(Boolean).length;
  if (words < MIN_CONTEXT_WORDS) {
    return `cultural_context too short: ${words} words (min ${MIN_CONTEXT_WORDS})`;
  }
  const paras = ctx.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  if (paras < MIN_CONTEXT_PARAGRAPHS) {
    return `cultural_context has ${paras} paragraph(s) (min ${MIN_CONTEXT_PARAGRAPHS})`;
  }
  return null;
}

async function callModelWithValidation(w) {
  let lastReason;
  for (let attempt = 0; attempt <= VALIDATION_RETRIES; attempt++) {
    const enrichment = await callModel(w);
    const reason = validateEnrichment(enrichment);
    if (!reason) return enrichment;
    lastReason = reason;
    if (attempt < VALIDATION_RETRIES) {
      console.log(`    validation failed (${reason}); retrying...`);
    }
  }
  throw new Error(`validation failed after ${VALIDATION_RETRIES + 1} attempts: ${lastReason}`);
}

async function callModel(w, attempt = 0) {
  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: buildUserPrompt(w) },
    ]);
    return JSON.parse(result.response.text());
  } catch (e) {
    const msg = e.message || String(e);
    if (msg.includes("429")) {
      if (isDailyQuotaError(msg)) {
        const err = new Error("daily quota exhausted");
        err.dailyQuota = true;
        throw err;
      }
      if (attempt < MAX_RETRIES) {
        const wait = parseRetryDelay(msg) ?? 35_000;
        console.log(`    rate-limited; sleeping ${(wait / 1000).toFixed(0)}s...`);
        await sleep(wait);
        return callModel(w, attempt + 1);
      }
    }
    throw e;
  }
}

function contextIsLowQuality(ctx) {
  if (!ctx || typeof ctx !== "string") return true;
  const words = ctx.split(/\s+/).filter(Boolean).length;
  if (words < MIN_CONTEXT_WORDS) return true;
  const paras = ctx.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  if (paras < MIN_CONTEXT_PARAGRAPHS) return true;
  return false;
}

function buildUpdates(w, enrichment) {
  const updates = {};

  const existing = Array.isArray(w.example_sentences) ? w.example_sentences : [];
  if (existing.length < MIN_SENTENCES) {
    updates.example_sentences = enrichment.example_sentences;
  } else if (existing.length < TARGET_SENTENCES) {
    const needed = TARGET_SENTENCES - existing.length;
    updates.example_sentences = [
      ...existing,
      ...enrichment.example_sentences.slice(0, needed),
    ];
  }
  // else: 5+ existing, keep as-is

  if (contextIsLowQuality(w.cultural_context)) {
    updates.cultural_context = enrichment.cultural_context;
  }

  const existingRV = Array.isArray(w.regional_variations) ? w.regional_variations : [];
  if (existingRV.length === 0 && enrichment.regional_variations?.length > 0) {
    updates.regional_variations = enrichment.regional_variations;
  }

  return updates;
}

async function main() {
  console.log("Fetching all published words...");
  const all = await fetchAllPublished();
  console.log(`${all.length} total published.`);

  const eligible = all.filter(needsEnrichment);
  console.log(`${eligible.length} need enrichment.`);

  if (eligible.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  const todo = eligible.slice(0, MAX_WORDS);
  const estMinutes = Math.ceil((todo.length * (DELAY_MS + 4000)) / 60000);
  console.log(
    `Processing ${todo.length} (cap: ${MAX_WORDS}). Delay: ${DELAY_MS}ms. Model: ${MODEL}.`
  );
  console.log(`Estimated time: ~${estMinutes} min\n`);

  let succeeded = 0;
  const failed = [];
  const start = Date.now();
  let dailyQuotaHit = false;

  for (let i = 0; i < todo.length; i++) {
    const w = todo[i];
    const langSlug = w.language?.slug || "unknown";

    try {
      const enrichment = await callModelWithValidation(w);
      const updates = buildUpdates(w, enrichment);

      if (Object.keys(updates).length > 0) {
        const { error: upErr } = await supabase
          .from("words")
          .update(updates)
          .eq("id", w.id);
        if (upErr) throw new Error(`db: ${upErr.message}`);
      }
      succeeded++;
    } catch (e) {
      if (e.dailyQuota) {
        console.log(`\nDaily quota exhausted at word ${i + 1}/${todo.length}. Stopping cleanly.`);
        dailyQuotaHit = true;
        break;
      }
      const reason = (e.message || String(e)).slice(0, 200);
      failed.push({ word: w.word, lang: langSlug, reason });
      console.log(`  [${i + 1}] ${w.word} (${langSlug}) FAILED: ${reason}`);
    }

    const done = i + 1;
    if (done % PROGRESS_INTERVAL === 0 && done < todo.length) {
      const elapsed = (Date.now() - start) / 1000;
      const rate = done / elapsed;
      const remaining = todo.length - done;
      const eta = rate > 0 ? Math.round(remaining / rate / 60) : "?";
      console.log(
        `Progress: ${done}/${todo.length} | ✓ ${succeeded} | ✗ ${failed.length} | ETA ~${eta}min`
      );
    }
    if (done % BATCH_BOUNDARY === 0 && done < todo.length) {
      console.log(`--- batch ${done / BATCH_BOUNDARY} of ${Math.ceil(todo.length / BATCH_BOUNDARY)} ---`);
    }

    if (i < todo.length - 1) await sleep(DELAY_MS);
  }

  const processed = succeeded + failed.length;
  const totalRemaining = eligible.length - succeeded;

  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${processed}/${todo.length}`);
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed:    ${failed.length}`);
  if (dailyQuotaHit) console.log(`(stopped early on daily quota)`);
  console.log(`Eligible words still needing enrichment: ${totalRemaining}`);
  console.log(`(re-run tomorrow to continue)`);

  if (failed.length) {
    console.log(`\nFailed words (first 20):`);
    for (const f of failed.slice(0, 20)) {
      console.log(`  ${f.word} (${f.lang}): ${f.reason.slice(0, 120)}`);
    }
    if (failed.length > 20) console.log(`  ...and ${failed.length - 20} more`);
  }
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
