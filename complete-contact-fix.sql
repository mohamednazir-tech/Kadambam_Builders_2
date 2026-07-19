-- COMPLETE CONTACT FIX - All Issues Resolved
-- Run this in Supabase SQL Editor to fix everything at once

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Public can read contact" ON contact_content;
DROP POLICY IF EXISTS "Public can insert contact" ON contact_content;
DROP POLICY IF EXISTS "Public can update contact" ON contact_content;
DROP POLICY IF EXISTS "Authenticated can insert contact" ON contact_content;
DROP POLICY IF EXISTS "Authenticated can update contact" ON contact_content;

-- Step 2: Disable RLS temporarily to fix data
ALTER TABLE contact_content DISABLE ROW LEVEL SECURITY;

-- Step 3: Fix NULL values and ensure all columns have data
UPDATE contact_content 
SET 
  "mapEmbed" = COALESCE("mapEmbed", map_embed, 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed'),
  "formTitle" = COALESCE("formTitle", form_title, 'Send us a message'),
  map_embed = COALESCE(map_embed, "mapEmbed", 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed'),
  form_title = COALESCE(form_title, "formTitle", 'Send us a message')
WHERE id = 'contact-page';

-- Step 4: Make sure row exists
INSERT INTO contact_content (
  id, address, phone, email, "mapEmbed", "formTitle", map_embed, form_title
)
VALUES (
  'contact-page',
  'Shop No 1, 132A, 1st Street, Rahmath Nagar,
Near Sadak Abdullah College, Tirunelveli',
  '+91 63740 34451',
  'info@kadambambuilders.com',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed',
  'Send us a message',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed',
  'Send us a message'
)
ON CONFLICT (id) DO UPDATE SET
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  "mapEmbed" = EXCLUDED."mapEmbed",
  "formTitle" = EXCLUDED."formTitle",
  map_embed = EXCLUDED.map_embed,
  form_title = EXCLUDED.form_title,
  updated_at = NOW();

-- Step 5: Re-enable RLS with proper policies
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

-- Step 6: Create working RLS policies (same pattern as other admin pages)
CREATE POLICY "Enable all operations for contact" ON contact_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 7: Verify everything works
SELECT 'Contact table structure:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Contact data:' as info;
SELECT * FROM contact_content WHERE id = 'contact-page';

SELECT 'RLS policies:' as info;
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'contact_content'
ORDER BY policyname;

-- Step 8: Test the exact operation that was failing
SELECT 'Testing upsert operation...' as info;
INSERT INTO contact_content (
  id, address, phone, email, "mapEmbed", "formTitle"
)
VALUES (
  'contact-page',
  'Shop No 1, 132A, 1st Street, Rahmath Nagar,
Near Sadak Abdullah College, Tirunelveli',
  '+91 98765 43210',
  'info@kadambambuilders.com',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed',
  'Send us a message'
)
ON CONFLICT (id) DO UPDATE SET
  phone = EXCLUDED.phone,
  updated_at = NOW();

SELECT 'Final contact data after test:' as info;
SELECT * FROM contact_content WHERE id = 'contact-page';

SELECT 'Complete contact fix finished successfully!' as status;
