-- ============================================
-- Fix Categories Table - Add All Missing Columns
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Add all missing columns if they don't exist
DO $$
BEGIN
  -- Add image_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN image_url text;
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN is_active boolean not null default true;
  END IF;

  -- Add display_order column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'display_order'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN display_order integer default 0;
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN description text;
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN created_at timestamptz default now();
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN updated_at timestamptz default now();
  END IF;
END $$;

-- Verify all columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'categories'
ORDER BY ordinal_position;
