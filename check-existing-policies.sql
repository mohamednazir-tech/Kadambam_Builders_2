-- CHECK AND FIX EXISTING POLICIES
-- Run this to see what policies already exist

-- First, see what policies exist
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
WHERE tablename = 'messages'
ORDER BY policyname;

-- If policies exist but still getting 401, try this simple fix:

-- Drop and recreate simple policies
DROP POLICY IF EXISTS "Allow public read" ON messages;
DROP POLICY IF EXISTS "Allow public insert" ON messages;

-- Create simple working policies
CREATE POLICY "Allow public insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON messages
  FOR SELECT
  TO anon
  USING (true);

-- Verify the new policies
SELECT * FROM pg_policies WHERE tablename = 'messages';
