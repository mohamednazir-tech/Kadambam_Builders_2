-- SECURE ROW LEVEL SECURITY POLICIES
-- Replace the existing policies with these secure ones

-- First, drop existing policies
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON messages;

-- Create secure policies

-- 1. Allow anyone (public) to insert messages (contact form)
CREATE POLICY "Allow public insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Only authenticated users can read messages
CREATE POLICY "Allow authenticated read" ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Only authenticated users can update messages (mark as read)
CREATE POLICY "Allow authenticated update" ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Only authenticated users can delete messages
CREATE POLICY "Allow authenticated delete" ON messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Create admin users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own admin profile
CREATE POLICY "Users can view own admin profile" ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy to allow users to insert their own admin profile
CREATE POLICY "Users can insert own admin profile" ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  );
END;
$$;
