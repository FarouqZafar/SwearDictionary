# SwearDictionary — Release Notes

---

## v0.1.0 — Database Foundation (2025-03-25)

### Database Schema
- Created full Supabase (PostgreSQL) schema with two core tables:
  - **`languages`** — stores language metadata (name, slug, iso_code, flag_emoji, word_count, cultural_notes)
  - **`words`** — stores word entries with 20+ fields (translations, severity, categories, meaning, cultural context, IPA pronunciation, etc.)
- Added indexes for URL routing (`language_id, slug`), severity filtering, trigram search, and trending (views DESC)
- Set up Row Level Security (RLS) — public read access, service-role-only writes
- Created auto-update triggers:
  - `updated_at` timestamp on word edits
  - `word_count` sync on language table when words are inserted/deleted
- Added `increment_word_views()` RPC for page view tracking
- Added `sync_word_counts()` RPC for bulk count reconciliation

### Seed Data
- Built idempotent seed script (`supabase/seed.mjs`) that reads JSON files and upserts into Supabase
- Initially seeded 375 words across 5 languages

### Project Setup
- Initialized `package.json` with `@supabase/supabase-js` dependency
- Created `.env.example` with required Supabase credentials

---

## v0.2.0 — Frontend & Pages (2026-03-26)

### Project Setup
- Next.js 16 (App Router) with TypeScript strict mode
- Tailwind CSS v4 with custom design system in `globals.css`
- Dark theme: `#0e0e10` background, `#e8943a` accent, severity color scale
- Fonts: Instrument Serif (headings), DM Sans (body), JetBrains Mono (labels)
- Supabase client configured with public anon key for read-only queries

### Seed Data
- Expanded from 5 to 15 languages with 808 words total
- Added: Chinese, French, Hindi, Italian, Japanese, Korean, Kurdish, Portuguese, Russian, Spanish, Vietnamese

### Pages Built
- Homepage, All Languages, Language Detail, Word Detail

### Components
- Navbar, WordFilters, LanguageGrid

### SEO
- `generateMetadata` on dynamic pages
- `generateStaticParams` on language and word pages (full SSG)
- ISR revalidation set to 1 hour

---

## v0.3.0 — Search, SEO & Error Handling (2026-03-26)

### Search
- Search page with Supabase ilike search across word, translation, equivalent, and meaning
- Results grouped by language with severity badges
- Homepage and language page search bars wired to `/search?q=`

### SEO & Indexing
- Sitemap (`app/sitemap.ts`) — auto-generated from database
- robots.txt (`app/robots.ts`) — allows all, disallows /admin/ and /api/
- JSON-LD structured data on word detail pages (DefinedTerm + BreadcrumbList)
- Open Graph + Twitter card tags on all pages

### New Pages
- About, Submit (placeholder), Search

### Error Handling
- `loading.tsx`, `error.tsx`, `not-found.tsx`

---

## v0.4.0 — Words Page, Homepage Redesign & Data Expansion (2026-03-27)

### All Words Page (`/words`)
- New server component page with full SEO metadata
- Client-side `WordsGrid` component (413 lines) with:
  - Severity pills, category checkboxes, language dropdown, sort (views/severity/A-Z/newest)
  - "Random Word" button — picks from filtered set, navigates to word page
  - Active filter count with "Clear all"
  - 3/2/1 column responsive grid, 12 words per page with pagination
  - Search bar submitting to `/search?q=`
- Added to sitemap with priority 0.9

### Homepage Redesign
- Replaced marketing-only homepage with content-rich landing page
- New layout matching words/languages page alignment (`max-width: 1200px` centered container)
- Sections: hero header with stats, search bar, quick links (/words, /languages, /submit), Word of the Day (rotates daily), "How bad is it?" severity scale explainer, trending words grid (sorted by views), "Why does this exist?" mission statement, CTA callout
- Removed: language grid and mini language row (now lives at `/languages`)

### View Tracking
- `POST /api/track-view` API route — increments `views` column in Supabase
- `ViewTracker` client component — fires on word detail page load
- Trending sections now reflect actual page visits

