#!/usr/bin/env python3
"""
Merge seed data into a unified format for upload.
Reads from data/seeds/ and data/seeds_enriched/, writes to data/seeds_merged/.
"""

import json
import os
import re

SEEDS_DIR = "data/seeds"
ENRICHED_DIR = "data/seeds_enriched"
MERGED_DIR = "data/seeds_merged"

DEFAULTS = {
    "example_sentences": [],
    "regional_variations": [],
    "related_words": [],
    "audio_url": None,
    "needs_review": False,
}

# Map enriched filenames to language keys
# e.g. "arabic_enriched.json" -> "arabic", "new_english.json" -> "english"
ENRICHED_NAME_MAP = {
    "new_english.json": "english",
}


def get_language_from_enriched(filename):
    if filename in ENRICHED_NAME_MAP:
        return ENRICHED_NAME_MAP[filename]
    return filename.replace("_enriched", "").replace(".json", "")


def normalize_entry(entry):
    """Add missing fields with defaults, drop slug."""
    normalized = dict(entry)
    normalized.pop("slug", None)
    for key, default in DEFAULTS.items():
        if key not in normalized or normalized[key] is None:
            if key in ("example_sentences", "regional_variations", "related_words"):
                normalized[key] = list(default)
            else:
                normalized[key] = default
    return normalized


def extract_word_key(word_field):
    """Normalize word field for dedup comparison (case-insensitive, strip whitespace)."""
    return word_field.strip().lower()


def backfill(enriched, seed):
    """Prefer enriched but fill empty/null fields from seed."""
    merged = dict(enriched)
    for key, val in seed.items():
        if key == "slug":
            continue
        if key not in merged or merged[key] is None or merged[key] == "" or merged[key] == []:
            if val is not None and val != "" and val != []:
                merged[key] = val
    return merged


def load_seed(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict) and "words" in data:
        return data["words"]
    if isinstance(data, list):
        return data
    return []


def load_enriched(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and "words" in data:
        return data["words"]
    return []


def main():
    os.makedirs(MERGED_DIR, exist_ok=True)

    # Discover all languages
    seed_languages = {}
    for f in sorted(os.listdir(SEEDS_DIR)):
        if f.endswith(".json"):
            lang = f.replace(".json", "")
            seed_languages[lang] = os.path.join(SEEDS_DIR, f)

    enriched_languages = {}
    for f in sorted(os.listdir(ENRICHED_DIR)):
        if f.endswith(".json"):
            lang = get_language_from_enriched(f)
            if lang not in enriched_languages:
                enriched_languages[lang] = []
            enriched_languages[lang].append(os.path.join(ENRICHED_DIR, f))

    all_languages = sorted(set(list(seed_languages.keys()) + list(enriched_languages.keys())))

    # Summary table
    rows = []
    print(f"\n{'Language':<15} {'Seeds':>6} {'Enriched':>9} {'Dupes':>6} {'Merged':>7}")
    print("-" * 48)

    for lang in all_languages:
        seed_entries = []
        enriched_entries = []

        if lang in seed_languages:
            seed_entries = load_seed(seed_languages[lang])

        if lang in enriched_languages:
            for fp in enriched_languages[lang]:
                enriched_entries.extend(load_enriched(fp))

        # Normalize all seed entries
        seed_entries = [normalize_entry(e) for e in seed_entries]
        enriched_entries = [normalize_entry(e) for e in enriched_entries]

        # Build lookup from enriched by word key
        enriched_map = {}
        for e in enriched_entries:
            key = extract_word_key(e["word"])
            enriched_map[key] = e

        # Build lookup from seed by word key
        seed_map = {}
        for e in seed_entries:
            key = extract_word_key(e["word"])
            seed_map[key] = e

        # Merge: start with all enriched, then add non-duplicate seeds
        merged = {}
        dupes = 0

        # Add all enriched entries
        for key, entry in enriched_map.items():
            if key in seed_map:
                # Duplicate: prefer enriched, backfill from seed
                merged[key] = backfill(entry, seed_map[key])
                dupes += 1
            else:
                merged[key] = entry

        # Add seed-only entries
        for key, entry in seed_map.items():
            if key not in merged:
                merged[key] = entry

        final = list(merged.values())

        # Write output
        out_path = os.path.join(MERGED_DIR, f"{lang}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(final, f, ensure_ascii=False, indent=2)

        seed_count = len(seed_entries)
        enriched_count = len(enriched_entries)
        print(f"{lang:<15} {seed_count:>6} {enriched_count:>9} {dupes:>6} {len(final):>7}")
        rows.append((lang, seed_count, enriched_count, dupes, len(final)))

    # Totals
    total_seeds = sum(r[1] for r in rows)
    total_enriched = sum(r[2] for r in rows)
    total_dupes = sum(r[3] for r in rows)
    total_merged = sum(r[4] for r in rows)
    print("-" * 48)
    print(f"{'TOTAL':<15} {total_seeds:>6} {total_enriched:>9} {total_dupes:>6} {total_merged:>7}")
    print(f"\nWrote {len(rows)} files to {MERGED_DIR}/")


if __name__ == "__main__":
    main()
