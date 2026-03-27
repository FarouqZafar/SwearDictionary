#!/usr/bin/env python3
"""
Generate IPA pronunciations for Turkish words.

Turkish has very regular phonetics — nearly 1:1 letter-to-sound mapping.
This script applies standard Turkish phonological rules.
"""

import json
from pathlib import Path

# Turkish letter → IPA mapping
TURKISH_IPA = {
    'a': 'a', 'b': 'b', 'c': 'dʒ', 'ç': 'tʃ', 'd': 'd',
    'e': 'e', 'f': 'f', 'g': 'ɡ', 'ğ': 'ː',  # lengthens previous vowel
    'h': 'h', 'ı': 'ɯ', 'i': 'i', 'j': 'ʒ', 'k': 'k',
    'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'ö': 'ø',
    'p': 'p', 'r': 'ɾ', 's': 's', 'ş': 'ʃ', 't': 't',
    'u': 'u', 'ü': 'y', 'v': 'v', 'y': 'j', 'z': 'z',
    # Less common
    'â': 'aː', 'î': 'iː', 'û': 'uː',
}

VOWELS = set('aeıioöuüâîû')


def turkish_to_ipa(word: str) -> str:
    """Convert a Turkish word to approximate IPA."""
    result = []
    lower = word.lower().strip()
    i = 0
    while i < len(lower):
        ch = lower[i]
        if ch == ' ':
            result.append(' ')
        elif ch in TURKISH_IPA:
            ipa = TURKISH_IPA[ch]
            # ğ after a vowel lengthens it; between vowels it's silent
            if ch == 'ğ' and result and result[-1] != ' ':
                # Just add length mark (already in mapping)
                result.append(ipa)
            else:
                result.append(ipa)
        elif ch == '\'':
            pass  # skip apostrophes
        else:
            result.append(ch)  # pass through unknown chars
        i += 1
    return ''.join(result)


def main():
    seeds_path = Path(__file__).parent / "seeds" / "turkish.json"

    with open(seeds_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated = 0
    for word in data['words']:
        if not word.get('ipa_pronunciation'):
            ipa = turkish_to_ipa(word['word'])
            word['ipa_pronunciation'] = ipa
            updated += 1

    with open(seeds_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated}/{len(data['words'])} words with IPA")
    # Show some samples
    for w in data['words'][:10]:
        print(f"  {w['word']:25s} → /{w['ipa_pronunciation']}/")


if __name__ == "__main__":
    main()
