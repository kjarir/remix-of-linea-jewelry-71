# Fix Database Mismatch - Auth Users vs Profiles

## Problem
You have users in `auth.users` but they don't have corresponding entries in `public.profiles` table.

## Quick Fix (Run This SQL in Supabase SQL Editor)

```sql
-- Fix: Create profiles for existing auth users that don't have profiles
INSERT INTO public.profiles (id, email, full_name, is_admin)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  false
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  p.id as profile_id,
  p.email as profile_email,
  p.is_admin,
  p.created_at as profile_created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

## What This Does

1. **Finds all auth users** without profiles
2. **Creates profiles** for them automatically
3. **Sets default values**: `is_admin = false`
4. **Verifies** all users now have profiles

## After Running the Fix

1. Refresh your Supabase Table Editor
2. You should now see your user in the `profiles` table
3. The app will automatically work correctly

## To Set Yourself as Admin

After the profile is created, update it:

```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'kjarir23@gmail.com';
```

## Prevention

The updated code now:
- ✅ Auto-creates profiles if missing when user logs in
- ✅ Has a robust trigger for new signups
- ✅ Handles edge cases gracefully

Run the SQL above and your database will be fixed!