### Data Expansion
- Added 16 new languages: Bosnian, Czech, Danish, Dari, Dutch, Filipino, Finnish, Greek, Indonesian, Korean, Norwegian, Polish, Romanian, Swedish, Thai, Ukrainian
- Total: **31 languages, 2,030 words**
- Built `data/validate_and_fix_seeds.py` — validates schema, maps 72 expanded categories to 6 DB categories, fixes field names, generates slugs, removes extra fields
- Built `data/upload_seeds.py` — uploads seed JSON to Supabase with duplicate detection and batch inserts
- Updated all language `flag_emoji` values in database (no more globe fallbacks)

### Search Bar Improvements
- Languages page: existing filter input now also submits to `/search?q=` on Enter; gracefully shows all languages when typed text doesn't match any language name
- Language detail page: added search bar above filters, submits to `/search?q=`

### Navbar
- Added "Words" link between logo and "Languages"

### Other Changes
- Language detail page now shows 18 words per page (was 6)
- Added `getAllWords()` query to `lib/queries.ts` (12 total query functions)

---

## v0.5.0 — Pre-Deploy Fixes (2026-03-27)

### SEO Fixes
- Added `generateMetadata` to homepage with full title, description, Open Graph, and Twitter card tags
- Added canonical URLs (`alternates.canonical`) to every page: homepage, `/words`, `/languages`, `/language/[slug]`, `/language/[slug]/[word-slug]`, `/about`, `/submit`, and root layout
- Added JSON-LD structured data to language pages: `DefinedTermSet` schema + `BreadcrumbList` (Home > Languages > [Language])

### Code Cleanup
- Removed hardcoded `FLAG_MAP` from all 4 files (`app/page.tsx`, `app/language/[slug]/[word-slug]/page.tsx`, `app/search/page.tsx`, `app/languages/LanguageGrid.tsx`) — now uses `flag_emoji` from database everywhere with "🌍" fallback

### Security & Config
- Configured `next.config.ts`: `poweredByHeader: false`, `compress: true`, security headers (X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-DNS-Prefetch-Control on, Permissions-Policy)

### Build Verification
- Clean `npm run build` passes with zero TypeScript errors
- All 1,043 static pages generated successfully (31 language pages + 1,000 word pages + static pages)

---

## v0.6.0 — SEO Content & Internal Linking (2026-03-27)

### SEO Improvements
- **Word page intro sentence** (`app/language/[slug]/[word-slug]/page.tsx`): Added "What does [word] mean? [Word] is a [language] [severity] that translates to '[equivalent]' in English." at the top of every word detail page for search snippet targeting
- **Related words expanded** (`lib/queries.ts`): `getRelatedWords` default limit increased from 3 to 6, more internal links per word page
- **Sitemap dates fixed** (`app/sitemap.ts`): Static pages use fixed date `2026-03-27`, language pages use most recent `word.updated_at` for that language, word pages use individual `word.updated_at`

### Internal Linking
- **About page** (`app/about/page.tsx`): Added "Popular languages" section (top 5 by word count with links) and "Most viewed words" section (5 trending words with links)
- **Submit page** (`app/submit/page.tsx`): Added "Browse existing words" and "Browse by language" links at bottom pointing to `/words` and `/languages`

### CSS
- **`app/globals.css`**: Added `.about-links`, `.about-link`, `.submit-browse`, `.submit-browse-links`, `.submit-browse-link`, `.word-intro-sentence` styles

### Build
- Clean `npm run build` — zero TypeScript errors, 1,043 pages generated

---

## v0.7.0 — Pronunciation (2026-03-27)

### Web Speech API Pronunciation
- **`PronounceButton` component** (`app/language/[slug]/[word-slug]/PronounceButton.tsx`): New client component using Web Speech API (`SpeechSynthesisUtterance`) with language-specific voice matching for 31 languages
- Smart text extraction: strips parenthetical romanizations (e.g. `کس (Kos)` → speaks `کس`), falls back to romanization when no native voice is available
- Language code mapping (`LANG_MAP`) covers all 31 languages in the database
- Accepts optional `className` and `iconSize` props for reuse across different contexts

