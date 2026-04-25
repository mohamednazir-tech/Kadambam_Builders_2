-- CREATE GUIDE CONTENT TABLE
-- Run this in Supabase SQL Editor

-- Create the guide_content table with single row design
CREATE TABLE IF NOT EXISTS guide_content (
  id TEXT PRIMARY KEY DEFAULT 'guide-page',  -- Fixed ID for single row
  title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  cost_basic TEXT NOT NULL,
  cost_premium TEXT NOT NULL,
  sample_calculation TEXT NOT NULL,
  materials TEXT NOT NULL,
  legal_docs TEXT NOT NULL,
  legal_regs TEXT NOT NULL,
  timeline TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE guide_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read (for website visitors)
CREATE POLICY "Allow public read guide" ON guide_content
  FOR SELECT
  TO anon
  USING (true);

-- Allow public insert (for admin panel)
CREATE POLICY "Allow public insert guide" ON guide_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public update (for admin panel)
CREATE POLICY "Allow public update guide" ON guide_content
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add single row constraint
ALTER TABLE guide_content 
ADD CONSTRAINT single_guide_row 
CHECK (id = 'guide-page');

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_guide_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guide_content_updated_at 
    BEFORE UPDATE ON guide_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_guide_updated_at();

-- Insert default content
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
ON CONFLICT (id) DO NOTHING;

-- Verify setup
SELECT 'Guide table created successfully' as status;
SELECT * FROM guide_content LIMIT 1;
