#!/usr/bin/env python3
"""
Upload merged seed data from seeds_merged/ to Supabase.

Reads flat JSON arrays from data/seeds_merged/[language].json.
Languages must already exist in Supabase (created by the original seed script).
Only inserts words that don't already exist (matched by slug).

Usage:
  python3 data/upload_merged.py                  # Dry run
  python3 data/upload_merged.py --upload         # Actually upload
  python3 data/upload_merged.py --upload farsi   # Upload only farsi
"""

import json
import os
import re
import sys
import unicodedata
from pathlib import Path

try:
    from supabase import create_client
except ImportError:
    print("Missing dependency. Run: pip install supabase")
    sys.exit(1)

# Load env from .env file
ENV_PATH = Path(__file__).parent.parent / ".env"


def load_env():
    env = {}
    if ENV_PATH.exists():
        with open(ENV_PATH) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    env[key.strip()] = val.strip()
    return env


env = load_env()
SUPABASE_URL = env.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
    sys.exit(1)


def slugify(text: str) -> str:
    """Create a URL-safe ASCII slug. Matches the logic in seed.mjs.

    Handles two word formats:
    - Latin-based: 'tanga ka ba (tah-ngah kah bah)' -> strip parens -> 'tanga-ka-ba'
    - Non-Latin: 'كس أمك (Kus ummak)' -> USE parens content -> 'kus-ummak'
    """
    # Extract parenthesized content
    paren_match = re.search(r'\(([^)]+)\)', text)
    # Strip parenthesized part to get the base
    base = re.sub(r'\s*\([^)]*\)\s*', ' ', text).strip().lower()

    # Check if base has any Latin letters
    base_normalized = unicodedata.normalize("NFD", base)
    base_ascii = re.sub(r'[\u0300-\u036f]', '', base_normalized)
    base_slug = re.sub(r'[^a-z0-9]+', '-', base_ascii)
    base_slug = re.sub(r'-+', '-', base_slug).strip('-')

    if base_slug:
        # Base has Latin chars (e.g. "tanga ka ba") — use it
        return base_slug

    # Base is all non-Latin (e.g. Arabic, CJK) — use parenthesized romanization
    if paren_match:
        roman = paren_match.group(1).strip().lower()
        roman = unicodedata.normalize("NFD", roman)
        roman = re.sub(r'[\u0300-\u036f]', '', roman)
        roman = re.sub(r'[^a-z0-9]+', '-', roman)
        roman = re.sub(r'-+', '-', roman).strip('-')
        if roman:
            return roman

    return 'unknown'


# Map filename stems to actual DB slugs where they differ
SLUG_OVERRIDES = {
    "farsi": "farsi-persian",
    "bosnian": "bosnian-serbo-croatian",
}


