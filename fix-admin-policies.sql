-- FIX ADMIN POLICIES FOR MARK AS READ AND DELETE
-- Run this in Supabase SQL Editor

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read" ON messages;
DROP POLICY IF EXISTS "Allow public insert" ON messages;
DROP POLICY IF EXISTS "Allow authenticated update" ON messages;
DROP POLICY IF EXISTS "Allow authenticated delete" ON messages;
DROP POLICY IF EXISTS "Allow public update" ON messages;
DROP POLICY IF EXISTS "Allow public delete" ON messages;

-- Create simple working policies

-- 1. Allow anyone to insert messages (contact form)
CREATE POLICY "Allow public insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Allow anyone to read messages (for admin panel)
CREATE POLICY "Allow public read" ON messages
  FOR SELECT
  TO anon
  USING (true);

-- 3. Allow anyone to update messages (for mark as read)
CREATE POLICY "Allow public update" ON messages
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 4. Allow anyone to delete messages (for admin panel)
CREATE POLICY "Allow public delete" ON messages
  FOR DELETE
  TO anon
  USING (true);

-- Verify policies are created
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY policyname;

-- Test the policies (optional)
-- INSERT INTO messages (name, phone, message) VALUES ('Test', '1234567890', 'Test message');
-- UPDATE messages SET status = 'read' WHERE name = 'Test';
-- DELETE FROM messages WHERE name = 'Test';
