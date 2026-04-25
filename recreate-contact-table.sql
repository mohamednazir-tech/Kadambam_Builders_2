-- RECREATE CONTACT TABLE - Fresh Start
-- Run this to completely recreate the table without constraints

-- Step 1: Drop the entire table and start fresh
DROP TABLE IF EXISTS contact_content CASCADE;

-- Step 2: Create the table with proper structure (no NOT NULL on camelCase columns)
CREATE TABLE contact_content (
  id TEXT PRIMARY KEY DEFAULT 'contact-page',
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  map_embed TEXT,           -- snake_case, nullable
  form_title TEXT,          -- snake_case, nullable
  "mapEmbed" TEXT,          -- camelCase, nullable
  "formTitle" TEXT,         -- camelCase, nullable
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable RLS
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple RLS policy
CREATE POLICY "Enable all operations for contact" ON contact_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 5: Insert default data with all column formats
INSERT INTO contact_content (
  id, address, phone, email, map_embed, form_title, "mapEmbed", "formTitle"
)
VALUES (
  'contact-page',
  'Shop No 1, 132A, 1st Street, Rahmath Nagar,
Near Sadak Abdullah College, Tirunelveli',
  '+91 63740 34451',
  'info@kadambambuilders.com',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed',
  'Send us a message',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en=17&output=embed',
  'Send us a message'
);

-- Step 6: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_content_updated_at 
    BEFORE UPDATE ON contact_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contact_updated_at();

-- Step 7: Verify everything
SELECT 'Table structure:' as info;
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

SELECT 'Contact table recreated successfully!' as status;
