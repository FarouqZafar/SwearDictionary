#!/usr/bin/env python3
"""
Upload seed data from seeds_test/ to Supabase.

Usage:
  python3 data/upload_seeds.py                  # Dry run (shows what would be uploaded)
  python3 data/upload_seeds.py --upload         # Actually upload to Supabase
  python3 data/upload_seeds.py --upload finnish  # Upload only finnish.json

Requires: pip install supabase
"""

import json
import os
import re
import sys
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
    """Create a URL-safe slug."""
    text = re.sub(r'\s*\([^)]*\)\s*', '', text)
    text = text.strip().lower()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^\w\-]', '', text, flags=re.UNICODE)
    text = re.sub(r'-+', '-', text)
    return text.strip('-') or 'unknown'


def language_slug(name: str) -> str:
    """Generate a language slug from the language name."""
    slug = name.strip().lower()
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'[^\w\-]', '', slug)
    return slug


def upload_file(filepath: str, dry_run: bool = True):
    """Upload a single seed file to Supabase."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    lang_name = data["language"]
    iso_code = data.get("iso_code", "")
    cultural_notes = data.get("cultural_notes", "")
    words = data.get("words", [])
    slug = language_slug(lang_name)

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Processing: {lang_name} ({len(words)} words)")

    if dry_run:
        print(f"  Language: {lang_name} (slug: {slug}, iso: {iso_code})")
        print(f"  Words: {len(words)}")
        print(f"  Sample word: {words[0]['word'] if words else 'N/A'}")
        return {"language": lang_name, "words": len(words), "status": "dry_run"}

    # Connect to Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Check if language already exists
    existing = supabase.table("languages").select("id, slug, word_count").eq("slug", slug).execute()

    if existing.data:
        lang_id = existing.data[0]["id"]
        old_count = existing.data[0]["word_count"]
        print(f"  Language '{lang_name}' already exists (id: {lang_id}, {old_count} words)")

        # Check for existing words to avoid duplicates
        existing_words = supabase.table("words").select("slug").eq("language_id", lang_id).execute()
        existing_slugs = {w["slug"] for w in (existing_words.data or [])}
        new_words = [w for w in words if w.get("slug", slugify(w["word"])) not in existing_slugs]

        if not new_words:
            print(f"  All {len(words)} words already exist. Skipping.")
            return {"language": lang_name, "words": 0, "status": "skipped"}

        print(f"  {len(new_words)} new words to add ({len(existing_slugs)} already exist)")
        words = new_words
    else:
        # Create language
        lang_row = {
            "name": lang_name,
            "slug": slug,
            "native_name": None,
            "iso_code": iso_code,
            "flag_emoji": None,
            "word_count": 0,
            "description": cultural_notes[:500] if cultural_notes else None,
            "cultural_notes": cultural_notes,
        }
        result = supabase.table("languages").insert(lang_row).execute()
        if not result.data:
            print(f"  ERROR: Failed to create language '{lang_name}'")
            return {"language": lang_name, "words": 0, "status": "error"}

        lang_id = result.data[0]["id"]
        print(f"  Created language '{lang_name}' (id: {lang_id})")

    # Prepare word rows
    word_rows = []
    for w in words:
        word_slug = w.get("slug") or slugify(w["word"])
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

    # Insert words in batches of 50
    inserted = 0
    batch_size = 50
    for i in range(0, len(word_rows), batch_size):
        batch = word_rows[i:i + batch_size]
        result = supabase.table("words").insert(batch).execute()
        if result.data:
            inserted += len(result.data)
            print(f"  Inserted batch {i // batch_size + 1}: {len(result.data)} words")
        else:
            print(f"  ERROR: Batch {i // batch_size + 1} failed")

    # Update word_count on language
    total_words = supabase.table("words").select("id", count="exact").eq("language_id", lang_id).eq("is_published", True).execute()
    new_count = total_words.count or 0
    supabase.table("languages").update({"word_count": new_count}).eq("id", lang_id).execute()
    print(f"  Updated word_count to {new_count}")

    return {"language": lang_name, "words": inserted, "status": "uploaded"}


def main():
    seeds_dir = Path(__file__).parent / "seeds_test"
    dry_run = "--upload" not in sys.argv

    # Filter to specific language if provided
    filter_lang = None
    for arg in sys.argv[1:]:
        if arg != "--upload":
            filter_lang = arg.lower()

    if dry_run:
        print("DRY RUN — showing what would be uploaded.")
        print("Run with --upload to actually push to Supabase.\n")

    files = sorted(seeds_dir.glob("*.json"))
    if filter_lang:
        files = [f for f in files if filter_lang in f.stem.lower()]
        if not files:
            print(f"No files matching '{filter_lang}' found.")
            sys.exit(1)

    print(f"Found {len(files)} seed files to process")
    print("=" * 50)

    results = []
    for filepath in files:
        result = upload_file(str(filepath), dry_run=dry_run)
        results.append(result)

    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    total_words = 0
    for r in results:
        total_words += r["words"]
        print(f"  {r['language']:20s} — {r['words']:4d} words ({r['status']})")
    print(f"\n  Total: {total_words} words across {len(results)} languages")


if __name__ == "__main__":
    main()
