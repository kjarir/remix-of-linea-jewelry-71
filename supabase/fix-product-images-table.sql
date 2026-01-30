-- ============================================
-- Create Product Images Table
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Create product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON public.product_images(display_order);

-- Enable Row Level Security
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_images
-- Allow anyone to view product images (public read)
CREATE POLICY "Public can view product images"
ON public.product_images
FOR SELECT
USING (true);

-- Allow authenticated users to insert product images
CREATE POLICY "Authenticated users can insert product images"
ON public.product_images
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update product images
CREATE POLICY "Authenticated users can update product images"
ON public.product_images
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
ON public.product_images
FOR DELETE
USING (auth.role() = 'authenticated');

-- Verify table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'product_images'
ORDER BY ordinal_position;
