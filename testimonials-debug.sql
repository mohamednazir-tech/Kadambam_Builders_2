-- TESTIMONIALS DEBUG & FIX
-- Run this in Supabase SQL Editor to debug and fix testimonials display issue

-- Step 1: Check current testimonials data
SELECT '=== CURRENT TESTIMONIALS DATA ===' as status;
SELECT 
  id, 
  name, 
  LEFT(text, 50) as preview,
  rating, 
  status, 
  created_at
FROM testimonials 
ORDER BY created_at DESC;

-- Step 2: Check RLS status
SELECT '=== RLS STATUS ===' as status;
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'testimonials';

-- Step 3: Check existing policies
SELECT '=== EXISTING POLICIES ===' as status;
SELECT 
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'testimonials'
ORDER BY policyname;

-- Step 4: Test anonymous read access (simulate public website)
SELECT '=== TESTING ANONYMOUS READ ACCESS ===' as status;
-- This simulates what the public website sees
SELECT COUNT(*) as approved_testimonials_count 
FROM testimonials 
WHERE status = 'approved';

-- Step 5: Drop all existing policies and recreate them
SELECT '=== DROPPING ALL POLICIES ===' as status;
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'testimonials'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON testimonials', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 6: Verify policies are dropped
SELECT '=== POLICIES DROPPED - VERIFY ===' as status;
SELECT COUNT(*) as remaining_policies FROM pg_policies WHERE tablename = 'testimonials';

-- Step 7: Create simple, permissive policies
SELECT '=== CREATING NEW POLICIES ===' as status;

-- Policy 1: Allow anonymous users to read approved testimonials
CREATE POLICY "Allow anonymous read approved testimonials" ON testimonials
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Policy 2: Allow anonymous users to insert testimonials (for review submission)
CREATE POLICY "Allow anonymous insert testimonials" ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- Policy 3: Allow authenticated users to read all testimonials (for admin)
CREATE POLICY "Allow authenticated read all testimonials" ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 4: Allow authenticated users to update testimonials (for admin)
CREATE POLICY "Allow authenticated update testimonials" ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Allow authenticated users to delete testimonials (for admin)
CREATE POLICY "Allow authenticated delete testimonials" ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 8: Verify new policies
SELECT '=== NEW POLICIES CREATED ===' as status;
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'testimonials'
ORDER BY policyname;

-- Step 9: Test anonymous read access again
SELECT '=== TESTING ANONYMOUS READ ACCESS AGAIN ===' as status;
SELECT COUNT(*) as approved_testimonials_count 
FROM testimonials 
WHERE status = 'approved';

-- Step 10: Show sample approved testimonials
SELECT '=== SAMPLE APPROVED TESTIMONIALS ===' as status;
SELECT 
  id, 
  name, 
  LEFT(text, 50) as preview,
  rating, 
  status, 
  created_at
FROM testimonials 
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 3;

-- Step 11: Final verification
SELECT '=== FINAL VERIFICATION ===' as status;
SELECT 
  'Testimonials table setup complete' as message,
  (SELECT COUNT(*) FROM testimonials WHERE status = 'approved') as approved_count,
  (SELECT COUNT(*) FROM testimonials WHERE status = 'pending') as pending_count,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'testimonials') as policy_count;
