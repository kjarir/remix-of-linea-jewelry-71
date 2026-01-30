-- ============================================
-- Fix Products Table - Add Missing Columns
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add is_featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_featured boolean not null default false;
  END IF;

  -- Add stock_quantity column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE public.products ADD COLUMN stock_quantity integer default 0;
  END IF;

  -- Add short_description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'short_description'
  ) THEN
    ALTER TABLE public.products ADD COLUMN short_description text;
  END IF;
END $$;

-- Verify columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'products'
ORDER BY ordinal_position;
