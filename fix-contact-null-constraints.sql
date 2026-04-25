-- FIX CONTACT NULL CONSTRAINTS
-- Run this to fix NOT NULL constraint violations

-- First, let's see the actual table structure and constraints
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check which columns have NOT NULL constraints
SELECT 
  conname,
  contype,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'contact_content'::regclass 
  AND contype = 'c'
ORDER BY conname;

-- Update existing data to fill NULL columns
UPDATE contact_content 
SET 
  "mapEmbed" = COALESCE("mapEmbed", map_embed, 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed'),
  "formTitle" = COALESCE("formTitle", form_title, 'Send us a message'),
  map_embed = COALESCE(map_embed, "mapEmbed", 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed'),
  form_title = COALESCE(form_title, "formTitle", 'Send us a message')
WHERE id = 'contact-page';

-- Make columns nullable if they have NOT NULL constraints
ALTER TABLE contact_content ALTER COLUMN "mapEmbed" DROP NOT NULL;
ALTER TABLE contact_content ALTER COLUMN "formTitle" DROP NOT NULL;
ALTER TABLE contact_content ALTER COLUMN map_embed DROP NOT NULL;
ALTER TABLE contact_content ALTER COLUMN form_title DROP NOT NULL;

-- Now try the upsert operation again
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

-- Verify the result
SELECT * FROM contact_content WHERE id = 'contact-page';

-- Check final structure
SELECT 
  column_name,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND column_name IN ('mapEmbed', 'formTitle', 'map_embed', 'form_title')
ORDER BY column_name;

SELECT 'Contact NULL constraints fixed successfully!' as status;
