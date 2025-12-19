-- Fix Row-Level Security policies for 'pig' storage bucket
-- Run this in Supabase SQL Editor

-- 1. Allow public read access to all files in 'pig' bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'pig');

-- 2. Allow authenticated and anonymous users to upload to 'pig' bucket
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pig');

-- 3. Allow authenticated and anonymous users to update files in 'pig' bucket
CREATE POLICY "Allow Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pig');

-- 4. Allow authenticated and anonymous users to delete files in 'pig' bucket
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'pig');

-- Note: If you want to restrict uploads to only authenticated users, change the INSERT policy to:
-- CREATE POLICY "Allow Authenticated Upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'pig' AND auth.role() = 'authenticated');
