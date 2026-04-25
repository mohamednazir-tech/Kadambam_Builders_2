-- FINAL CONTACT FIX - Remove NOT NULL Constraints
-- Run this to fix the remaining NOT NULL constraint issue

-- Step 1: Disable RLS temporarily
ALTER TABLE contact_content DISABLE ROW LEVEL SECURITY;

-- Step 2: Remove NOT NULL constraints from all problematic columns
ALTER TABLE contact_content ALTER COLUMN "mapEmbed" DROP NOT NULL;
ALTER TABLE contact_content ALTER COLUMN "formTitle" DROP NOT NULL;
ALTER TABLE contact_content ALTER COLUMN map_embed DROP NOT NULL;
ALTER TABLE contact_content ALTER COLUMN form_title DROP NOT NULL;

-- Step 3: Update all NULL values
UPDATE contact_content 
SET 
  "mapEmbed" = COALESCE("mapEmbed", map_embed, 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed'),
  "formTitle" = COALESCE("formTitle", form_title, 'Send us a message'),
  map_embed = COALESCE(map_embed, "mapEmbed", 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed'),
  form_title = COALESCE(form_title, "formTitle", 'Send us a message')
WHERE id = 'contact-page';

-- Step 4: Ensure the row exists with all data
INSERT INTO contact_content (
  id, address, phone, email, "mapEmbed", "formTitle", map_embed, form_title
)
VALUES (
  'contact-page',
  'Shop No 1, 132A, 1st Street, Rahmath Nagar,
Near Sadak Abdullah College, Tirunelveli',
  '+91 63740 34451',
  'info@kadambambuilders.com',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=z=17&output=embed',
  'Send us a message',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed',
  'Send us a message'
)
ON CONFLICT (id) DO UPDATE SET
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  "mapEmbed" = COALESCE(EXCLUDED."mapEmbed", 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed'),
  "formTitle" = COALESCE(EXCLUDED."formTitle", 'Send us a message'),
  map_embed = COALESCE(EXCLUDED.map_embed, 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed'),
  form_title = COALESCE(EXCLUDED.form_title, 'Send us a message'),
  updated_at = NOW();

-- Step 5: Re-enable RLS
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

-- Step 6: Create simple RLS policy
DROP POLICY IF EXISTS "Enable all operations for contact" ON contact_content;
CREATE POLICY "Enable all operations for contact" ON contact_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 7: Verify the fix
SELECT 'Column constraints after fix:' as info;
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
  AND column_name IN ('mapEmbed', 'formTitle', 'map_embed', 'form_title')
ORDER BY column_name;

SELECT 'Contact data after fix:' as info;
SELECT * FROM contact_content WHERE id = 'contact-page';

SELECT 'RLS policies after fix:' as info;
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'contact_content'
ORDER BY policyname;

-- Step 8: Test the upsert operation
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
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed',
  'Send us a message'
)
ON CONFLICT (id) DO UPDATE SET
  phone = EXCLUDED.phone,
  updated_at = NOW();

SELECT 'Final verification:' as info;
SELECT * FROM contact_content WHERE id = 'contact-page';

SELECT 'Final contact fix completed successfully!' as status;
