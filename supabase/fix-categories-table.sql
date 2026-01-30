-- ============================================
-- Fix Categories Table - Add Missing Column
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Add display_order column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categories'
    AND column_name = 'display_order'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN display_order integer default 0;
  END IF;
END $$;

-- Verify column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'categories'
ORDER BY ordinal_position;
