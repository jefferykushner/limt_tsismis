-- Applied to bakedCRM on 2026-11-23 (Phase 2).
-- One shared menu, tagged instead of split by brand
alter table public.products
  add column if not exists is_filipino boolean not null default false,
  add column if not exists is_placeholder boolean not null default false,
  add column if not exists featured_limt boolean not null default false,
  add column if not exists featured_tsismis boolean not null default false,
  add column if not exists archived_at timestamptz;

-- Internal notes move to a staff-only table (products is publicly readable)
create table if not exists public.product_notes (
  product_id uuid primary key references public.products(id) on delete cascade,
  internal_notes text,
  updated_at timestamptz not null default now()
);
alter table public.product_notes enable row level security;
create policy "admin full access" on public.product_notes for all using (is_staff()) with check (is_staff());
insert into public.product_notes (product_id, internal_notes)
  select id, internal_notes from public.products where coalesce(internal_notes, '') <> ''
  on conflict (product_id) do nothing;

-- Public may read only website-visible, non-archived items
drop policy if exists "public reads active products" on public.products;
create policy "public reads visible products" on public.products
  for select using (is_visible = true and archived_at is null);

-- Categories shared by both brands (brand_id null = both), with a Tsismis-voice subtitle
alter table public.categories alter column brand_id drop not null;
alter table public.categories add column if not exists subtitle_tsismis text;
create unique index if not exists categories_name_key on public.categories (name);
