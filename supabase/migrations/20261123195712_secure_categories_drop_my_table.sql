-- Applied to the bakedCRM project on 2026-11-23.
-- `categories` had Row Level Security off, so anyone with the public anon key
-- could read or change it. Turn RLS on with the same pattern as the other
-- tables: anyone may read, only staff may write.
alter table public.categories enable row level security;
create policy "public read" on public.categories for select using (true);
create policy "admin write" on public.categories for all using (is_staff()) with check (is_staff());

-- Empty test table, also exposed without RLS. Nothing references it.
drop table public.my_table;
