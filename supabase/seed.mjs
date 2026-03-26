#!/usr/bin/env node
// ============================================================
// SwearDictionary — Seed Script
//
// Reads every JSON file in data/seeds/ and upserts the data
// into your Supabase `languages` and `words` tables.
//
// Usage:
//   1. Copy .env.example → .env and fill in your keys
//   2. npm install
//   3. node supabase/seed.mjs
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ── Resolve paths ──────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SEEDS_DIR = join(ROOT, "data", "seeds");

// ── Supabase client (service role key bypasses RLS) ─────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "❌  Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── Helpers ─────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")    // non-alphanum → dash
    .replace(/^-+|-+$/g, "");       // trim leading/trailing dashes
}

// ── Main ────────────────────────────────────────────────────
async function seed() {
  const files = (await readdir(SEEDS_DIR)).filter((f) => f.endsWith(".json"));
  console.log(`\n📂  Found ${files.length} seed file(s): ${files.join(", ")}\n`);

  let totalLanguages = 0;
  let totalWords = 0;

  for (const file of files) {
    const raw = await readFile(join(SEEDS_DIR, file), "utf-8");
    const data = JSON.parse(raw);

    // ── Upsert language ──────────────────────────────────
    const langSlug = slugify(data.language);
    const langPayload = {
      name: data.language,
      slug: langSlug,
      iso_code: data.iso_code || null,
      cultural_notes: data.cultural_notes || null,
      description: data.cultural_notes
        ? data.cultural_notes.split(".").slice(0, 2).join(".") + "."
        : null,
      word_count: 0, // will be set by the trigger
    };

    // Check if language already exists
    const { data: existingLang } = await supabase
      .from("languages")
      .select("id, name")
      .eq("slug", langSlug)
      .single();

    let langRow;
    if (existingLang) {
      langRow = existingLang;
      console.log(`⏭️   Language: ${langRow.name} already exists, skipping`);
    } else {
      const { data: newLang, error: langErr } = await supabase
        .from("languages")
        .insert(langPayload)
        .select("id, name")
        .single();

      if (langErr) {
        console.error(`❌  Failed to insert language "${data.language}":`, langErr.message);
        continue;
      }
      langRow = newLang;
      console.log(`✅  Language: ${langRow.name} (${langRow.id})`);
      totalLanguages++;
    }

    // ── Upsert words ─────────────────────────────────────
    const wordPayloads = data.words.map((w) => ({
      language_id: langRow.id,
      word: w.word,
      slug: slugify(w.word) || slugify(w.english_equivalent) || `word-${Date.now()}`,
      literal_translation: w.literal_translation || null,
      english_equivalent: w.english_equivalent || null,
      severity: w.severity,
      categories: w.categories || [],
      meaning: w.meaning || null,
      cultural_context: w.cultural_context || null,
      example_usage: w.example_usage || null,
      example_sentences: w.example_sentences || [],
      regional_variations: w.regional_variations || [],
      ipa_pronunciation: w.ipa_pronunciation || null,
      related_words: w.related_words || [],
      is_published: true,
    }));

    // Fetch existing word slugs for this language
    const { data: existingWords } = await supabase
      .from("words")
      .select("slug")
      .eq("language_id", langRow.id);

    const existingSlugs = new Set((existingWords || []).map((w) => w.slug));
    const newWords = wordPayloads.filter((w) => !existingSlugs.has(w.slug));
    const skipped = wordPayloads.length - newWords.length;

    if (newWords.length === 0) {
      console.log(`   └─ ${skipped} word(s) already exist, nothing to insert`);
      continue;
    }

    const { data: inserted, error: wordsErr } = await supabase
      .from("words")
      .insert(newWords)
      .select("id");

    if (wordsErr) {
      console.error(`❌  Failed to insert words for "${data.language}":`, wordsErr.message);
      continue;
    }

    const count = inserted?.length ?? 0;
    totalWords += count;
    console.log(`   └─ ${count} word(s) inserted, ${skipped} skipped (already exist)`);
  }

  // ── Manually sync word counts (in case trigger missed something) ──
  const { error: syncErr } = await supabase.rpc("sync_word_counts");
  if (syncErr && syncErr.code !== "42883") {
    // 42883 = function doesn't exist (skip silently)
    console.warn("⚠️  Could not sync word counts:", syncErr.message);
  }

  console.log(`\n🎉  Done! ${totalLanguages} language(s), ${totalWords} word(s) seeded.\n`);
}

seed().catch((err) => {
  console.error("💥  Seed script failed:", err);
  process.exit(1);
});
