-- Create projects table for Kadambam Builders
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  src TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for admin use)
CREATE POLICY "Enable all for projects" ON projects
  FOR ALL USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default projects
INSERT INTO projects (label, src, category) VALUES
  ('2BHK House Construction in Palayamkottai, Tirunelveli', '/src/assets/project-1.jpg', 'Residential'),
  ('Commercial Shop in Tirunelveli Town - 800 sq.ft', '/src/assets/project-2.jpg', 'Commercial'),
  ('Kitchen Renovation in Tirunelveli - Modern Design', '/src/assets/project-3.jpg', 'Renovation'),
  ('Luxury Villa in Tirunelveli - 2000 sq.ft', '/src/assets/project-4.jpg', 'Residential'),
  ('Modern Duplex House in Tirunelveli', '/src/assets/project-5.jpg', 'Residential'),
  ('Interior Design Project in Tirunelveli', '/src/assets/project-6.jpg', 'Interior')
ON CONFLICT DO NOTHING;
