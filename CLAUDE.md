# SwearDictionary

The world's most comprehensive multilingual profanity encyclopedia. A browsable, searchable reference for swear words across 40+ languages with severity ratings, cultural context, and pronunciation.

## Vision

"Emojipedia for swear words" — an SEO-driven content site monetized with ads. Every word gets its own page, every language gets its own section. The content is educational, witty, and culturally rich — not just a word list.

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (for community submissions later)
- **Hosting**: Vercel
- **Fonts**: Instrument Serif (headings), DM Sans (body), JetBrains Mono (labels/stats/code)

## Design system

- **Theme**: Dark mode primary. Background: `#0e0e10`. Surface: `#161618`. Accent: `#e8943a`.
- **Severity colors**: Mild `#4ecca3`, Moderate `#e8c23a`, Strong `#e87a3a`, Severe `#d94242`, Nuclear `#c24b8a`
- **Personality**: Editorial, witty, human. Not clinical or AI-template-looking. Asymmetric layouts, mixed typography, cheeky microcopy.
- **Reference**: See `/design/` folder for approved homepage HTML mockup.

## URL structure (SEO-critical)

```
/                              → Homepage (search + browse languages + trending)
/language/[slug]               → Language page (e.g. /language/spanish)
/language/[slug]/[word-slug]   → Word detail page (e.g. /language/spanish/joder)
/search?q=[query]              → Search results
/languages                     → All languages grid
/submit                        → Community word submission form
/about                         → About page
```

## Database schema

### `languages` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Display name (e.g. "Spanish") |
| slug | text | URL slug (e.g. "spanish") |
| native_name | text | Name in native script (e.g. "Español") |
| flag_emoji | text | Country flag emoji |
| word_count | int | Cached count of words |
| description | text | 2-3 sentence intro about swearing in this language |
| created_at | timestamptz | |

### `words` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| language_id | uuid | FK → languages.id |
| word | text | The swear word |
| slug | text | URL-safe slug |
| literal_translation | text | Direct translation |
| english_equivalent | text | Closest English swear word(s) |
| severity | int | 1=mild, 2=moderate, 3=strong, 4=severe, 5=nuclear |
| categories | text[] | Array: insult, exclamation, body_part, sexual, religious, scatological |
| meaning | text | What it actually means / how it's used (2-3 sentences) |
| cultural_context | text | Cultural background, when/where it's used (2-4 sentences) |
| example_sentences | jsonb | Array of {original, translation} objects |
| regional_variations | jsonb | Array of {region, severity, note} objects |
| ipa_pronunciation | text | IPA phonetic transcription |
| audio_url | text | URL to pronunciation audio file (nullable) |
| related_words | text[] | Array of related word slugs |
| is_published | boolean | Whether visible on site (for moderation) |
| submitted_by | uuid | FK → auth.users (nullable, for community submissions) |
| views | int | Page view counter |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Indexes
- `words(language_id, slug)` — unique, used for URL routing
- `words(language_id, severity)` — for filtering
- `words(word)` — for search
- `words(views DESC)` — for trending

## Page specifications

### Homepage (`/`)
- Hero: left-aligned, editorial. Headline with personality. Big search bar.
- Stats row: languages count, word count, severity levels.
- Language grid: asymmetric — one featured tall card + smaller cards.
- Trending words: editorial cards with severity badges.
- CTA: "Submit a word" callout.

### Language page (`/language/[slug]`)
- Header: flag + language name + word count + intro paragraph.
- Filter bar: severity, category, sort (A-Z / severity / most viewed).
- Word list: rows/cards showing word, quick translation, severity badge, snippet.
- Each word row links to its detail page.
- Bottom: related editorial content for SEO.
- **Rendering**: Static generation (SSG) with `generateStaticParams`.

### Word detail page (`/language/[slug]/[word-slug]`)
- Breadcrumb: Home > Spanish > Joder
- Word header: big word + IPA pronunciation + audio play button + severity badge + category tags.
- Quick facts card: literal meaning, English equivalent, severity explanation.
- Usage & examples: 3+ example sentences with translations.
- Cultural context: editorial paragraph about usage, history, regional notes.
- Regional variations: cards showing severity/usage differences by country.
- Related words: links to similar words in the same language.
- **Rendering**: Static generation (SSG) with `generateStaticParams`.
- **SEO**: Each page has unique meta title, description, and structured data (DefinedTerm schema).

### Search (`/search?q=[query]`)
- Server-side search against Supabase full-text search.
- Results grouped by language.
- Shows word, language flag, severity, and snippet.

## Content generation

The initial database is seeded using AI (Claude API) to generate structured word entries, then manually reviewed. Each word entry is generated as JSON matching the `words` table schema. Target: 20 languages × 50-100 words each = 1,000-2,000 words for launch.

Priority languages for launch:
Spanish, French, German, Japanese, Korean, Russian, Italian, Portuguese, Turkish, Arabic, Polish, Dutch, Swedish, Finnish, Hindi, Chinese (Mandarin), Thai, Greek, Czech, Romanian

## SEO strategy

- Every word page targets "[word] meaning", "what does [word] mean", "[word] translation".
- Every language page targets "swear words in [language]", "[language] curse words", "bad words in [language]".
- Structured data: DefinedTerm schema on word pages.
- Sitemap: auto-generated from database.
- Meta descriptions: unique per page, written with personality.

## Coding conventions

- Use TypeScript strict mode.
- Server components by default, `"use client"` only when needed (search, audio player, filters).
- Use Next.js App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`).
- Colocate components with their routes when page-specific.
- Shared components go in `/components`.
- Database queries go in `/lib/supabase/queries.ts`.
- Types go in `/types/index.ts`.
- Keep components small and focused. One file per component.
- Use `generateStaticParams` for all language and word pages (SSG).
- Use `generateMetadata` for dynamic SEO meta tags on every page.

## Monetization

- Google AdSense (primary). Ad placements: sidebar on word pages, between word list rows on language pages, footer.
- Content must be educational to pass AdSense review. Censor display text where needed (e.g. "f**k") but keep searchable.
- Future: API access for content moderation tools (paid tier).

## Project phases

### Phase 1 — MVP (current)
- [ ] Next.js project setup with Tailwind + Supabase
- [ ] Database schema and seed script
- [ ] Homepage
- [ ] Language page with filters
- [ ] Word detail page with pronunciation
- [ ] Search
- [ ] SEO: sitemap, meta tags, structured data
- [ ] Deploy to Vercel

### Phase 2 — Community
- [ ] User auth (Supabase Auth)
- [ ] Word submission form with moderation queue
- [ ] Upvote/downvote on word accuracy
- [ ] Native speaker verification badges

### Phase 3 — Growth
- [ ] Audio pronunciations (AI TTS pre-generated)
- [ ] Blog/editorial content for SEO
- [ ] API for content moderation tools
- [ ] More languages, regional dialects
