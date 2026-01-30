# Quick Fix - Run This SQL Now!

## The Problem
Your `profiles` table is missing the `full_name` column. This script will:
1. Add the missing column
2. Create your profile
3. Set you as admin

## Copy and Run This Entire SQL Block:

```sql
-- Step 1: Add missing columns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at timestamptz default now();
  END IF;
END $$;

-- Step 2: Create your profile
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

-- Step 3: Set yourself as admin
UPDATE public.profiles
SET is_admin = true
WHERE email = 'kjarir23@gmail.com';

-- Step 4: Verify (optional - just to check)
SELECT 
  au.email,
  p.email as profile_email,
  p.is_admin,
  p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id;
```

## After Running:
1. Refresh your Supabase Table Editor
2. You should see your user in the `profiles` table
3. The `is_admin` column should be `true`
4. Try logging in - everything should work!
