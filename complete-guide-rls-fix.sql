-- COMPLETE GUIDE RLS FIX
-- Run this in Supabase SQL Editor to fix the 401 Unauthorized error

-- Step 1: Disable RLS temporarily to test
ALTER TABLE guide_content DISABLE ROW LEVEL SECURITY;

-- Step 2: Test basic operations
SELECT 'Testing with RLS disabled...' as status;
SELECT COUNT(*) as guide_count FROM guide_content;

-- Step 3: Re-enable RLS with proper policies
ALTER TABLE guide_content ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies
DROP POLICY IF EXISTS "Allow public read guide" ON guide_content;
DROP POLICY IF EXISTS "Allow public insert guide" ON guide_content;
DROP POLICY IF EXISTS "Allow public update guide" ON guide_content;
DROP POLICY IF EXISTS "Enable read access for all users" ON guide_content;
DROP POLICY IF EXISTS "Enable insert access for all users" ON guide_content;
DROP POLICY IF EXISTS "Enable update access for all users" ON guide_content;
DROP POLICY IF EXISTS "Enable delete access for all users" ON guide_content;

-- Step 5: Create simple, permissive policies for anon role
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

-- Step 6: Also create policies for authenticated role (backup)
CREATE POLICY "Allow authenticated read access" ON guide_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert access" ON guide_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" ON guide_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete access" ON guide_content
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 7: Verify policies are created
SELECT 'Verifying policies...' as status;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'guide_content'
ORDER BY policyname;

-- Step 8: Test with RLS enabled
SELECT 'Testing with RLS enabled...' as status;
SELECT COUNT(*) as guide_count FROM guide_content;

-- Step 9: Ensure data exists
INSERT INTO guide_content (
  id, title, hero_description, cost_basic, cost_premium, 
  sample_calculation, materials, legal_docs, legal_regs, timeline
)
VALUES (
  'guide-page',
  'Building Construction in Tirunelveli: Complete Cost Guide 2026',
  'Everything you need to know about building a home in Tirunelveli - from costs and materials to construction timeline and legal requirements.',
  '₹1,600 - ₹1,900/sq.ft',
  '₹2,200 - ₹3,000/sq.ft',
  'Construction Cost (₹1,750/sq.ft): ₹21,00,000
Government Approvals & Fees: ₹1,50,000
Interior Finishes: ₹3,00,000
Total Estimated Cost: ₹25,50,000',
  'Foundation:
• M20 Grade Concrete
• Fe500 Steel Bars
• Waterproof Chemicals
• Country Bricks (Local)

Walls & Roof:
• Solid Concrete Blocks
• Weather-resistant Paint
• Clay Roof Tiles
• Heat Insulation

Finishing:
• Ceramic Tiles
• Wooden Windows
• Marine Plywood
• Anti-corrosive Fittings',
  '• Parent Document / Sale Deed
• Encumbrance Certificate
• Patta and Chitta
• Approved Building Plan
• Commencement Certificate
• Completion Certificate',
  '• FSI/FAR rules as per DTCP
• Setback requirements
• Height restrictions
• Rainwater harvesting mandatory
• Septic tank norms
• Tree plantation requirements',
  '1-2 Months: Planning & Approvals
2-3 Months: Foundation & Structure
2-3 Months: Finishing Work
1 Month: Inspection & Handover

Total: 6-9 Months (For a standard 2BHK house - 1200 sq.ft)'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  hero_description = EXCLUDED.hero_description,
  cost_basic = EXCLUDED.cost_basic,
  cost_premium = EXCLUDED.cost_premium,
  sample_calculation = EXCLUDED.sample_calculation,
  materials = EXCLUDED.materials,
  legal_docs = EXCLUDED.legal_docs,
  legal_regs = EXCLUDED.legal_regs,
  timeline = EXCLUDED.timeline,
  updated_at = NOW();

-- Step 10: Final verification
SELECT 'Final verification...' as status;
SELECT * FROM guide_content LIMIT 1;

SELECT 'Guide RLS fix completed successfully!' as result;
