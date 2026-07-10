-- =============================================================================
-- Fortune Coastal Group — full schema for self-hosted Supabase
-- Idempotent: safe to re-run. Paste into Supabase SQL Editor and Run.
-- =============================================================================

-- ---------- Extensions ------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------- Enums (idempotent) ----------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin','seller','buyer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.listing_status as enum ('draft','pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.seller_application_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

-- ---------- Shared trigger fn -----------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- =============================================================================
-- Tables
-- =============================================================================

-- ---------- profiles --------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ---------- user_roles ------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- Security-definer role check
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- ---------- categories ------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;

-- ---------- listings --------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  category_slug text not null,
  title text not null,
  subtitle text,
  description text,
  location text,
  country text,
  city text,
  price_usd numeric not null,
  price_btc numeric,
  accepts_btc boolean not null default true,
  cover_image text,
  status public.listing_status not null default 'draft',
  featured boolean not null default false,
  verified boolean not null default false,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.listings to anon;
grant select, insert, update, delete on public.listings to authenticated;
grant all on public.listings to service_role;
alter table public.listings enable row level security;

drop trigger if exists tr_listings_updated on public.listings;
create trigger tr_listings_updated before update on public.listings
  for each row execute function public.update_updated_at_column();

-- ---------- listing_images --------------------------------------------------
create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.listing_images to anon, authenticated;
grant all on public.listing_images to service_role;
alter table public.listing_images enable row level security;

-- ---------- seller_applications ---------------------------------------------
create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text,
  website text,
  about text,
  status public.seller_application_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.seller_applications to authenticated;
grant all on public.seller_applications to service_role;
alter table public.seller_applications enable row level security;

drop trigger if exists tr_seller_apps_updated on public.seller_applications;
create trigger tr_seller_apps_updated before update on public.seller_applications
  for each row execute function public.update_updated_at_column();

-- ---------- inquiries -------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  seller_response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.inquiries to authenticated;
grant all on public.inquiries to service_role;
alter table public.inquiries enable row level security;

drop trigger if exists tr_inquiries_updated on public.inquiries;
create trigger tr_inquiries_updated before update on public.inquiries
  for each row execute function public.update_updated_at_column();

-- ---------- homepage_content (singleton) ------------------------------------
create table if not exists public.homepage_content (
  id int primary key default 1,
  hero_eyebrow text not null default 'Fortune Coastal Group',
  hero_title text not null default 'The Future of Luxury Asset Ownership',
  hero_subtitle text not null default 'Buy and sell luxury real estate, vehicles, yachts, jets, and exclusive experiences with USD or Bitcoin.',
  primary_cta_label text not null default 'Explore Marketplace',
  primary_cta_href text not null default '/marketplace',
  secondary_cta_label text not null default 'Become a Seller',
  secondary_cta_href text not null default '/seller',
  featured_listing_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint homepage_singleton check (id = 1)
);
grant select on public.homepage_content to anon, authenticated;
grant all on public.homepage_content to service_role;
alter table public.homepage_content enable row level security;

-- =============================================================================
-- Row-Level Security policies (drop-and-recreate for idempotency)
-- =============================================================================

-- profiles
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- user_roles
drop policy if exists "user_roles read own" on public.user_roles;
create policy "user_roles read own" on public.user_roles for select to authenticated using (auth.uid() = user_id);

-- categories
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select to anon, authenticated using (true);

-- listings
drop policy if exists "listings public read approved" on public.listings;
create policy "listings public read approved" on public.listings for select to anon, authenticated using (status = 'approved');
drop policy if exists "listings seller read own" on public.listings;
create policy "listings seller read own" on public.listings for select to authenticated using (auth.uid() = seller_id);
drop policy if exists "listings seller insert" on public.listings;
create policy "listings seller insert" on public.listings for insert to authenticated with check (auth.uid() = seller_id and public.has_role(auth.uid(),'seller'));
drop policy if exists "listings seller update own" on public.listings;
create policy "listings seller update own" on public.listings for update to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id and status in ('draft','pending'));
drop policy if exists "listings seller delete own" on public.listings;
create policy "listings seller delete own" on public.listings for delete to authenticated using (auth.uid() = seller_id and public.has_role(auth.uid(),'seller'));

