-- FIX RLS POLICIES FOR CONTACT FORM
-- Run this in Supabase SQL Editor

-- First, ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable public insert for messages" ON messages;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON messages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON messages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON messages;
DROP POLICY IF EXISTS "Allow public insert" ON messages;
DROP POLICY IF EXISTS "Allow read" ON messages;
DROP POLICY IF EXISTS "Allow authenticated read" ON messages;
DROP POLICY IF EXISTS "Allow authenticated update" ON messages;
DROP POLICY IF EXISTS "Allow authenticated delete" ON messages;

-- SIMPLE WORKING POLICIES

-- 1. Allow anyone to insert messages (contact form)
CREATE POLICY "Allow public insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Allow anyone to read messages (simple for now)
CREATE POLICY "Allow public read" ON messages
  FOR SELECT
  TO anon
  USING (true);

-- 3. Allow authenticated users to update messages
CREATE POLICY "Allow authenticated update" ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Allow authenticated users to delete messages
CREATE POLICY "Allow authenticated delete" ON messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify policies are created
SELECT * FROM pg_policies WHERE tablename = 'messages';

-- Test the policies (optional)
-- This should work after running the policies:
-- INSERT INTO messages (name, phone, message) VALUES ('Test', '1234567890', 'Test message');