### Pronunciation on Word Detail Pages
- **Moved pronunciation button** from sidebar to inline in hero meta section, next to IPA badge
- Small 32px circular button with speaker icon, pulses when speaking

### Pronunciation on Word Cards
- **Added pronunciation to `/words` page cards** (`app/words/WordsGrid.tsx`): Reuses `PronounceButton` component with `pronounce-btn--card` class (26px, visible on hover)
- Click event properly prevented from triggering card navigation via `stopPropagation`

### Turkish IPA Data
- Generated IPA pronunciations for all 223 Turkish words using phonetic rules (`data/generate_turkish_ipa.py`)
- Uploaded to Supabase via `data/update_turkish_ipa.py`

### Bug Fixes
- **Duplicate slug errors**: Changed `getWordBySlug` from `.single()` to `.limit(1)` to handle duplicate slugs gracefully instead of throwing
- **Dari/Farsi 404s**: Added `decodeURIComponent(wordSlug)` in `getWordBySlug` to support Unicode (Arabic script) slugs in URLs
- **Supabase 1000-row limit**: `getAllWords` now batch-fetches with `.range()` in a while loop to retrieve all 2,030 words

### Build
- Clean `npm run build` — zero TypeScript errors, 1,043 pages generated

---

## v0.9.0 — Analytics, Light/Dark Mode & Email Waitlist (2026-03-27)

### Analytics
- **PostHog** (`components/PostHogProvider.tsx`): Added PostHog session analytics, wraps `{children}` in `app/layout.tsx`. Only captures in production (`loaded` callback calls `opt_out_capturing()` in non-production environments)
- **Vercel Analytics** (`@vercel/analytics`): Installed and added `<Analytics />` to layout via Vercel's auto-integration

### Light/Dark Mode
- **`ThemeToggle` component** (`components/ThemeToggle.tsx`): Sun/moon icon button in navbar, persists preference to `localStorage`
- **Light mode is default** — dark applied only if user previously selected it
- **No-flash script**: `next/script` with `strategy="beforeInteractive"` reads `localStorage` before React hydrates
- **`suppressHydrationWarning`** on `<html>` to suppress server/client `data-theme` mismatch
- **Light theme CSS**: Full `[data-theme="light"]` block appended to `globals.css` overriding both `:root` and `@theme` (Tailwind) variables — zero existing CSS lines changed

### Email Waitlist
- **`waitlist` Supabase table**: `id`, `email` (unique), `created_at` with RLS policy allowing public inserts
- **`POST /api/waitlist`** (`app/api/waitlist/route.ts`): Validates email, inserts to Supabase via service role key, returns 409 on duplicate
- **Submit page wired up** (`app/submit/page.tsx`): Converted to client component with email input state, loading/success/error states, posts to `/api/waitlist`

### Sitemap Fix
- **Paginated words query** (`app/sitemap.ts`): Replaced single `.select()` with batched while loop using `.range()` — now fetches all 2,030 words instead of first 1,000
- **`revalidate = 86400`**: Sitemap now revalidates every 24h instead of never

### Favicon
- Replaced default Next.js favicon with custom book+exclamation icon (`app/icon.png`)
- Auto-trimmed whitespace using alpha channel bounding box, resized to 512×512

### Other
- Support email updated from `hello@` to `support@sweardictionary.com` in `/submit` and `/about`
- Deployed to Vercel with env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Build
- Clean `npm run build` — zero TypeScript errors, 1,043 pages generated

---

## v1.1.0 — SEO Enhancements, Article Sidebar & Hreflang (2026-03-28)

### og:image — Social Sharing Image
- Generated branded 1200x630 default OG image (`public/og-default.png`) using sharp — dark background, "sweardictionary" logo, tagline
- Added `og:image` to root layout metadata (inherited by all pages)
- Explicit `og:image` on homepage, word pages, and blog articles
- Blog articles use `cover_image_url` if available, fall back to default
- Upgraded all pages from `twitter:card: summary` to `summary_large_image`

