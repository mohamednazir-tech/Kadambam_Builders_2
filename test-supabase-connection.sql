-- TEST SUPABASE CONNECTION AND GUIDE TABLE
-- Run this in Supabase SQL Editor to debug the issue

-- 1. Check if table exists
SELECT 'Checking if guide_content table exists...' as status;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'guide_content';

-- 2. Check table structure
SELECT 'Checking table structure...' as status;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'guide_content'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 'Checking RLS status...' as status;
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'guide_content';

-- 4. Check existing policies
SELECT 'Checking existing policies...' as status;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'guide_content';

-- 5. Check if data exists
SELECT 'Checking existing data...' as status;
SELECT COUNT(*) as row_count FROM guide_content;

-- 6. Try to read data (this should work)
SELECT 'Testing read access...' as status;
SELECT * FROM guide_content LIMIT 1;

-- 7. Check current user
SELECT 'Current user context...' as status;
SELECT current_user as user, session_user as session_user;

-- 8. Check if anon role exists
SELECT 'Checking anon role...' as status;
SELECT rolname FROM pg_roles WHERE rolname = 'anon';

-- 9. Check if authenticated role exists
SELECT 'Checking authenticated role...' as status;
SELECT rolname FROM pg_roles WHERE rolname = 'authenticated';

SELECT 'Connection test completed!' as result;
