-- FIX GUIDE CONTENT RLS POLICIES
-- Run this in Supabase SQL Editor to fix security issues

-- Drop existing unsafe policies
DROP POLICY IF EXISTS "Allow public read guide" ON guide_content;
DROP POLICY IF EXISTS "Allow public insert guide" ON guide_content;
DROP POLICY IF EXISTS "Allow public update guide" ON guide_content;

-- Create proper secure RLS policies (same as Edit Contact)
-- Public can read (for website visitors)
CREATE POLICY "Public can read guide" ON guide_content
  FOR SELECT
  TO anon
  USING (true);

-- Only authenticated users can insert (for admin panel)
CREATE POLICY "Authenticated can insert guide" ON guide_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update (for admin panel)
CREATE POLICY "Authenticated can update guide" ON guide_content
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Verify policies are created correctly
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'guide_content'
ORDER BY policyname;

-- Test the upsert operation (should work for authenticated users)
SELECT 'Testing secure upsert operation...' as status;

-- This should work now (only for authenticated users)
INSERT INTO guide_content (id, title, hero_description, cost_basic, cost_premium, sample_calculation, materials, legal_docs, legal_regs, timeline)
VALUES (
  'guide-page',
  'Test Title',
  'Test Description',
  'Test Basic Cost',
  'Test Premium Cost',
  'Test Calculation',
  'Test Materials',
  'Test Legal Docs',
  'Test Legal Regs',
  'Test Timeline'
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

-- Verify the test worked
SELECT * FROM guide_content WHERE id = 'guide-page';

-- Restore default content if needed
UPDATE guide_content SET
  title = 'Building Construction in Tirunelveli: Complete Cost Guide 2026',
  hero_description = 'Everything you need to know about building a home in Tirunelveli - from costs and materials to construction timeline and legal requirements.',
  cost_basic = '₹1,600 - ₹1,900/sq.ft',
  cost_premium = '₹2,200 - ₹3,000/sq.ft',
  sample_calculation = 'Construction Cost (₹1,750/sq.ft): ₹21,00,000\nGovernment Approvals & Fees: ₹1,50,000\nInterior Finishes: ₹3,00,000\nTotal Estimated Cost: ₹25,50,000',
  materials = 'Foundation:\n• M20 Grade Concrete\n• Fe500 Steel Bars\n• Waterproof Chemicals\n• Country Bricks (Local)\n\nWalls & Roof:\n• Solid Concrete Blocks\n• Weather-resistant Paint\n• Clay Roof Tiles\n• Heat Insulation\n\nFinishing:\n• Ceramic Tiles\n• Wooden Windows\n• Marine Plywood\n• Anti-corrosive Fittings',
  legal_docs = '• Parent Document / Sale Deed\n• Encumbrance Certificate\n• Patta and Chitta\n• Approved Building Plan\n• Commencement Certificate\n• Completion Certificate',
  legal_regs = '• FSI/FAR rules as per DTCP\n• Setback requirements\n• Height restrictions\n• Rainwater harvesting mandatory\n• Septic tank norms\n• Tree plantation requirements',
  timeline = '1-2 Months: Planning & Approvals\n2-3 Months: Foundation & Structure\n2-3 Months: Finishing Work\n1 Month: Inspection & Handover\n\nTotal: 6-9 Months (For a standard 2BHK house - 1200 sq.ft)'
WHERE id = 'guide-page';

SELECT 'Guide RLS policies fixed successfully!' as status;
