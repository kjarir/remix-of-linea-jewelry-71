-- ============================================
-- Fix Profiles Table Structure
-- ============================================
-- Run this SQL FIRST to ensure the table has all required columns
-- ============================================

-- Step 1: Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add full_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name text;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at timestamptz default now();
  END IF;
END $$;

-- Step 2: Now create profiles for existing auth users
INSERT INTO public.profiles (id, email, full_name, is_admin)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', NULL),
  false
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 3: Set yourself as admin (update email if needed)
UPDATE public.profiles
SET is_admin = true
WHERE email = 'kjarir23@gmail.com';

-- Step 4: Verify the fix
SELECT 
  au.id,
  au.email as auth_email,
  p.id as profile_id,
  p.email as profile_email,
  p.full_name,
  p.is_admin,
  p.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
