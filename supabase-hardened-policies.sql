-- HARDENED SECURITY POLICIES
-- This fixes the "any authenticated user = admin" vulnerability

-- Drop existing policies (replace with secure ones)
DROP POLICY IF EXISTS "Allow public insert" ON messages;
DROP POLICY IF EXISTS "Allow authenticated read" ON messages;
DROP POLICY IF EXISTS "Allow authenticated update" ON messages;
DROP POLICY IF EXISTS "Allow authenticated delete" ON messages;

-- SECURE POLICIES WITH ADMIN RESTRICTION

-- 1. Public users can insert messages (contact form) - with validation
CREATE POLICY "Allow validated public insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Basic validation at database level
    length(trim(name)) >= 2 AND
    length(trim(phone)) >= 10 AND
    length(trim(message)) >= 5 AND
    length(trim(message)) <= 500 AND
    -- Prevent obvious injection attempts
    position('<script>' in lower(message)) = 0 AND
    position('<script>' in lower(name)) = 0
  );

-- 2. ONLY ADMIN USERS can read messages
CREATE POLICY "Only admins can read messages" ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- 3. ONLY ADMIN USERS can update messages (mark as read)
CREATE POLICY "Only admins can update messages" ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- 4. ONLY ADMIN USERS can delete messages
CREATE POLICY "Only admins can delete messages" ON messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- ADMIN USERS TABLE RESTRICTIONS

-- Drop existing admin_users policies
DROP POLICY IF EXISTS "Users can view own admin profile" ON admin_users;
DROP POLICY IF EXISTS "Users can insert own admin profile" ON admin_users;

-- Only existing admins can create new admins (prevent self-signup)
CREATE POLICY "Only existing admins can create admins" ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Only admins can view admin list
CREATE POLICY "Only admins can view admin users" ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Create a super-admin function for initial setup
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Replace with your actual super admin email after first setup
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    JOIN admin_users ON auth.users.id = admin_users.id
    WHERE auth.users.email = 'your-admin-email@example.com'
    AND admin_users.role = 'admin'
  );
END;
$$;

-- Policy to allow super admin to manage admin users
CREATE POLICY "Super admin can manage admins" ON admin_users
  FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());
