#!/usr/bin/env python3
"""
Validate and fix seed data in seeds_test/ to match the schema expected by Supabase.

Fixes:
1. Rename "pronunciation" -> "ipa_pronunciation" (danish.json)
2. Map expanded categories to the 6 valid DB categories
3. Remove "needs_review" field (not in DB schema)
4. Generate slugs for words that don't have them
5. Validate severity 1-5, required fields, JSON structure
"""

import json
import os
import re
import sys
from pathlib import Path

VALID_CATEGORIES = {"insult", "exclamation", "sexual", "scatological", "religious", "body_part"}

# Map expanded categories to valid ones
CATEGORY_MAP = {
    # Direct matches
    "insult": "insult",
    "exclamation": "exclamation",
    "sexual": "sexual",
    "scatological": "scatological",
    "religious": "religious",
    "body_part": "body_part",
    "anatomical": "body_part",
    "bodily": "body_part",
    "body": "body_part",
    "genital": "body_part",
    "genitalia": "body_part",

    # Sexual-adjacent
    "vulgar": "sexual",
    "vulgarity": "sexual",
    "prostitution": "sexual",
    "sexuality": "sexual",
    "sexual_orientation": "sexual",
    "gender": "sexual",
    "gendered": "sexual",
    "LGBTQ": "sexual",
    "homophobic": "insult",

    # Insult-adjacent
    "ableist": "insult",
    "racist": "insult",
    "sexist": "insult",
    "xenophobic": "insult",
    "hate_speech": "insult",
    "derogatory": "insult",
    "dismissive": "insult",
    "hostile": "insult",
    "threat": "insult",
    "silencing": "insult",
    "worthlessness": "insult",
    "animal": "insult",
    "intelligence": "insult",
    "appearance": "insult",
    "character": "insult",
    "mental_health": "insult",
    "disability": "insult",
    "disease": "insult",
    "illness": "insult",
    "medical": "insult",
    "age": "insult",
    "class": "insult",
    "criminal": "insult",
    "violent": "insult",
    "aggression": "insult",

    # Exclamation-adjacent
    "expression": "exclamation",
    "emotion": "exclamation",
    "surprise": "exclamation",
    "frustration": "exclamation",
    "anger": "exclamation",
    "filler": "exclamation",
    "intensifier": "exclamation",
    "intensified": "exclamation",
    "command": "exclamation",
    "curse": "exclamation",

    # Religious-adjacent
    "supernatural": "religious",
    "blasphemy": "religious",
    "taboo": "religious",

    # Scatological-adjacent
    "bodily_function": "scatological",
    "feces": "scatological",
    "urine": "scatological",
    "flatulence": "scatological",

    # Insult subtypes
    "racial": "insult",
    "slur": "insult",
    "ageist": "insult",
    "comedic": "insult",
    "creative": "insult",
    "object": "insult",
    "plural": "insult",
    "severe": "insult",
    "violence": "insult",
    "locational": "insult",
    "location": "insult",
    "disbelief": "exclamation",
    "informal": "exclamation",
    "positive": "exclamation",
    "euphemism": "exclamation",
    "descriptive": "insult",
    "moral_judgment": "insult",
    "trouble": "insult",
    "speech": "exclamation",
    "modifier": "exclamation",
    "strong": "insult",
    "anatomy": "body_part",
    "anglicism": "exclamation",
    "ethnic": "insult",
    "masculinity": "insult",
    "directional": "exclamation",
    "outdated": "insult",
    "internet": "insult",
    "LGBTQ": "insult",

    # Categories to drop (linguistic descriptors, not content categories)
    "verb": None,
    "noun": None,
    "adjective": None,
    "adverb": None,
    "phrase": None,
    "idiom": None,
    "slang": None,
    "loanword": None,
    "compound": None,
    "diminutive": None,
    "pronoun": None,
    "abstract": None,
    "concept": None,
    "versatile": None,
    "action": None,
    "movement": None,
    "behavior": None,
    "mental": None,
    "attitude": None,
    "mild": None,
    "extreme": None,
    "historical": None,
    "archaic": None,
    "cultural": None,
    "geographical": None,
    "regional": None,
    "political": None,
    "school": None,
    "prison": None,
    "food": None,
    "alcohol": None,
    "drug": None,
    "nature": None,
    "familial": None,
    "family": None,
    "honor": None,
    "social": None,
}


def slugify(text: str) -> str:
    """Create a URL-safe slug from text."""
    # Remove parenthetical romanizations like "(ssibal)"
    text = re.sub(r'\s*\([^)]*\)\s*', '', text)
    text = text.strip().lower()
    # Replace spaces/underscores with hyphens
    text = re.sub(r'[\s_]+', '-', text)
    # Remove non-alphanumeric (keep hyphens and unicode letters)
    text = re.sub(r'[^\w\-]', '', text, flags=re.UNICODE)
    # Collapse multiple hyphens
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')
    return text or 'unknown'


def map_categories(cats: list) -> list:
    """Map expanded categories to valid DB categories."""
    mapped = set()
    unmapped = []
    for cat in cats:
        cat_lower = cat.lower().strip()
        if cat_lower in VALID_CATEGORIES:
            mapped.add(cat_lower)
        elif cat_lower in CATEGORY_MAP:
            val = CATEGORY_MAP[cat_lower]
            if val is not None:
                mapped.add(val)
        else:
            unmapped.append(cat)

    # If nothing mapped, default to "insult" as fallback
    if not mapped and cats:
        mapped.add("insult")

    return sorted(mapped), unmapped


