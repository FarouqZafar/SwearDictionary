#!/usr/bin/env python3
"""Update IPA pronunciations for Turkish words in Supabase."""

import json
import os
import sys
from pathlib import Path

try:
    from supabase import create_client
except ImportError:
    print("Missing dependency. Run: pip install supabase")
    sys.exit(1)

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
    print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

def main():
    seeds_path = Path(__file__).parent / "seeds" / "turkish.json"
    with open(seeds_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Get Turkish language ID
    lang = supabase.table("languages").select("id").eq("slug", "turkish").single().execute()
    if not lang.data:
        print("Turkish language not found in DB")
        sys.exit(1)
    lang_id = lang.data["id"]

    updated = 0
    for word in data['words']:
        ipa = word.get('ipa_pronunciation')
        word_text = word.get('word')
        if not ipa or not word_text:
            continue

        result = supabase.table("words").update(
            {"ipa_pronunciation": ipa}
        ).eq("language_id", lang_id).eq("word", word_text).execute()

        if result.data:
            updated += len(result.data)

    print(f"Updated {updated}/{len(data['words'])} Turkish words with IPA in Supabase")

if __name__ == "__main__":
    main()
