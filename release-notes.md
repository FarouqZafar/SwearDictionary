# SwearDictionary — Release Notes

---

## v0.1.0 — Database Foundation (2026-03-25)

### 🗄️ Database Schema
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

### 🌱 Seed Data
- Built idempotent seed script (`supabase/seed.mjs`) that reads JSON files and upserts into Supabase
- Successfully seeded **375 words across 5 languages**:

| Language | Words |
|----------|-------|
| Arabic   | 35    |
| English  | 26    |
| Farsi    | 26    |
| German   | 65    |
| Turkish  | 223   |

### 📁 Project Setup
- Initialized `package.json` with `@supabase/supabase-js` dependency
- Created `.env.example` with required Supabase credentials
- Created `.gitignore` to protect secrets and common build artifacts

### 📋 Files Added
- `supabase/schema.sql` — full database schema
- `supabase/seed.mjs` — seed script
- `package.json` — project manifest
- `.env.example` — env template
- `.gitignore` — git ignore rules

---

## Next Up — v0.2.0 (Planned)
- [ ] Next.js 15 project setup with Tailwind + TypeScript
- [ ] Homepage with search, language grid, trending words
- [ ] Language page with filters
- [ ] Word detail page with pronunciation
- [ ] SEO: sitemap, meta tags, structured data
