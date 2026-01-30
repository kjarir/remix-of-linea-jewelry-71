-- ============================================
-- Supabase Database Schema for Linea Jewelry
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Extends Supabase auth.users with admin flag
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  display_order integer default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price_cents integer not null,
  compare_at_price_cents integer,
  sku text unique,
  category_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  stock_quantity integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 4. PRODUCT IMAGES TABLE
-- ============================================
-- Supports multiple images per product
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer default 0,
  is_primary boolean not null default false,
  created_at timestamptz default now()
);

-- ============================================
-- 5. ORDERS TABLE (for analytics)
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  total_cents integer not null,
  status text not null default 'pending',
  shipping_address jsonb,
  billing_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 6. ORDER ITEMS TABLE
-- ============================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  price_cents integer not null,
  created_at timestamptz default now()
);

-- ============================================
-- 7. FAVORITES TABLE
-- ============================================
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to tables
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer;

-- PROFILES POLICIES
create policy "Users can view own profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles
  for update
  using (id = auth.uid());

create policy "Admins can view all profiles"
  on public.profiles
  for select
  using (public.is_admin());

-- CATEGORIES POLICIES
create policy "Anyone can read active categories"
  on public.categories
  for select
  using (is_active = true);

create policy "Admins can read all categories"
  on public.categories
  for select
  using (public.is_admin());

create policy "Only admins can modify categories"
  on public.categories
  for all
  using (public.is_admin());

-- PRODUCTS POLICIES
create policy "Anyone can read active products"
  on public.products
  for select
  using (is_active = true);

create policy "Admins can read all products"
  on public.products
  for select
  using (public.is_admin());

create policy "Only admins can modify products"
  on public.products
  for all
  using (public.is_admin());

-- PRODUCT IMAGES POLICIES
create policy "Anyone can read product images"
  on public.product_images
  for select
  using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
      and products.is_active = true
    )
  );

create policy "Admins can manage product images"
  on public.product_images
  for all
  using (public.is_admin());

-- ORDERS POLICIES
create policy "Users can view own orders"
  on public.orders
  for select
  using (user_id = auth.uid());

create policy "Admins can view all orders"
  on public.orders
  for select
  using (public.is_admin());

create policy "Users can create orders"
  on public.orders
  for insert
  with check (user_id = auth.uid());

-- ORDER ITEMS POLICIES
create policy "Users can view own order items"
  on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items
  for select
  using (public.is_admin());

-- FAVORITES POLICIES
create policy "Users can view own favorites"
  on public.favorites
  for select
  using (user_id = auth.uid());

create policy "Users can add own favorites"
  on public.favorites
  for insert
  with check (user_id = auth.uid());

create policy "Users can delete own favorites"
  on public.favorites
  for delete
  using (user_id = auth.uid());

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_is_primary on public.product_images(is_primary);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_is_active on public.categories(is_active);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_product_id on public.favorites(product_id);

-- ============================================
-- FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- This function automatically creates a profile when a user signs up
-- IMPORTANT: is_admin is ALWAYS false - admin must be set manually
create or replace function public.handle_new_user()
returns trigger 
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert profile for new user
  -- is_admin is ALWAYS false - admin status is set manually by you
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    false  -- NEVER true - admin is set manually in database
  )
  on conflict (id) do update
  set 
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name);
  
  return new;
exception
  when others then
    -- Log error but don't fail user creation
    raise warning 'Error creating profile for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Trigger to create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- FIX: Create profiles for existing auth users
-- ============================================
-- This ensures any users created before the trigger was set up get profiles
-- All users get is_admin = false - you must set admin manually
insert into public.profiles (id, email, full_name, is_admin)
select 
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'full_name', null),
  false  -- Always false - admin is set manually
from auth.users au
left join public.profiles p on au.id = p.id
where p.id is null
on conflict (id) do nothing;

-- ============================================
-- SEED DATA (Optional - for initial setup)
-- ============================================
-- Insert default categories
insert into public.categories (name, slug, description, display_order) values
  ('Carpets', 'carpets', 'Handwoven Kashmiri carpets in silk and wool', 1),
  ('Kurtis', 'kurtis', 'Traditional and contemporary Kurtis', 2),
  ('Shawls', 'shawls', 'Luxury Pashmina and Sozni shawls', 3)
on conflict (slug) do nothing;
