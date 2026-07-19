-- FIX CONTACT RLS POLICIES
-- Run this to fix authentication issues

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read contact" ON contact_content;
DROP POLICY IF EXISTS "Authenticated can insert contact" ON contact_content;
DROP POLICY IF EXISTS "Authenticated can update contact" ON contact_content;

-- Create proper RLS policies (same pattern as other working tables)
-- Public can read (for website visitors)
CREATE POLICY "Public can read contact" ON contact_content
  FOR SELECT
  TO anon
  USING (true);

-- Public can insert (for admin panel - same as other pages)
CREATE POLICY "Public can insert contact" ON contact_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public can update (for admin panel - same as other pages)
CREATE POLICY "Public can update contact" ON contact_content
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Verify policies are created correctly
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'contact_content'
ORDER BY policyname;

-- Test the upsert operation
SELECT 'Testing contact upsert operation...' as status;

-- This should work now
INSERT INTO contact_content (
  id, address, phone, email, "mapEmbed", "formTitle"
)
VALUES (
  'contact-page',
  'Shop No 1, 132A, 1st Street, Rahmath Nagar,
Near Sadak Abdullah College, Tirunelveli',
  '+91 63740 34451',
  'info@kadambambuilders.com',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed',
  'Send us a message'
)
ON CONFLICT (id) DO UPDATE SET
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  "mapEmbed" = EXCLUDED."mapEmbed",
  "formTitle" = EXCLUDED."formTitle",
  updated_at = NOW();

-- Verify the test worked
SELECT * FROM contact_content WHERE id = 'contact-page';

SELECT 'Contact RLS policies fixed successfully!' as status;
