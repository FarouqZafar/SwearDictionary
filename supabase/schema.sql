-- ============================================================
-- SwearDictionary — Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 0. Extensions
-- ============================================================
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- trigram fuzzy search


-- 1. Languages
-- ============================================================
create table public.languages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,                        -- "Spanish"
  slug          text not null unique,                        -- "spanish"
  native_name   text,                                        -- "Español"
  iso_code      text unique,                                 -- "es" (ISO 639-1)
  flag_emoji    text,                                        -- "🇪🇸"
  word_count    int not null default 0,                      -- cached count
  description   text,                                        -- intro paragraph about swearing in this language
  cultural_notes text,                                       -- deeper cultural context from seed data
  created_at    timestamptz not null default now()
);

-- Fast lookup by slug (used in every URL)
create index idx_languages_slug on public.languages (slug);


-- 2. Words
-- ============================================================
create table public.words (
  id                    uuid primary key default gen_random_uuid(),
  language_id           uuid not null references public.languages(id) on delete cascade,
  word                  text not null,
  slug                  text not null,
  literal_translation   text,
  english_equivalent    text,
  severity              int not null check (severity between 1 and 5),  -- 1=mild … 5=nuclear
  categories            text[] default '{}',                             -- {insult,exclamation,body_part,sexual,religious,scatological}
  meaning               text,
  cultural_context      text,
  example_usage         text,                                            -- single example sentence (from seed data)
  example_sentences     jsonb default '[]',                              -- [{original, translation}]
  regional_variations   jsonb default '[]',                              -- [{region, severity, note}]
  ipa_pronunciation     text,
  audio_url             text,
  related_words         text[] default '{}',                             -- slugs of related words
  is_published          boolean not null default true,
  submitted_by          uuid,                                            -- FK → auth.users (nullable)
  views                 int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Composite unique: one word slug per language (used for URL routing)
create unique index idx_words_language_slug on public.words (language_id, slug);

-- Filtering by severity within a language
create index idx_words_language_severity on public.words (language_id, severity);

-- Full-text / trigram search on the word itself
create index idx_words_word_trgm on public.words using gin (word gin_trgm_ops);

-- Trending: most-viewed words
create index idx_words_views on public.words (views desc);


-- 3. Auto-update `updated_at` on words
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_words_updated_at
  before update on public.words
  for each row
  execute function public.handle_updated_at();


-- 4. Keep `languages.word_count` in sync
-- ============================================================
create or replace function public.update_language_word_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.languages set word_count = word_count + 1 where id = new.language_id;
  elsif tg_op = 'DELETE' then
    update public.languages set word_count = word_count - 1 where id = old.language_id;
  elsif tg_op = 'UPDATE' and old.language_id <> new.language_id then
    update public.languages set word_count = word_count - 1 where id = old.language_id;
    update public.languages set word_count = word_count + 1 where id = new.language_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trg_words_count
  after insert or update or delete on public.words
  for each row
  execute function public.update_language_word_count();


-- 5. Row Level Security (RLS)
-- ============================================================
alter table public.languages enable row level security;
alter table public.words     enable row level security;

-- Public read access (anyone can browse the dictionary)
create policy "Languages are publicly readable"
  on public.languages for select
  using (true);

create policy "Published words are publicly readable"
  on public.words for select
  using (is_published = true);

-- Only service_role (your seed script / admin) can insert/update/delete
-- Supabase service_role key bypasses RLS by default, so no extra policy needed.


-- 6. Increment view counter (RPC — call from Next.js)
-- ============================================================
create or replace function public.increment_word_views(word_id uuid)
returns void as $$
begin
  update public.words set views = views + 1 where id = word_id;
end;
$$ language plpgsql security definer;


-- 7. Sync word counts (called by seed script after bulk insert)
-- ============================================================
create or replace function public.sync_word_counts()
returns void as $$
begin
  update public.languages l
  set word_count = (
    select count(*) from public.words w where w.language_id = l.id
  );
end;
$$ language plpgsql security definer;


-- ============================================================
-- Done! Next steps:
--   1. Run this SQL in your Supabase dashboard → SQL Editor.
--   2. Grab your SUPABASE_URL and SUPABASE_ANON_KEY from
--      Settings → API and put them in your Next.js .env.local.
--   3. Run the seed script to populate this schema from your
--      JSON files in data/seeds/.
-- ============================================================