### FAQ Schema
- **Word pages** (`app/language/[slug]/[word-slug]/page.tsx`): Added FAQPage JSON-LD with up to 3 dynamic questions — "What does [word] mean?", "How do you pronounce [word]?" (if IPA exists), "What is the English equivalent?" (if equivalent exists)
- **Blog articles** (`app/blog/[slug]/page.tsx`): Added FAQPage JSON-LD extracted from H3 headings — each heading becomes a question, answered by the first paragraph after it (stripped of markdown, max 300 chars). Category-aware prefixes: "How profane is..." (movie-tv), "How does..." (celebrity), "What is..." (linguistic). Min 2 H3s required, max 8 questions.

### Article SEO Keywords
- Auto-extract H3 headings from article content as additional keywords
- Combined with manual `tags` array (deduplicated) for `<meta name="keywords">`, `og:article:tag`, and JSON-LD `keywords`
- Visible tags on article pages capped at 4; all keywords remain in meta tags

### Article Table of Contents Sidebar
- **`ArticleTOC` component** (`app/blog/[slug]/ArticleTOC.tsx`): Client component with sticky sidebar showing H2/H3 headings
- Active section highlighting via IntersectionObserver as user scrolls
- Smooth scroll on click, H3s indented as sub-items
- Article page restructured to two-column grid layout (content + TOC)
- Headings in rendered HTML get auto-generated `id` attributes for anchor links
- Hidden on screens under 900px for clean mobile reading

### Hreflang Tags
- **`lib/hreflang.ts`**: Locale mapping for all 31 languages (fallback)
- **Dynamic from database**: Uses `iso_code` from Supabase `languages` table as primary source, falls back to hardcoded map, then `"en"`
- Added `alternates.languages` to language pages, word pages, and `/languages` index
- New languages with `iso_code` set in Supabase get correct hreflang automatically — zero code changes needed

### Build
- Clean `npm run build` — zero TypeScript errors, 2,079 pages generated (including 4 blog articles)

---

## v1.0.0 — Unicode Slug Fix, Mobile Menu, Blog Infrastructure (2026-03-27)

### Unicode Slug Fix
- **Root cause**: `upload_seeds.py` preserved non-Latin Unicode in slugs (e.g. Arabic, Cyrillic, Thai) while Vercel ISR fails to serve non-ASCII dynamic route params
- **Migration script** (`data/fix_unicode_slugs.py`): Converted 561 non-ASCII slugs to ASCII transliterations in Supabase with collision detection
- **Fixed `upload_seeds.py`**: `slugify()` now normalizes NFD, strips combining marks, and replaces non-ASCII with hyphens — matching `seed.mjs` behavior
- **Paginated `getAllWordSlugs()`**: Fixed Supabase 1000-row default limit with `.range()` batching — build now generates all 2,074 word pages (was 1,044)

### View Tracking Fix
- **`track-view` API**: Fixed to use `supabaseAdmin` (service role key) to bypass RLS for view count increments
- **Diverse fallback**: Added `getDiverseFeaturedWords(n)` query — picks one high-severity word per top-N language as trending fallback when all views are 0

### Mobile Menu
- **`MobileMenu` component** (`components/MobileMenu.tsx`): Hamburger/X toggle, full-screen overlay, closes on route change, body scroll lock
- **Active page indicator**: Orange dot + italic text for current page in both mobile and desktop nav
- **Non-sticky mobile navbar**: Header uses `position: relative` on mobile, `sticky` only on desktop (768px+)

### Desktop Nav Refresh
- **`NavLinks` component** (`components/NavLinks.tsx`): Client component with `usePathname()` for active state
- **Restyled**: Instrument Serif font, orange dot indicator below active link

### Light Mode Fix
- **Dropdown backgrounds**: Fixed invisible select dropdowns in light mode — `background` shorthand was wiping `background-image` (SVG arrow). Changed to `background-color`.

