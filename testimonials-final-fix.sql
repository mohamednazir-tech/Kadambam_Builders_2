-- TESTIMONIALS FINAL FIX
-- Run this in Supabase SQL Editor - EXACT FIX for RLS issue

-- Step 1: Check current status first
SELECT '=== CURRENT STATUS ===' as status;
SELECT 
  id, 
  name, 
  LEFT(text, 50) as preview,
  rating, 
  status, 
  created_at
FROM testimonials 
ORDER BY created_at DESC;

-- Step 2: Check what status values actually exist
SELECT '=== STATUS VALUES CHECK ===' as status;
SELECT DISTINCT status FROM testimonials;

-- Step 3: Enable RLS (if not already)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop ALL existing policies (clean slate)
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

-- Step 5: Create the ONE CRITICAL POLICY - Public can read approved testimonials
CREATE POLICY "Public can view approved testimonials"
ON testimonials
FOR SELECT
USING (status = 'approved');

-- Step 6: Allow public to submit testimonials (for review form)
CREATE POLICY "Public can submit testimonials"
ON testimonials
FOR INSERT
WITH CHECK (status = 'pending');

-- Step 7: Allow authenticated users to manage testimonials (for admin)
CREATE POLICY "Authenticated can manage testimonials"
ON testimonials
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 8: Verify policies
SELECT '=== POLICIES CREATED ===' as status;
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'testimonials'
ORDER BY policyname;

-- Step 9: Test the fix - simulate what public sees
SELECT '=== TEST PUBLIC ACCESS ===' as status;
SELECT COUNT(*) as public_can_see_count 
FROM testimonials 
WHERE status = 'approved';

-- Step 10: Show approved testimonials (what website should display)
SELECT '=== APPROVED TESTIMONIALS (WEBSITE VIEW) ===' as status;
SELECT 
  id, 
  name, 
  LEFT(text, 50) as preview,
  rating, 
  status, 
  created_at
FROM testimonials 
WHERE status = 'approved'
ORDER BY created_at DESC;
