-- RCA BLK Studio / CMS tables (run in Supabase SQL editor)
--
-- Storage: the Studio upload API (`/api/studio/upload`) writes to bucket `media`.
-- The block below creates that bucket if missing and allows public reads so
-- `getPublicUrl()` URLs work on the public site. (You can instead create the
-- bucket manually: Dashboard → Storage → New bucket → name `media` → Public.)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Storage bucket `media` (public read; uploads use service role from API)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media objects" on storage.objects;
create policy "Public read media objects"
on storage.objects for select
using (bucket_id = 'media');

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  venue text not null default '',
  date text not null default '',
  image text not null default '',
  body text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Announcement',
  date text not null default '',
  image text not null default '',
  gallery jsonb,
  body jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.news_articles enable row level security;

drop policy if exists "events_select_public" on public.events;
create policy "events_select_public" on public.events for select using (true);

drop policy if exists "news_select_public" on public.news_articles;
create policy "news_select_public" on public.news_articles for select using (true);

-- Writes use the service role key from server-side API routes (bypasses RLS).

create index if not exists events_sort_idx on public.events (sort_order, slug);
create index if not exists news_sort_idx on public.news_articles (sort_order, slug);

-- Public / Studio lists order by `updated_at` (most recently saved first).
create index if not exists events_updated_at_list_idx on public.events (updated_at desc);
create index if not exists news_articles_updated_at_list_idx on public.news_articles (updated_at desc);

-- Editable marketing copy (e.g. Support page paragraphs)
create table if not exists public.site_pages (
  slug text primary key,
  title text not null default '',
  paragraphs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_pages enable row level security;

drop policy if exists "site_pages_select_public" on public.site_pages;
create policy "site_pages_select_public" on public.site_pages for select using (true);

create index if not exists site_pages_slug_idx on public.site_pages (slug);
