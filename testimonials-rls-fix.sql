-- TESTIMONIALS RLS FIX
-- Run this in Supabase SQL Editor to fix testimonials issues

-- Step 1: Check if testimonials table exists
SELECT 'Checking testimonials table...' as status;
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = 'testimonials'
) as table_exists;

-- Step 2: Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 3: Enable RLS on testimonials table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Remove ALL existing policies on testimonials
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
    END LOOP;
END $$;

-- Step 5: Verify all policies are removed
SELECT 'All existing policies removed...' as status;
SELECT COUNT(*) as remaining_policies FROM pg_policies WHERE tablename = 'testimonials';

-- Step 6: Create new RLS policies for testimonials

-- Allow anonymous users to insert testimonials (pending status)
CREATE POLICY "Allow anonymous insert testimonials" ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- Allow anonymous users to read approved testimonials only
CREATE POLICY "Allow anonymous read approved testimonials" ON testimonials
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Allow authenticated users to read all testimonials (for admin)
CREATE POLICY "Allow authenticated read all testimonials" ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update testimonials (for admin)
CREATE POLICY "Allow authenticated update testimonials" ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete testimonials (for admin)
CREATE POLICY "Allow authenticated delete testimonials" ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 7: Verify policies are created
SELECT 'New policies created...' as status;
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'testimonials'
ORDER BY policyname;

-- Step 8: Test read access for approved testimonials
SELECT 'Testing read access for approved testimonials...' as status;
SELECT COUNT(*) as approved_testimonials FROM testimonials WHERE status = 'approved';

-- Step 9: Check pending testimonials count
SELECT 'Checking pending testimonials...' as status;
SELECT COUNT(*) as pending_testimonials FROM testimonials WHERE status = 'pending';

-- Step 10: Show sample data if exists
SELECT 'Sample testimonials data...' as status;
SELECT id, name, LEFT(text, 50) as preview, rating, status, created_at 
FROM testimonials 
ORDER BY created_at DESC 
LIMIT 5;
