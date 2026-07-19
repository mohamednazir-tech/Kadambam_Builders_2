-- CHECK CONTACT TABLE STRUCTURE
-- Run this first to see what columns actually exist

-- Describe the table structure
\d contact_content;

-- Or use this query to see column information
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing data
SELECT * FROM contact_content LIMIT 1;
