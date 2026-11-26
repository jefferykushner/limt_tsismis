-- Applied to bakedCRM on 2026-11-23.
-- Messages for the scrolling ticker under the nav. brand_id null = both brands.
-- Optional start/end dates let a holiday or promo message switch itself on and off.
create table if not exists public.site_messages (
  id uuid primary key default gen_random_uuid(),
  brand_id text references public.brands(id),
  message text not null,
  link_url text,
  is_active boolean not null default true,
  starts_on date,
  ends_on date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.site_messages enable row level security;
create policy "public reads live messages" on public.site_messages for select
  using (is_active and (starts_on is null or starts_on <= current_date) and (ends_on is null or ends_on >= current_date));
create policy "admin full access" on public.site_messages for all using (is_staff()) with check (is_staff());

insert into public.site_messages (brand_id, message, sort_order) values
  ('limt', 'Fudgy, crackly, still a little warm. Brownies are our love language.', 10),
  ('limt', 'Real strawberries. Real butter. Real happy.', 20),
  ('limt', 'Got a favourite we don’t make yet? Tell us. We love a challenge.', 30),
  ('limt', 'Small batches, big feelings.', 40),
  ('limt', 'Life is short. Eat the corner piece.', 50),
  ('tsismis', 'Psst… you didn’t hear this from me.', 10),
  ('tsismis', 'A little bird told me you might be hungry.', 20),
  ('tsismis', 'So good, it’s worth the whisper.', 30),
  ('tsismis', 'Tell your friends. (After you finish.)', 40),
  ('tsismis', 'We can’t keep a secret this sweet.', 50),
  ('tsismis', 'Bonding over secrets, sweetened by us.', 60);
