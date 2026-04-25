-- CHECK CONTACT TABLE STRUCTURE (Supabase Compatible)
-- Run this to see what columns actually exist

-- Check if table exists and get column information
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing data in the table
SELECT * FROM contact_content LIMIT 1;

-- Check table constraints
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public';

-- Check RLS policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'contact_content'
ORDER BY policyname;
