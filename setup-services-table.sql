-- CREATE SERVICES CONTENT TABLE
-- Run this in Supabase SQL Editor

-- Create the services_content table with single row design
CREATE TABLE IF NOT EXISTS services_content (
  id TEXT PRIMARY KEY DEFAULT 'services-page',  -- Fixed ID for single row
  section_title TEXT NOT NULL DEFAULT 'Our Services',
  section_description TEXT,
  service1_title TEXT NOT NULL,
  service1_description TEXT NOT NULL,
  service1_icon TEXT NOT NULL DEFAULT 'Home',
  service2_title TEXT NOT NULL,
  service2_description TEXT NOT NULL,
  service2_icon TEXT NOT NULL DEFAULT 'Building2',
  service3_title TEXT NOT NULL,
  service3_description TEXT NOT NULL,
  service3_icon TEXT NOT NULL DEFAULT 'Hammer',
  service4_title TEXT NOT NULL,
  service4_description TEXT NOT NULL,
  service4_icon TEXT NOT NULL DEFAULT 'FileCheck',
  service5_title TEXT NOT NULL,
  service5_description TEXT NOT NULL,
  service5_icon TEXT NOT NULL DEFAULT 'Paintbrush',
  guide_link_text TEXT NOT NULL DEFAULT '→ Detailed House Construction Guide for Tirunelveli',
  guide_link_url TEXT NOT NULL DEFAULT '/house-construction-tirunelveli',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE services_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read (for website visitors)
CREATE POLICY "Allow public read services" ON services_content
  FOR SELECT
  TO anon
  USING (true);

-- Allow public insert (for admin panel)
CREATE POLICY "Allow public insert services" ON services_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public update (for admin panel)
CREATE POLICY "Allow public update services" ON services_content
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add single row constraint
ALTER TABLE services_content 
ADD CONSTRAINT single_services_row 
CHECK (id = 'services-page');

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_content_updated_at 
    BEFORE UPDATE ON services_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_services_updated_at();

-- Insert default content
INSERT INTO services_content (
  id, section_title, section_description,
  service1_title, service1_description, service1_icon,
  service2_title, service2_description, service2_icon,
  service3_title, service3_description, service3_icon,
  service4_title, service4_description, service4_icon,
  service5_title, service5_description, service5_icon,
  guide_link_text, guide_link_url
)
VALUES (
  'services-page',
  'Our Services',
  'We offer comprehensive construction solutions in Tirunelveli and across Tamil Nadu, delivering quality projects with exceptional craftsmanship.',
  'House Construction Tirunelveli',
  'Leading house construction company in Tirunelveli offering custom homes, budget construction, and luxury villas across Tamil Nadu with premium materials.',
  'Home',
  'Commercial Construction',
  'Professional commercial building contractors in Tirunelveli specializing in offices, retail spaces, and industrial projects with timely delivery.',
  'Building2',
  'Home Renovation Tirunelveli',
  'Expert home renovation and remodeling services in Tirunelveli. Transform your living spaces with quality craftsmanship and modern designs.',
  'Hammer',
  'Building Plan Approval',
  'Complete assistance with DTCP plan approvals in Tirunelveli. Navigate Tamil Nadu building regulations with our expert guidance.',
  'FileCheck',
  'Interior Design Tirunelveli',
  'Premium interior design services in Tirunelveli and Tamil Nadu. Create beautiful, functional spaces that reflect your style and needs.',
  'Paintbrush',
  '→ Detailed House Construction Guide for Tirunelveli',
  '/house-construction-tirunelveli'
)
ON CONFLICT (id) DO NOTHING;

-- Verify setup
SELECT 'Services table created successfully' as status;
SELECT * FROM services_content LIMIT 1;