-- listing_images
drop policy if exists "li public read approved" on public.listing_images;
create policy "li public read approved" on public.listing_images for select to anon, authenticated using (exists (select 1 from public.listings l where l.id = listing_images.listing_id and l.status = 'approved'));
drop policy if exists "li seller manage own" on public.listing_images;
create policy "li seller manage own" on public.listing_images for all to authenticated using (exists (select 1 from public.listings l where l.id = listing_images.listing_id and l.seller_id = auth.uid())) with check (exists (select 1 from public.listings l where l.id = listing_images.listing_id and l.seller_id = auth.uid()));

-- seller_applications
drop policy if exists "sa read own" on public.seller_applications;
create policy "sa read own" on public.seller_applications for select to authenticated using (auth.uid() = user_id);
drop policy if exists "sa insert own" on public.seller_applications;
create policy "sa insert own" on public.seller_applications for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "sa update own pending" on public.seller_applications;
create policy "sa update own pending" on public.seller_applications for update to authenticated using (auth.uid() = user_id and status = 'pending') with check (auth.uid() = user_id and status = 'pending');

-- inquiries
drop policy if exists "inq buyer insert" on public.inquiries;
create policy "inq buyer insert" on public.inquiries for insert to authenticated with check (auth.uid() = buyer_id);
drop policy if exists "inq buyer read own" on public.inquiries;
create policy "inq buyer read own" on public.inquiries for select to authenticated using (auth.uid() = buyer_id);
drop policy if exists "inq seller read own" on public.inquiries;
create policy "inq seller read own" on public.inquiries for select to authenticated using (auth.uid() = seller_id);
drop policy if exists "inq seller respond" on public.inquiries;
create policy "inq seller respond" on public.inquiries for update to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

-- homepage_content
drop policy if exists "homepage public read" on public.homepage_content;
create policy "homepage public read" on public.homepage_content for select to anon, authenticated using (true);

-- NOTE: Admin write access is done via the SERVICE ROLE KEY from server code
-- (see src/lib/admin-gate.functions.ts). Admin is a shared password, not a
-- Supabase user, so no `admin` RLS policies are needed.

-- =============================================================================
-- Auth trigger: auto-create profile + default 'buyer' role on signup
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'buyer')
  on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Storage bucket for listing media
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('listing-media', 'listing-media', false)
on conflict (id) do nothing;

drop policy if exists "listing-media seller upload" on storage.objects;
create policy "listing-media seller upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-media' and public.has_role(auth.uid(),'seller'));
drop policy if exists "listing-media public read" on storage.objects;
create policy "listing-media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'listing-media');
drop policy if exists "listing-media owner update" on storage.objects;
create policy "listing-media owner update" on storage.objects for update to authenticated
  using (bucket_id = 'listing-media' and owner = auth.uid());
drop policy if exists "listing-media owner delete" on storage.objects;
create policy "listing-media owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'listing-media' and owner = auth.uid());

-- =============================================================================
-- Seed data
-- =============================================================================

insert into public.categories (slug, name, sort_order) values
  ('real-estate', 'Real Estate', 1),
  ('cars',        'Cars',        2),
  ('yachts',      'Yachts',      3),
  ('jets',        'Private Jets',4),
  ('concierge',   'Concierge',   5)
on conflict (slug) do nothing;

insert into public.homepage_content (id) values (1)
on conflict (id) do nothing;

-- Demo listings (the 17 curated FCG assets) are attached to a real seller
-- account, so they are not embedded in this SQL. After signing up your first
-- user, open /admin, unlock with ADMIN_PASSWORD, and click "Seed Demo Listings"
-- in the Demo Data panel — this attaches the demo listings to that user.
