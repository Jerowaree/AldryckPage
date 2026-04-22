-- Run this script in Supabase SQL Editor
-- It creates categories/photos and a public storage bucket for gallery images.

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (3
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  description text,
  image_path text not null unique,
  image_url text not null,
  is_published boolean not null default false,
  shot_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  project text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_photos_category on public.photos(category_id);
create index if not exists idx_photos_published on public.photos(is_published);
create index if not exists idx_photos_shot_at on public.photos(shot_at desc);
create index if not exists idx_contact_leads_created_at on public.contact_leads(created_at desc);

alter table public.categories enable row level security;
alter table public.photos enable row level security;
alter table public.contact_leads enable row level security;

-- Public users can read published content only.
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Public read published photos" on public.photos;
create policy "Public read published photos"
on public.photos for select
to anon, authenticated
using (is_published = true);

-- Authenticated users can manage portfolio content.
drop policy if exists "Authenticated manage categories" on public.categories;
create policy "Authenticated manage categories"
on public.categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated manage photos" on public.photos;
create policy "Authenticated manage photos"
on public.photos for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated manage contact leads" on public.contact_leads;
create policy "Authenticated manage contact leads"
on public.contact_leads for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read portfolio objects" on storage.objects;
create policy "Public read portfolio objects"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Authenticated upload portfolio objects" on storage.objects;
create policy "Authenticated upload portfolio objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated update portfolio objects" on storage.objects;
create policy "Authenticated update portfolio objects"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated delete portfolio objects" on storage.objects;
create policy "Authenticated delete portfolio objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio');

insert into public.categories (slug, name)
values
  ('futbol', 'Futbol'),
  ('basket', 'Basket'),
  ('atletismo', 'Atletismo'),
  ('combate', 'Combate')
on conflict (slug) do nothing;
