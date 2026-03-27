#!/usr/bin/env python3
"""
Fix Unicode slugs in Supabase words table.

Converts all non-ASCII slugs to ASCII using the same slugify logic as seed.mjs.
For words with non-Latin scripts (Cyrillic, Hangul, Arabic, etc.), the slug is
derived from the romanization in parentheses in the word field, or from the
english_equivalent as a fallback.

Usage:
  python3 data/fix_unicode_slugs.py                # Dry run (shows changes)
  python3 data/fix_unicode_slugs.py --apply        # Actually update Supabase

Requires: pip install supabase
"""

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
SUPABASE_URL = env.get("SUPABASE_URL") or env.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
    sys.exit(1)


def slugify(text: str) -> str:
    """Create an ASCII-only URL slug. Matches seed.mjs logic."""
    text = text.strip().lower()
    text = unicodedata.normalize("NFD", text)
    text = re.sub(r'[\u0300-\u036f]', '', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-') or ''


def main():
    dry_run = "--apply" not in sys.argv
    if dry_run:
        print("DRY RUN — showing what would change.")
        print("Run with --apply to update Supabase.\n")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Fetch all words
    all_words = []
    offset = 0
    batch_size = 1000
    while True:
        result = supabase.table("words").select("id, word, slug, english_equivalent, language_id").range(offset, offset + batch_size - 1).execute()
        batch = result.data or []
        all_words.extend(batch)
        if len(batch) < batch_size:
            break
        offset += batch_size

    print(f"Total words in DB: {len(all_words)}")

    # Find words with non-ASCII slugs
    non_ascii = [w for w in all_words if not re.match(r'^[a-z0-9-]+$', w['slug'])]
    print(f"Words with non-ASCII slugs: {len(non_ascii)}\n")

    if not non_ascii:
        print("Nothing to fix!")
        return

    # Group by language for conflict detection
    by_language = {}
    for w in all_words:
        lid = w['language_id']
        if lid not in by_language:
            by_language[lid] = {}
        by_language[lid][w['slug']] = w['id']

    updated = 0
    skipped = 0
    conflicts = 0

    for w in non_ascii:
        word_text = w['word']
        eng = w['english_equivalent'] or ''
        old_slug = w['slug']

        # Compute new ASCII slug
        new_slug = slugify(word_text) or slugify(eng) or f"word-{w['id'][:8]}"

        if new_slug == old_slug:
            skipped += 1
            continue

        # Check for conflicts within same language
        lang_slugs = by_language.get(w['language_id'], {})
        if new_slug in lang_slugs and lang_slugs[new_slug] != w['id']:
            # Append a suffix to avoid collision
            for suffix in range(2, 100):
                candidate = f"{new_slug}-{suffix}"
                if candidate not in lang_slugs:
                    new_slug = candidate
                    break
            conflicts += 1

        if dry_run:
            print(f"  {old_slug:30} → {new_slug:30} (word: {word_text[:40]})")
        else:
            result = supabase.table("words").update({"slug": new_slug}).eq("id", w['id']).execute()
            if result.data:
                print(f"  Updated: {old_slug} → {new_slug}")
            else:
                print(f"  FAILED: {old_slug} → {new_slug}")

        # Track the new slug to avoid future conflicts
        lang_slugs[new_slug] = w['id']
        updated += 1

    print(f"\n{'Would update' if dry_run else 'Updated'}: {updated} words")
    print(f"Skipped (already ASCII): {skipped}")
    print(f"Slug conflicts resolved: {conflicts}")

    if dry_run and updated > 0:
        print(f"\nRun with --apply to execute these changes.")


if __name__ == "__main__":
    main()
