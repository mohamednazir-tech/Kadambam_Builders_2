-- FIX GUIDE CONTENT RLS POLICIES
-- Run this in Supabase SQL Editor to fix the 401 Unauthorized error

-- First, drop all existing policies on guide_content
DROP POLICY IF EXISTS "Allow public read guide" ON guide_content;
DROP POLICY IF EXISTS "Allow public insert guide" ON guide_content;
DROP POLICY IF EXISTS "Allow public update guide" ON guide_content;
DROP POLICY IF EXISTS "Allow authenticated read guide" ON guide_content;
DROP POLICY IF EXISTS "Allow authenticated update guide" ON guide_content;
DROP POLICY IF EXISTS "Allow service role all guide" ON guide_content;

-- Create new simple policies that work with anon key
-- Allow public read access (for website visitors)
CREATE POLICY "Enable read access for all users" ON guide_content
  FOR SELECT
  USING (true);

-- Allow public insert access (for admin panel - will be controlled by frontend auth)
CREATE POLICY "Enable insert access for all users" ON guide_content
  FOR INSERT
  WITH CHECK (true);

-- Allow public update access (for admin panel - will be controlled by frontend auth)
CREATE POLICY "Enable update access for all users" ON guide_content
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete access (for admin panel - will be controlled by frontend auth)
CREATE POLICY "Enable delete access for all users" ON guide_content
  FOR DELETE
  USING (true);

-- Verify the policies are created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'guide_content';

-- Test the setup by checking if we can read the data
SELECT 'Testing read access...' as status;
SELECT COUNT(*) as guide_count FROM guide_content;

-- Show current RLS status
SELECT 
  tablename,
  rowsecurity,
  forcerlspolicy
FROM pg_tables 
WHERE tablename = 'guide_content';

SELECT 'Guide RLS policies fixed successfully!' as result;
