-- TEST AND FIX DELETE OPERATION
-- Run this in Supabase SQL Editor

-- First, check what policies exist
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY policyname;

-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'messages';

-- Test a simple update (like mark as read)
UPDATE messages 
SET status = 'read' 
WHERE status = 'new';

-- Test a simple soft delete  
UPDATE messages 
SET deleted_at = NOW() 
WHERE deleted_at IS NULL AND status = 'read';

-- Check the results
SELECT 
  id,
  name,
  status,
  deleted_at,
  created_at
FROM messages 
ORDER BY created_at DESC;

-- If the above works, the policies are fine
-- If not, we need to recreate them:

-- Recreate all policies (if needed)
DROP POLICY IF EXISTS "Allow public insert" ON messages;
DROP POLICY IF EXISTS "Allow public read" ON messages;
DROP POLICY IF EXISTS "Allow public update" ON messages;
DROP POLICY IF EXISTS "Allow public delete" ON messages;

CREATE POLICY "Allow public insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public update" ON messages
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete" ON messages
  FOR DELETE
  TO anon
  USING (true);
