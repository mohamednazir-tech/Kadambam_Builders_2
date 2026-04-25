-- CRITICAL FIXES FOR ABOUT_CONTENT TABLE
-- Run this in Supabase SQL Editor to fix the issues

-- 1. Drop existing table to recreate properly
DROP TABLE IF EXISTS about_content CASCADE;

-- 2. Create table with FIXED ID (single row design)
CREATE TABLE about_content (
  id TEXT PRIMARY KEY DEFAULT 'about-page',  -- Fixed ID for single row
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_title TEXT NOT NULL,
  mission_description TEXT NOT NULL,
  vision_title TEXT NOT NULL,
  vision_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- 4. Create proper RLS policies
-- Public read policy
CREATE POLICY "Public can read about" ON about_content
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated write policy (all operations)
CREATE POLICY "Authenticated can manage about" ON about_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Add single row constraint (extra safety)
ALTER TABLE about_content 
ADD CONSTRAINT single_about_row 
CHECK (id = 'about-page');

-- 6. Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_about_content_updated_at 
    BEFORE UPDATE ON about_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert default content with fixed ID
INSERT INTO about_content (id, title, description, mission_title, mission_description, vision_title, vision_description)
VALUES (
  'about-page',
  'About Kadambam Builders',
  'Based in Tirunelveli, Kadambam Builders is a trusted name in construction, known for delivering high-quality residential and commercial projects. With years of expertise and a commitment to excellence, we turn your vision into reality — on time and within budget.',
  'Our Mission',
  'Deliver affordable and high-quality construction solutions that exceed expectations, ensuring every project is built with integrity and precision.',
  'Our Vision',
  'Become the most trusted and preferred builder in Tirunelveli, recognised for quality craftsmanship, transparency, and customer satisfaction.'
);

-- 8. Verify setup
SELECT 'Table created successfully' as status;
SELECT * FROM about_content;
SELECT 'RLS policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'about_content';
