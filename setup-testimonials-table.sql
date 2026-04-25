-- CREATE TESTIMONIALS TABLE
-- Run this in Supabase SQL Editor

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read (only approved testimonials)
CREATE POLICY "Anyone can read approved testimonials" ON testimonials
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Allow public insert (for review submission)
CREATE POLICY "Anyone can insert testimonials" ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow admin to manage testimonials
CREATE POLICY "Admin can manage testimonials" ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert initial approved testimonials
INSERT INTO testimonials (name, text, rating, status)
VALUES 
  ('Rajesh Kumar', 'Kadambam Builders constructed our dream home in Rahmath Nagar. The quality of work and timely delivery exceeded our expectations. Highly recommended!', 5, 'approved'),
  ('Priya Lakshmi', 'We hired them for our office renovation and were amazed by their professionalism. The team was courteous, transparent with pricing, and delivered excellent results.', 5, 'approved'),
  ('Suresh Babu', 'From plan approval to final handover, the entire process was smooth and hassle-free. Their attention to detail and use of quality materials is truly commendable.', 5, 'approved')
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Testimonials table created successfully' as status;
SELECT * FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC;
