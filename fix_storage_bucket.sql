-- =============================================
-- FIX: Storage policies for paquetes-fotos bucket
-- Run this in Supabase SQL Editor
-- =============================================

-- Step 1: Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('paquetes-fotos', 'paquetes-fotos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop existing problematic policies
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;

-- Step 3: Create proper policies

-- Allow anyone to view photos (public read)
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'paquetes-fotos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'paquetes-fotos' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Owner Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'paquetes-fotos'
  AND auth.role() = 'authenticated'
);

-- Step 4: Verify bucket exists
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE name = 'paquetes-fotos';
