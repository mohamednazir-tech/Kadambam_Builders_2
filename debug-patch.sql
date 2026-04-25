-- DEBUG PATCH REQUEST ISSUES
-- Run this in Supabase SQL Editor

-- First, check if this specific message exists
SELECT * FROM messages WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Check all message IDs to see format
SELECT id, name, status FROM messages ORDER BY created_at DESC;

-- Test the exact same UPDATE that the frontend is trying to do
UPDATE messages 
SET status = 'read',
    updated_at = NOW()
WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Check if it worked
SELECT status, updated_at FROM messages WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Test the exact same DELETE that the frontend is trying to do
UPDATE messages 
SET deleted_at = NOW(),
    deleted_by = NULL,
    updated_at = NOW()
WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Check if it worked
SELECT deleted_at, deleted_by FROM messages WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Check RLS policies that might be blocking this
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY policyname;
