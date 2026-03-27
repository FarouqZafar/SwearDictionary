# SwearDictionary

The world's most comprehensive multilingual profanity encyclopedia. A browsable, searchable reference for swear words across 40+ languages with severity ratings, cultural context, and pronunciation.

## Vision

"Emojipedia for swear words" — an SEO-driven content site monetized with ads. Every word gets its own page, every language gets its own section. The content is educational, witty, and culturally rich — not just a word list.

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (for community submissions later)
- **Hosting**: Vercel
- **Analytics**: PostHog (session analytics), Vercel Analytics (traffic)
- **Fonts**: Instrument Serif (headings), DM Sans (body), JetBrains Mono (labels/stats/code)

## Design system

- **Theme**: Light/dark mode. Light is default. Background: `#f5f3ee` (light) / `#0e0e10` (dark). Surface: `#ffffff` / `#161618`. Accent: `#e8943a`.
- **Theme toggle**: Sun/moon icon in navbar, preference persisted to `localStorage`. `data-theme` attribute on `<html>`.
- **Severity colors**: Mild `#4ecca3`, Moderate `#e8c23a`, Strong `#e87a3a`, Severe `#d94242`, Nuclear `#c24b8a`
- **Personality**: Editorial, witty, human. Not clinical or AI-template-looking. Asymmetric layouts, mixed typography, cheeky microcopy.
- **Reference**: See `/design/` folder for approved homepage HTML mockup.

## URL structure (SEO-critical)

```
/                              → Homepage (search + browse languages + trending)
/words                         → All words with filters, sort, pagination
/language/[slug]               → Language page (e.g. /language/spanish)
/language/[slug]/[word-slug]   → Word detail page (e.g. /language/spanish/joder)
/search?q=[query]              → Search results
/languages                     → All languages grid
/submit                        → Community word submission + email waitlist
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

### `waitlist` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Unique email address |
| created_at | timestamptz | |

### Indexes
- `words(language_id, slug)` — unique, used for URL routing
- `words(language_id, severity)` — for filtering
- `words(word)` — for search
- `words(views DESC)` — for trending

## Components

| Component | File | Type | Purpose |
|-----------|------|------|---------|
| Navbar | `components/Navbar.tsx` | Server | Site header with logo, nav links, theme toggle, submit button |
| ThemeToggle | `components/ThemeToggle.tsx` | Client | Sun/moon toggle, reads/writes localStorage |
| PostHogProvider | `components/PostHogProvider.tsx` | Client | Wraps app for PostHog session analytics |
| LanguageGrid | `app/languages/LanguageGrid.tsx` | Client | Filterable grid of all languages |
| WordFilters | `app/language/[slug]/WordFilters.tsx` | Client | Severity/category filters + word card grid for language pages |
| WordsGrid | `app/words/WordsGrid.tsx` | Client | Full filter/sort/paginate grid for /words page |
| PronounceButton | `app/language/[slug]/[word-slug]/PronounceButton.tsx` | Client | Web Speech API pronunciation button |
| ViewTracker | `app/language/[slug]/[word-slug]/ViewTracker.tsx` | Client | Fires POST to /api/track-view on word page load |

## API Routes

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/track-view` | `app/api/track-view/route.ts` | Increments word view count in Supabase |
| `POST /api/waitlist` | `app/api/waitlist/route.ts` | Adds email to waitlist table via service role key |

## Page specifications

### Homepage (`/`)
- Hero: left-aligned, editorial. Headline with personality. Big search bar.
- Stats row: languages count, word count, severity levels.
- Word of the Day (rotates daily), severity scale explainer, trending words grid.
- CTA: "Submit a word" callout.
- **Rendering**: ISR, revalidates every 1 hour.

### All Words page (`/words`)
- Full filter/sort grid: severity pills, category checkboxes, language dropdown, sort (views/severity/A-Z/newest)
- "Random Word" button, active filter count, 12 words per page with pagination
- Search bar submits to `/search?q=`
- **Rendering**: ISR, revalidates every 1 hour.

### Language page (`/language/[slug]`)
- Header: flag + language name + word count.
- Filter sidebar: severity, category. Word cards with pronunciation button.
- 18 words per page with pagination.
- **Rendering**: SSG with `generateStaticParams`, revalidates every 1 hour.

### Word detail page (`/language/[slug]/[word-slug]`)
- Breadcrumb, word hero with IPA badge + pronunciation button inline.
- Meaning & usage, example sentences, cultural context.
- Sidebar: severity rating bar, related words (up to 6).
- **Rendering**: SSG with `generateStaticParams`, revalidates every 1 hour.
- **SEO**: Unique meta title/description, DefinedTerm + BreadcrumbList JSON-LD, canonical URL.

### Search (`/search?q=[query]`)
- Server-side ilike search across word, translation, equivalent, meaning.
- Results grouped by language with severity badges.

## Content generation

The initial database is seeded using AI (Claude API) to generate structured word entries, then manually reviewed. Each word entry is generated as JSON matching the `words` table schema.

Current data: **31 languages, 2,030 words**. Lowest: English (26), Farsi (26), Vietnamese (27). Highest: Turkish (223), Bosnian (100), Dutch (90).

## SEO strategy

- Every word page targets "[word] meaning", "what does [word] mean", "[word] translation".
- Every language page targets "swear words in [language]", "[language] curse words", "bad words in [language]".
- Structured data: DefinedTerm schema on word pages, DefinedTermSet on language pages, WebSite on homepage.
- Sitemap: auto-generated from database, revalidates every 24h, covers all 2,065 URLs.
- Meta descriptions: unique per page.

## Coding conventions

- Use TypeScript strict mode.
- Server components by default, `"use client"` only when needed (filters, toggle, analytics).
- Use Next.js App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`).
- Colocate components with their routes when page-specific.
- Shared components go in `/components`.
- Database queries go in `/lib/queries.ts`.
- Types go in `/types/index.ts`.
- Keep components small and focused. One file per component.
- Use `generateStaticParams` for all language and word pages (SSG).
- Use `generateMetadata` for dynamic SEO meta tags on every page.

## Monetization

- Google AdSense (primary). Ad placements: sidebar on word pages, between word list rows on language pages, footer.
- Content must be educational to pass AdSense review.
- Future: API access for content moderation tools (paid tier).

## Project phases

### Phase 1 — MVP (current)
- [x] Next.js project setup with Tailwind + Supabase
- [x] Database schema and seed script
- [x] Homepage
- [x] Language page with filters
- [x] Word detail page with pronunciation
- [x] Search
- [x] SEO: sitemap, meta tags, structured data
- [x] Deploy to Vercel

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
