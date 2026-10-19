-- ============================================================
-- Word counters without Disk IO burn
-- ============================================================
-- Problem: every view/impression did `update words set views = views + 1`.
-- That rewrites the whole (wide, jsonb-heavy) words row, touches every index
-- on it (views is indexed, so no HOT updates), and bumps updated_at.
--
-- Fix: counters live in a tiny `word_stats` table. A pg_cron job copies them
-- back into words.views / words.impressions once an hour, so all existing
-- reads (get_trending_words, .order("views"), etc.) keep working unchanged.
--
-- Run this whole file once in the Supabase SQL editor. Safe to re-run.

-- 1. Small counters table ------------------------------------------------
create table if not exists public.word_stats (
  word_id     uuid primary key references public.words(id) on delete cascade,
  views       int not null default 0,
  impressions int not null default 0
) with (fillfactor = 70);  -- leave room on each page so updates stay HOT

alter table public.word_stats enable row level security;  -- no policies: server-only

insert into public.word_stats (word_id, views, impressions)
select id, coalesce(views, 0), coalesce(impressions, 0)
from public.words
on conflict (word_id) do nothing;


-- 2. Counter functions now write to word_stats ---------------------------
-- Same names + params as before, so the live site benefits immediately.
drop function if exists public.increment_views(uuid);
create function public.increment_views(word_id uuid)
returns void language sql security definer set search_path = public as $$
  insert into public.word_stats (word_id, views)
  select $1, 1 where exists (select 1 from public.words w where w.id = $1)
  on conflict (word_id) do update set views = word_stats.views + 1;
$$;

drop function if exists public.increment_word_views(uuid);
create function public.increment_word_views(word_id uuid)
returns void language sql security definer set search_path = public as $$
  select public.increment_views($1);
$$;

drop function if exists public.increment_impressions(uuid);
create function public.increment_impressions(word_id uuid)
returns void language sql security definer set search_path = public as $$
  insert into public.word_stats (word_id, impressions)
  select $1, 1 where exists (select 1 from public.words w where w.id = $1)
  on conflict (word_id) do update set impressions = word_stats.impressions + 1;
$$;

-- One call for a whole batch of cards (replaces up to 50 parallel calls).
create or replace function public.increment_impressions_batch(word_ids uuid[])
returns void language sql security definer set search_path = public as $$
  insert into public.word_stats (word_id, impressions)
  select w.id, 1 from public.words w where w.id = any($1)
  on conflict (word_id) do update set impressions = word_stats.impressions + 1;
$$;

-- Only the server (service role) may bump counters.
revoke execute on function public.increment_views(uuid)              from public, anon, authenticated;
revoke execute on function public.increment_word_views(uuid)         from public, anon, authenticated;
revoke execute on function public.increment_impressions(uuid)        from public, anon, authenticated;
revoke execute on function public.increment_impressions_batch(uuid[]) from public, anon, authenticated;
grant  execute on function public.increment_views(uuid)              to service_role;
grant  execute on function public.increment_word_views(uuid)         to service_role;
grant  execute on function public.increment_impressions(uuid)        to service_role;
grant  execute on function public.increment_impressions_batch(uuid[]) to service_role;


-- 3. Counter changes no longer bump updated_at --------------------------
-- updated_at should mean "content changed" (it feeds sitemap lastModified).
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  if (to_jsonb(new) - 'views' - 'impressions' - 'updated_at')
     is distinct from
     (to_jsonb(old) - 'views' - 'impressions' - 'updated_at') then
    new.updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;


-- 4. Hourly sync word_stats -> words ------------------------------------
-- Rewrites each changed word at most once per hour instead of once per hit.
create or replace function public.sync_word_stats()
returns void language sql security definer set search_path = public as $$
  update public.words w
  set views = s.views, impressions = s.impressions
  from public.word_stats s
  where s.word_id = w.id
    and (w.views, w.impressions) is distinct from (s.views, s.impressions);
$$;
revoke execute on function public.sync_word_stats() from public, anon, authenticated;

create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('sync-word-stats', '7 * * * *', $$select public.sync_word_stats()$$);

select public.sync_word_stats();
