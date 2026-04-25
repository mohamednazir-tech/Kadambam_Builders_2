-- SIMPLE GUIDE RLS FIX
-- Run this in Supabase SQL Editor to fix the 401 Unauthorized error

-- Step 1: Remove ALL existing policies on guide_content
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'guide_content'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON guide_content', policy_record.policyname);
    END LOOP;
END $$;

-- Step 2: Verify all policies are removed
SELECT 'All existing policies removed...' as status;
SELECT COUNT(*) as remaining_policies FROM pg_policies WHERE tablename = 'guide_content';

-- Step 3: Create fresh policies for anon role
CREATE POLICY "Allow anonymous read access" ON guide_content
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access" ON guide_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON guide_content
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access" ON guide_content
  FOR DELETE
  TO anon
  USING (true);

-- Step 4: Verify policies are created
SELECT 'New policies created...' as status;
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'guide_content'
ORDER BY policyname;

-- Step 5: Test read access
SELECT 'Testing read access...' as status;
SELECT COUNT(*) as guide_count FROM guide_content;

-- Step 6: Test write access (update)
SELECT 'Testing update access...' as status;
UPDATE guide_content 
SET updated_at = NOW() 
WHERE id = 'guide-page';

SELECT 'Guide RLS fix completed successfully!' as result;