### Blog Infrastructure
- **Database**: `articles` table SQL migration (`supabase/create_articles.sql`) with title, slug, excerpt, content (markdown), category, published_at, views, RLS policies, indexes
- **Types**: `Article` interface and `ARTICLE_CATEGORIES` constant in `types/index.ts`
- **Queries** (5 new in `lib/queries.ts`): `getPublishedArticles`, `getArticleBySlug`, `getArticlesByCategory`, `getAllArticleSlugs`, `getLatestArticles`
- **Blog index** (`app/blog/page.tsx`): Server component with SEO metadata, ISR 1h
- **BlogGrid** (`app/blog/BlogGrid.tsx`): Client component with category filter pills, empty state
- **Article page** (`app/blog/[slug]/page.tsx`): Markdown rendering via `marked`, JSON-LD Article schema, breadcrumb, `generateStaticParams`, `generateMetadata`, view tracking
- **ArticleViewTracker** (`app/blog/[slug]/ArticleViewTracker.tsx`): Client component, reuses track-view API with `articleId`
- **`track-view` API extended**: Handles both `wordId` and `articleId` parameters
- **Integrated**: Blog link in navbar, mobile menu, footer, homepage ("Latest from the Blog" section), sitemap
- **Styled**: Full blog page CSS, article prose styling with heading anchors, code blocks, blockquotes, tables

### Build
- Clean `npm run build` — zero TypeScript errors, 2,075 pages generated
- Blog pages compile and render correctly (articles table gracefully returns empty until SQL migration is run)

### Manual Steps Required
- Run `supabase/create_articles.sql` in Supabase SQL editor to create the articles table
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables (needed for view tracking and waitlist)

---

## Current State — Honest Assessment

### What's Built and Working

| Route | File | Meta | StaticParams | JSON-LD | Canonical | Revalidate |
|-------|------|------|-------------|---------|-----------|------------|
| `/` | `app/page.tsx` | Yes | No | Yes | Yes | 1h |
| `/words` | `app/words/page.tsx` | Yes | No | No | Yes | 1h |
| `/languages` | `app/languages/page.tsx` | Yes | No | No | Yes | 1h |
| `/language/[slug]` | `app/language/[slug]/page.tsx` | Yes | Yes | Yes | Yes | 1h |
| `/language/[slug]/[word-slug]` | `app/language/[slug]/[word-slug]/page.tsx` | Yes | Yes | Yes | Yes | 1h |
| `/search?q=` | `app/search/page.tsx` | Yes | No | No | Dynamic | — |
| `/about` | `app/about/page.tsx` | Yes | No | No | Yes | — |
| `/submit` | `app/submit/page.tsx` | Yes | No | No | Yes | — |
| `/api/track-view` | `app/api/track-view/route.ts` | N/A | N/A | N/A | N/A | — |
| `/api/waitlist` | `app/api/waitlist/route.ts` | N/A | N/A | N/A | N/A | — |
| `/blog` | `app/blog/page.tsx` | Yes | No | No | Yes | 1h |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Yes | Yes | Yes | Yes | 1h |
| `/sitemap.xml` | `app/sitemap.ts` | N/A | N/A | N/A | N/A | 24h |
| `/robots.txt` | `app/robots.ts` | N/A | N/A | N/A | N/A | — |

### Data

- **31 languages** with **2,030 words** in Supabase
- Average: 65.5 words/language
- Lowest: English (26), Farsi (26), Vietnamese (27)
- Highest: Turkish (223), Bosnian (100), Dutch (90)
- All languages have flag emojis in DB
- All words have: severity (1-5), categories (from 6 valid options), meaning, cultural context, IPA pronunciation, slugs

### Components (8 total)

| Component | File | Lines |
|-----------|------|-------|
| Navbar | `components/Navbar.tsx` | ~35 |
| ThemeToggle | `components/ThemeToggle.tsx` | ~50 |
| PostHogProvider | `components/PostHogProvider.tsx` | ~20 |
| LanguageGrid | `app/languages/LanguageGrid.tsx` | ~200 |
| WordFilters | `app/language/[slug]/WordFilters.tsx` | ~300 |
| WordsGrid | `app/words/WordsGrid.tsx` | ~430 |
| PronounceButton | `app/language/[slug]/[word-slug]/PronounceButton.tsx` | ~90 |
| ViewTracker | `app/language/[slug]/[word-slug]/ViewTracker.tsx` | 15 |
| MobileMenu | `components/MobileMenu.tsx` | ~77 |
| NavLinks | `components/NavLinks.tsx` | ~40 |
| BlogGrid | `app/blog/BlogGrid.tsx` | ~80 |
| ArticleViewTracker | `app/blog/[slug]/ArticleViewTracker.tsx` | ~15 |

