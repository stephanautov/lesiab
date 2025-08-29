-- path: supabase/migrations/00000000000001_posts_rls.sql
-- Enable RLS and allow public (anon + authenticated) SELECT
alter table if exists public.posts enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'public read posts'
  ) then
    create policy "public read posts"
      on public.posts
      for select
      using (true);
  end if;
end $$;

-- Allow INSERTs only from authenticated users (create form)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'auth can insert posts'
  ) then
    create policy "auth can insert posts"
      on public.posts
      for insert
      with check (auth.uid() is not null);
  end if;
end $$;
