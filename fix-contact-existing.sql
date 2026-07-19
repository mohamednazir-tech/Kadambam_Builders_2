-- FIX EXISTING CONTACT TABLE
-- Run this in Supabase SQL Editor if table already exists

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Public can read contact" ON contact_content;
DROP POLICY IF EXISTS "Authenticated can insert contact" ON contact_content;
DROP POLICY IF EXISTS "Authenticated can update contact" ON contact_content;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_contact_content_updated_at ON contact_content;
DROP FUNCTION IF EXISTS update_contact_updated_at();

-- Drop existing constraint if it exists
ALTER TABLE contact_content DROP CONSTRAINT IF EXISTS single_contact_row;

-- Recreate clean RLS policies (same as other admin pages)
-- Public can read (for website visitors)
CREATE POLICY "Public can read contact" ON contact_content
  FOR SELECT
  TO anon
  USING (true);

-- Only authenticated users can insert (for admin panel)
CREATE POLICY "Authenticated can insert contact" ON contact_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update (for admin panel)
CREATE POLICY "Authenticated can update contact" ON contact_content
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Add single row constraint
ALTER TABLE contact_content 
ADD CONSTRAINT single_contact_row 
CHECK (id = 'contact-page');

-- Recreate trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_content_updated_at 
    BEFORE UPDATE ON contact_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contact_updated_at();

-- Insert default content if not exists
INSERT INTO contact_content (
  id, address, phone, email, "mapEmbed", "formTitle"
)
VALUES (
  'contact-page',
  'Shop No 1, 132A, 1st Street, Rahmath Nagar,
Near Sadak Abdullah College, Tirunelveli',
  '+91 63740 34451',
  'info@kadambambuilders.com',
  'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed',
  'Send us a message'
)
ON CONFLICT (id) DO NOTHING;

-- Verify setup
SELECT 'Contact table fixed successfully' as status;
SELECT * FROM contact_content WHERE id = 'contact-page';
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'contact_content' ORDER BY policyname;