### Queries (17 functions in `lib/queries.ts`)

`getLanguages`, `getTrendingWords`, `getDiverseFeaturedWords`, `getWordsByLanguage`, `getTotalWordCount`, `getLanguageBySlug`, `getAllWordsByLanguage`, `getAllLanguageSlugs`, `getWordBySlug`, `getRelatedWords`, `searchWords`, `getAllWords`, `getAllWordSlugs`, `getPublishedArticles`, `getArticleBySlug`, `getArticlesByCategory`, `getAllArticleSlugs`, `getLatestArticles`

---

## Phase 1 Checklist

| Task | Status | Notes |
|------|--------|-------|
| Next.js project setup with Tailwind + Supabase | Done | Next.js 16, Tailwind v4, Supabase client in `lib/supabase.ts` |
| Database schema and seed script | Done | Schema in Supabase, seed JSONs in `data/seeds/`, upload script in `data/upload_seeds.py` |
| Homepage | Done | Redesigned with hero, search, quick links, WotD, severity scale, trending, mission |
| Language page with filters | Done | Severity pills, category checkboxes, search bar, 18-per-page pagination |
| Word detail page with pronunciation | Done | IPA display + Web Speech API button, severity bar, cultural context, examples, related words |
| Search | Done | Server-side ilike search, grouped by language, severity badges |
| SEO: sitemap, meta tags, structured data | Done | Sitemap (2,065 URLs), robots.txt, meta tags on all pages, JSON-LD on all key pages, canonical URLs everywhere |
| Deploy to Vercel | Done | Live at sweardictionary.com, env vars set, PostHog + Vercel Analytics running |

---

## Known Issues

1. ~~**Homepage missing `generateMetadata`**~~ — Fixed in v0.5.0
2. ~~**FLAG_MAP hardcoded in 4 files**~~ — Removed in v0.5.0, uses DB `flag_emoji` everywhere
3. ~~**No JSON-LD on language pages**~~ — Added DefinedTermSet + BreadcrumbList in v0.5.0
4. ~~**No canonical URLs**~~ — Added to all pages in v0.5.0
5. ~~**Submit page is a placeholder**~~ — Email waitlist wired up in v0.9.0
6. ~~**`next.config.ts` is empty**~~ — Configured with security headers in v0.5.0
7. **Audio pronunciation** — Web Speech API works for most languages; no pre-generated audio files
8. **Robots disallows `/api/`** — but ViewTracker calls `/api/track-view` from client (works fine, crawlers just won't index it)
9. **Low word counts for some languages** — English (26), Farsi (26), Vietnamese (27) need more content
10. **No error logging** — `error.tsx` catches but doesn't report errors anywhere
11. ~~**Duplicate word slugs in DB**~~ — Fixed by unicode slug migration in v1.0.0 (0 duplicates remaining)

---

## What's Next (Priority Order)

1. ~~**Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel env**~~ — Done, added to Vercel env vars
2. **Google AdSense setup** — add ad script, ensure content passes review
3. **Expand low-count languages** — target 50+ words for English, Farsi, Vietnamese
4. **Fix duplicate word slugs in DB** — ~49 duplicates causing build warnings
5. **Phase 2: Community submissions** — auth, moderation queue, upvotes

---

## Phase 2 Readiness

**Database schema**: Mostly ready. The `words` table already has `submitted_by` (FK to auth.users, nullable) and `is_published` (boolean for moderation queue). What's needed:

- **Supabase Auth** not configured yet — no auth provider, no sign-up/login flow
- **No moderation queue UI** — `is_published` exists but no admin page to review submissions
- **No RLS for user writes** — current RLS is read-only public, service-role writes. Need policies for authenticated user inserts
- **No upvote/downvote table** — would need a new `votes` table with user_id + word_id
- **No verification badges** — no concept of "verified native speaker" in schema yet

Estimated effort: Medium. Schema foundation is there, but auth + moderation UI + RLS policies need building.