def upload_file(filepath: str, supabase, dry_run: bool = True):
    """Upload a single merged file to Supabase."""
    file_stem = Path(filepath).stem  # e.g. "farsi" from "farsi.json"
    lang_slug = SLUG_OVERRIDES.get(file_stem, file_stem)

    with open(filepath, 'r', encoding='utf-8') as f:
        words = json.load(f)

    if not isinstance(words, list):
        print(f"  SKIP: {filepath} is not a flat array")
        return {"language": lang_slug, "words": 0, "skipped": 0, "status": "error"}

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Processing: {lang_slug} ({len(words)} words in file)")

    if dry_run:
        # Still look up the language to show accurate skip counts
        existing_lang = supabase.table("languages").select("id, name, slug, word_count").eq("slug", lang_slug).execute()
        if not existing_lang.data:
            print(f"  WARNING: Language '{lang_slug}' not found in Supabase. Will skip on upload.")
            return {"language": lang_slug, "words": len(words), "skipped": 0, "status": "no_language"}

        lang_id = existing_lang.data[0]["id"]
        lang_name = existing_lang.data[0]["name"]
        old_count = existing_lang.data[0]["word_count"]

        # Check existing words
        existing_words = supabase.table("words").select("slug").eq("language_id", lang_id).execute()
        existing_slugs = {w["slug"] for w in (existing_words.data or [])}

        # Generate slugs for new words and check
        new_count = 0
        for w in words:
            word_slug = slugify(w["word"])
            if not word_slug or word_slug == "unknown":
                word_slug = slugify(w.get("english_equivalent", "unknown"))
            if word_slug not in existing_slugs:
                new_count += 1

        skip_count = len(words) - new_count
        print(f"  Language: {lang_name} (slug: {lang_slug}, currently {old_count} words in DB)")
        print(f"  Would insert: {new_count} new words, skip {skip_count} existing")
        return {"language": lang_slug, "words": new_count, "skipped": skip_count, "status": "dry_run"}

    # --- Actual upload ---

    # Look up language
    existing_lang = supabase.table("languages").select("id, name, word_count").eq("slug", lang_slug).execute()
    if not existing_lang.data:
        print(f"  ERROR: Language '{lang_slug}' not found in Supabase. Skipping.")
        return {"language": lang_slug, "words": 0, "skipped": 0, "status": "no_language"}

    lang_id = existing_lang.data[0]["id"]
    lang_name = existing_lang.data[0]["name"]
    old_count = existing_lang.data[0]["word_count"]
    print(f"  Language: {lang_name} (id: {lang_id}, currently {old_count} words)")

    # Fetch existing word slugs
    existing_words = supabase.table("words").select("slug").eq("language_id", lang_id).execute()
    existing_slugs = {w["slug"] for w in (existing_words.data or [])}

    # Build word rows, skipping duplicates
    word_rows = []
    skipped = 0
    for w in words:
        word_slug = slugify(w["word"])
        if not word_slug or word_slug == "unknown":
            word_slug = slugify(w.get("english_equivalent", f"word-{len(word_rows)}"))

        if word_slug in existing_slugs:
            skipped += 1
            continue

        # Avoid inserting duplicate slugs within same batch
        if word_slug in {r["slug"] for r in word_rows}:
            word_slug = f"{word_slug}-{len(word_rows)}"

        word_rows.append({
            "language_id": lang_id,
            "word": w["word"],
            "slug": word_slug,
            "literal_translation": w.get("literal_translation"),
            "english_equivalent": w.get("english_equivalent"),
            "severity": w["severity"],
            "categories": w.get("categories", []),
            "meaning": w.get("meaning"),
            "cultural_context": w.get("cultural_context"),
            "example_usage": w.get("example_usage"),
            "example_sentences": w.get("example_sentences", []),
            "regional_variations": w.get("regional_variations", []),
            "ipa_pronunciation": w.get("ipa_pronunciation"),
            "audio_url": w.get("audio_url"),
            "related_words": w.get("related_words", []),
            "is_published": True,
            "views": 0,
        })

    print(f"  {len(word_rows)} new words to insert, {skipped} already exist")

    if not word_rows:
        return {"language": lang_slug, "words": 0, "skipped": skipped, "status": "skipped"}

    # Insert in batches of 50
    inserted = 0
    batch_size = 50
    for i in range(0, len(word_rows), batch_size):
        batch = word_rows[i:i + batch_size]
        try:
            result = supabase.table("words").insert(batch).execute()
            if result.data:
                inserted += len(result.data)
                print(f"  Batch {i // batch_size + 1}: inserted {len(result.data)} words")
            else:
                print(f"  Batch {i // batch_size + 1}: no data returned")
        except Exception as e:
            print(f"  ERROR batch {i // batch_size + 1}: {e}")
            # Try inserting one by one to find the problem
            for j, row in enumerate(batch):
                try:
                    result = supabase.table("words").insert(row).execute()
                    if result.data:
                        inserted += 1
                except Exception as e2:
                    print(f"    FAILED: {row['word']} ({row['slug']}): {e2}")

    # Update word_count
    total_words = supabase.table("words").select("id", count="exact").eq("language_id", lang_id).eq("is_published", True).execute()
    new_count = total_words.count or 0
    supabase.table("languages").update({"word_count": new_count}).eq("id", lang_id).execute()
    print(f"  Updated word_count: {old_count} -> {new_count}")

    return {"language": lang_slug, "words": inserted, "skipped": skipped, "status": "uploaded"}


def main():
    seeds_dir = Path(__file__).parent / "seeds_merged"
    dry_run = "--upload" not in sys.argv

    # Filter to specific language if provided
    filter_lang = None
    for arg in sys.argv[1:]:
        if arg != "--upload":
            filter_lang = arg.lower()

    if dry_run:
        print("DRY RUN mode — showing what would be uploaded.")
        print("Run with --upload to actually push to Supabase.\n")

    if not seeds_dir.exists():
        print(f"ERROR: {seeds_dir} does not exist")
        sys.exit(1)

    files = sorted(seeds_dir.glob("*.json"))
    if filter_lang:
        files = [f for f in files if filter_lang in f.stem.lower()]
        if not files:
            print(f"No files matching '{filter_lang}' found in {seeds_dir}")
            sys.exit(1)

    print(f"Found {len(files)} merged files to process")
    print("=" * 60)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    results = []
    for filepath in files:
        result = upload_file(str(filepath), supabase, dry_run=dry_run)
        results.append(result)

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    total_new = 0
    total_skipped = 0
    for r in results:
        total_new += r["words"]
        total_skipped += r.get("skipped", 0)
        print(f"  {r['language']:20s} — {r['words']:4d} new, {r.get('skipped', 0):4d} skipped ({r['status']})")
    print(f"\n  Total: {total_new} new words, {total_skipped} skipped across {len(results)} languages")


if __name__ == "__main__":
    main()
