-- SIMPLE TEST TO ISOLATE THE ISSUE
-- Run this in Supabase SQL Editor

-- First, see what's in the messages table
SELECT 
  id,
  name,
  phone,
  status,
  deleted_at,
  created_at
FROM messages 
ORDER BY created_at DESC;

-- Check if the table structure is correct
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;

-- Test a simple SELECT by ID (replace with actual ID from above)
SELECT * FROM messages WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Test a simple UPDATE
UPDATE messages 
SET status = 'read' 
WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Check if it worked
SELECT status FROM messages WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';

-- Test a simple DELETE (soft delete)
UPDATE messages 
SET deleted_at = NOW() 
WHERE id = '56e2784e-02a4-4e6b-acad-1f39e8405d18';
