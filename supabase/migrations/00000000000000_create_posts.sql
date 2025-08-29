-- path: supabase/migrations/00000000000000_create_posts.sql
-- Deterministic filename; rename if desired.
create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamptz not null default now()
);

-- Seed a couple rows so the UI isn't empty:
insert into public.posts (title, content) values
  ('Hello LESiAB', 'First post seeded by migration'),
  ('Second post', 'More content here')
on conflict do nothing;
