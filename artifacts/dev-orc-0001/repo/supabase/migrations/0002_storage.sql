-- Storage bucket + policies for user uploads (private by default)
-- Idempotent inserts to buckets table
insert into storage.buckets (id, name, public)
values ('user-uploads', 'user-uploads', false)
on conflict (id) do nothing;

-- Basic owner-based policies on storage.objects for this bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow read own objects (user-uploads)'
  ) then
    create policy "Allow read own objects (user-uploads)"
      on storage.objects for select
      using (bucket_id = 'user-uploads' and (owner = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow insert own objects (user-uploads)'
  ) then
    create policy "Allow insert own objects (user-uploads)"
      on storage.objects for insert
      with check (bucket_id = 'user-uploads' and (owner = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow update own objects (user-uploads)'
  ) then
    create policy "Allow update own objects (user-uploads)"
      on storage.objects for update
      using (bucket_id = 'user-uploads' and (owner = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow delete own objects (user-uploads)'
  ) then
    create policy "Allow delete own objects (user-uploads)"
      on storage.objects for delete
      using (bucket_id = 'user-uploads' and (owner = auth.uid()));
  end if;
end
$$ language plpgsql;
