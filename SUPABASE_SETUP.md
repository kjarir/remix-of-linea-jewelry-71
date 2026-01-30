# Supabase Setup Guide

This guide will help you set up Supabase for your Linea Jewelry e-commerce application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `linea-jewelry` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents and paste it into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Wait for all tables, policies, and functions to be created

## Step 5: Set Up Your Admin Account

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter your email and password
4. After creating the user, go to **Table Editor** → **profiles**
5. Find your user's profile row
6. Edit it and set `is_admin` to `true`
7. Save the changes

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` in your browser
3. Sign in with your admin credentials
4. You should be redirected to `/admin` dashboard

## Step 7: Upload Product Images (Optional)

You can upload product images to Supabase Storage:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `product-images`
3. Set it to **Public bucket**
4. Upload your images
5. Copy the public URL and use it when adding products in the admin dashboard

Alternatively, you can use images from your `public/categories/` folder by referencing them as `/categories/filename.jpg` in the admin dashboard.

## Database Schema Overview

The schema includes:

- **profiles**: User profiles with admin flag
- **categories**: Product categories (Carpets, Kurtis, Shawls)
- **products**: Product information
- **product_images**: Multiple images per product
- **orders**: Order records
- **order_items**: Individual items in orders

## Row Level Security (RLS)

All tables have RLS enabled:
- **Public read access** for active products and categories
- **Admin-only write access** for products and categories
- **User-specific access** for orders and profiles

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file has the correct values
- Make sure the file is named `.env.local` (not `.env`)
- Restart your dev server after changing environment variables

### "relation does not exist" error
- Make sure you ran the entire `schema.sql` file
- Check that all tables were created in the **Table Editor**

### Can't access admin dashboard
- Verify your user's `is_admin` flag is set to `true` in the `profiles` table
- Sign out and sign back in

### Images not loading
- Check that image URLs are correct
- For public folder images, use paths like `/categories/filename.jpg`
- For Supabase Storage, use the full public URL

## Next Steps

1. Add categories in the admin dashboard
2. Add products with multiple images
3. Test the product display on the homepage and category pages
4. Set up email authentication (optional) in Supabase Auth settings
