# Supabase Storage Setup for Image Uploads

## ✅ What's Been Set Up

1. **Storage Bucket**: `product-images` for storing product and category images
2. **File Upload Component**: Drag & drop or click to upload
3. **Multiple Images**: Products can have up to 10 images
4. **Single Image**: Categories can have 1 image
5. **Auto Cleanup**: Old images deleted when replaced

## 🚀 Setup Steps

### Step 1: Create Storage Bucket

Run this SQL in Supabase SQL Editor:

```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,  -- Public bucket so images can be accessed
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### Step 2: Verify Bucket Created

In Supabase Dashboard:
1. Go to **Storage**
2. You should see `product-images` bucket
3. It should be **Public**

### Step 3: Test Upload

1. Login to admin dashboard
2. Go to Products → Add Product
3. Click "Upload Images"
4. Select image files
5. Images will upload automatically
6. First image becomes primary

## 📋 Features

### Product Images
- ✅ Upload multiple images (up to 10)
- ✅ Drag & drop or click to upload
- ✅ First image is primary
- ✅ Reorder images
- ✅ Delete images
- ✅ Auto cleanup from storage

### Category Images
- ✅ Upload single image
- ✅ Replace existing image
- ✅ Delete image
- ✅ Auto cleanup

### Image Specifications
- **Formats**: JPG, PNG, WebP
- **Max Size**: 5MB per image
- **Storage**: Supabase Storage bucket
- **Access**: Public URLs

## 🎯 How It Works

1. **Upload**: Files uploaded to Supabase Storage
2. **URL**: Public URL generated automatically
3. **Database**: URL stored in `product_images` table
4. **Display**: Images shown using public URLs
5. **Delete**: Removes from both storage and database

## 🔒 Security

- ✅ Only authenticated users can upload
- ✅ File type validation (images only)
- ✅ File size limit (5MB)
- ✅ Public bucket for easy access
- ✅ RLS policies protect uploads

## 🛠️ Troubleshooting

### Images not uploading?
- Check bucket exists in Storage
- Verify policies are created
- Check browser console for errors

### Images not displaying?
- Verify bucket is public
- Check image URLs in database
- Verify CORS settings in Supabase

### Storage full?
- Delete old/unused images
- Consider upgrading Supabase plan
- Clean up orphaned files

## ✅ Production Ready

Everything is set up and ready for production use!
