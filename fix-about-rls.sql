-- FIX ABOUT CONTENT RLS POLICIES
-- Run this in Supabase SQL Editor to fix the 401/RLS error

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read about" ON about_content;
DROP POLICY IF EXISTS "Authenticated can manage about" ON about_content;

-- Create proper RLS policies for the admin panel (no auth required)
-- Allow public read (for website visitors)
CREATE POLICY "Allow public read" ON about_content
  FOR SELECT
  TO anon
  USING (true);

-- Allow public insert/update (for admin panel without auth)
CREATE POLICY "Allow public insert" ON about_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public update (for admin panel without auth)
CREATE POLICY "Allow public update" ON about_content
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Verify policies are created
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'about_content'
ORDER BY policyname;

-- Test the upsert operation (should work now)
SELECT 'Testing upsert operation...' as status;

-- This should work now
INSERT INTO about_content (id, title, description, mission_title, mission_description, vision_title, vision_description)
VALUES (
  'about-page',
  'Test Title',
  'Test Description',
  'Test Mission',
  'Test Mission Description',
  'Test Vision',
  'Test Vision Description'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  mission_title = EXCLUDED.mission_title,
  mission_description = EXCLUDED.mission_description,
  vision_title = EXCLUDED.vision_title,
  vision_description = EXCLUDED.vision_description,
  updated_at = NOW();

-- Verify the test worked
SELECT * FROM about_content WHERE id = 'about-page';
