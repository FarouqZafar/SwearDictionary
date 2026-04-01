/**
 * Submit all SwearDictionary URLs to IndexNow (Bing, Yandex, etc.)
 * Usage: node scripts/submit-indexnow.mjs
 *
 * Fetches all published words + languages from Supabase and submits
 * them in batches of 10,000 (IndexNow API limit).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = resolve(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const HOST = "sweardictionary.com";
const BASE_URL = `https://${HOST}`;
const API_KEY = "f8b43f7e1ece40ecb92b667248179b1c";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getAllUrls() {
  const urls = [
    `${BASE_URL}`,
    `${BASE_URL}/words`,
    `${BASE_URL}/languages`,
    `${BASE_URL}/about`,
    `${BASE_URL}/blog`,
  ];

  // Languages
  const { data: languages } = await supabase
    .from("languages")
    .select("slug")
    .order("word_count", { ascending: false });

  for (const lang of languages ?? []) {
    urls.push(`${BASE_URL}/language/${lang.slug}`);
  }

  // Words (batched to avoid 1000-row limit)
  let from = 0;
  while (true) {
    const { data } = await supabase
      .from("words")
      .select("slug, language:languages(slug)")
      .eq("is_published", true)
      .range(from, from + 999);

    if (!data || data.length === 0) break;
    for (const w of data) {
      urls.push(`${BASE_URL}/language/${w.language.slug}/${w.slug}`);
    }
    if (data.length < 1000) break;
    from += 1000;
  }

  // Articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug")
    .eq("is_published", true);

  for (const a of articles ?? []) {
    urls.push(`${BASE_URL}/blog/${a.slug}`);
  }

  return urls;
}

async function submitBatch(urlBatch, batchNum) {
  const body = {
    host: HOST,
    key: API_KEY,
    keyLocation: `${BASE_URL}/${API_KEY}.txt`,
    urlList: urlBatch,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log(
    `Batch ${batchNum}: ${urlBatch.length} URLs → ${res.status} ${res.statusText}`
  );

  if (res.status !== 200 && res.status !== 202) {
    const text = await res.text();
    console.error(`  Error: ${text}`);
  }
}

async function main() {
  console.log("Fetching all URLs from Supabase...");
  const urls = await getAllUrls();
  console.log(`Found ${urls.length} URLs to submit.\n`);

  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < batches.length; i++) {
    await submitBatch(batches[i], i + 1);
  }

  console.log("\nDone.");
}

main().catch(console.error);
