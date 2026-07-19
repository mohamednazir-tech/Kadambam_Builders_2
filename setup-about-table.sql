-- CREATE ABOUT CONTENT TABLE
-- Run this in Supabase SQL Editor

-- Create the about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_title TEXT NOT NULL,
  mission_description TEXT NOT NULL,
  vision_title TEXT NOT NULL,
  vision_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Create policies for the table
-- Allow public read access
CREATE POLICY "Allow public read" ON about_content
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON about_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON about_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default content if table is empty
INSERT INTO about_content (title, description, mission_title, mission_description, vision_title, vision_description)
SELECT 
  'About Kadambam Builders',
  'Based in Tirunelveli, Kadambam Builders is a trusted name in construction, known for delivering high-quality residential and commercial projects. With years of expertise and a commitment to excellence, we turn your vision into reality — on time and within budget.',
  'Our Mission',
  'Deliver affordable and high-quality construction solutions that exceed expectations, ensuring every project is built with integrity and precision.',
  'Our Vision',
  'Become the most trusted and preferred builder in Tirunelveli, recognised for quality craftsmanship, transparency, and customer satisfaction.'
WHERE NOT EXISTS (SELECT 1 FROM about_content);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_about_content_updated_at 
    BEFORE UPDATE ON about_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT * FROM about_content LIMIT 1;