def validate_and_fix_file(filepath: str, fix: bool = True) -> dict:
    """Validate and optionally fix a seed file. Returns a report."""
    report = {
        "file": os.path.basename(filepath),
        "errors": [],
        "warnings": [],
        "fixes": [],
        "word_count": 0,
    }

    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            report["errors"].append(f"Invalid JSON: {e}")
            return report

    # Check top-level structure
    for field in ["language", "iso_code", "cultural_notes", "words"]:
        if field not in data:
            report["errors"].append(f"Missing top-level field: {field}")

    if "words" not in data:
        return report

    words = data["words"]
    report["word_count"] = len(words)
    slugs_seen = set()
    all_unmapped = set()

    for i, word in enumerate(words):
        word_name = word.get("word", f"[index {i}]")

        # Fix: rename "pronunciation" to "ipa_pronunciation"
        if "pronunciation" in word and "ipa_pronunciation" not in word:
            if fix:
                word["ipa_pronunciation"] = word.pop("pronunciation")
                report["fixes"].append(f"#{i} '{word_name}': renamed pronunciation -> ipa_pronunciation")
            else:
                report["errors"].append(f"#{i} '{word_name}': uses 'pronunciation' instead of 'ipa_pronunciation'")

        # Fix: remove needs_review
        if "needs_review" in word:
            if word["needs_review"] is True:
                report["warnings"].append(f"#{i} '{word_name}': needs_review=true (flagged for review)")
            if fix:
                del word["needs_review"]
                report["fixes"].append(f"#{i} '{word_name}': removed needs_review field")

        # Validate severity
        sev = word.get("severity")
        if sev is None or not isinstance(sev, int) or sev < 1 or sev > 5:
            report["errors"].append(f"#{i} '{word_name}': invalid severity={sev}")

        # Fix: map categories
        cats = word.get("categories", [])
        mapped, unmapped = map_categories(cats)
        if unmapped:
            all_unmapped.update(unmapped)
            report["warnings"].append(f"#{i} '{word_name}': unmapped categories: {unmapped}")
        if fix and set(cats) != set(mapped):
            word["categories"] = mapped
            report["fixes"].append(f"#{i} '{word_name}': categories {cats} -> {mapped}")

        # Validate required fields
        for field in ["word", "meaning", "severity", "categories"]:
            val = word.get(field)
            if val is None or (isinstance(val, str) and not val.strip()):
                report["errors"].append(f"#{i} '{word_name}': missing/empty required field '{field}'")

        # Generate slug if missing
        slug = word.get("slug")
        if not slug:
            slug = slugify(word.get("word", ""))
            if fix:
                word["slug"] = slug
                report["fixes"].append(f"#{i} '{word_name}': generated slug '{slug}'")

        # Check slug uniqueness
        if slug in slugs_seen:
            report["errors"].append(f"#{i} '{word_name}': duplicate slug '{slug}'")
        slugs_seen.add(slug)

        # Ensure example_sentences and regional_variations are proper types
        if "example_sentences" not in word:
            if fix:
                word["example_sentences"] = []
        if "regional_variations" not in word:
            if fix:
                word["regional_variations"] = []
        if "related_words" not in word:
            if fix:
                word["related_words"] = []

        # Ensure optional fields exist with null defaults
        for opt_field in ["literal_translation", "english_equivalent", "cultural_context",
                          "example_usage", "ipa_pronunciation", "audio_url"]:
            if opt_field not in word:
                if fix:
                    word[opt_field] = None

    if all_unmapped:
        report["warnings"].append(f"All unmapped categories in file: {sorted(all_unmapped)}")

    # Write fixed file
    if fix:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        report["fixes"].append("File saved with fixes applied")

    return report


def main():
    seeds_test_dir = Path(__file__).parent / "seeds_test"

    if not seeds_test_dir.exists():
        print(f"Directory not found: {seeds_test_dir}")
        sys.exit(1)

    fix_mode = "--fix" in sys.argv

    print(f"{'FIXING' if fix_mode else 'VALIDATING'} seed data in {seeds_test_dir}\n")
    print("=" * 70)

    total_errors = 0
    total_warnings = 0
    total_fixes = 0
    total_words = 0

    for filepath in sorted(seeds_test_dir.glob("*.json")):
        report = validate_and_fix_file(str(filepath), fix=fix_mode)

        total_words += report["word_count"]
        total_errors += len(report["errors"])
        total_warnings += len(report["warnings"])
        total_fixes += len(report["fixes"])

        status = "OK" if not report["errors"] else "ERRORS"
        print(f"\n{report['file']} ({report['word_count']} words) — {status}")

        for err in report["errors"]:
            print(f"  ERROR: {err}")
        for warn in report["warnings"]:
            print(f"  WARN:  {warn}")
        if fix_mode:
            for fix in report["fixes"][:5]:  # Show first 5 fixes
                print(f"  FIX:   {fix}")
            remaining = len(report["fixes"]) - 5
            if remaining > 0:
                print(f"  FIX:   ... and {remaining} more fixes")

    print("\n" + "=" * 70)
    print(f"TOTAL: {total_words} words across {len(list(seeds_test_dir.glob('*.json')))} files")
    print(f"  Errors:   {total_errors}")
    print(f"  Warnings: {total_warnings}")
    if fix_mode:
        print(f"  Fixes:    {total_fixes}")

    if not fix_mode and (total_errors > 0 or total_warnings > 0):
        print(f"\nRun with --fix to apply fixes: python3 {__file__} --fix")

    sys.exit(1 if total_errors > 0 and not fix_mode else 0)


if __name__ == "__main__":
    main()
