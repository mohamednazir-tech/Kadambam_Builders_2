-- QUICK FIX FOR SUPABASE RLS POLICIES
-- Run this in your Supabase SQL editor

-- First, enable RLS on the messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public insert" ON messages;
DROP POLICY IF EXISTS "Allow authenticated read" ON messages;
DROP POLICY IF EXISTS "Allow authenticated update" ON messages;
DROP POLICY IF EXISTS "Allow authenticated delete" ON messages;
DROP POLICY IF EXISTS "Allow validated public insert" ON messages;
DROP POLICY IF EXISTS "Only admins can read messages" ON messages;
DROP POLICY IF EXISTS "Only admins can update messages" ON messages;
DROP POLICY IF EXISTS "Only admins can delete messages" ON messages;

-- Create simple policy for public inserts (contact form)
CREATE POLICY "Enable public insert for messages" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to read messages
CREATE POLICY "Enable read for authenticated users" ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for authenticated users to update messages
CREATE POLICY "Enable update for authenticated users" ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user if not exists
INSERT INTO admin_users (email, role) 
VALUES ('admin@kadambambuilders.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON admin_users TO authenticated;
GRANT SELECT ON admin_users TO anon;
