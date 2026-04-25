-- FIX CONTACT TABLE COLUMNS
-- Run this to add missing columns or fix column names

-- First, let's see what columns actually exist
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
-- Add mapEmbed column if it doesn't exist (as map_embed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'map_embed'
  ) THEN
    ALTER TABLE contact_content ADD COLUMN "map_embed" TEXT;
  END IF;
END $$;

-- Add formTitle column if it doesn't exist (as form_title)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'form_title'
  ) THEN
    ALTER TABLE contact_content ADD COLUMN "form_title" TEXT;
  END IF;
END $$;

-- If the camelCase columns don't exist, create them as aliases
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'mapEmbed'
  ) THEN
    ALTER TABLE contact_content ADD COLUMN "mapEmbed" TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'formTitle'
  ) THEN
    ALTER TABLE contact_content ADD COLUMN "formTitle" TEXT;
  END IF;
END $$;

-- Update the columns if they exist with different names
-- If map_embed exists but mapEmbed doesn't, copy data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'map_embed'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'mapEmbed'
  ) THEN
    UPDATE contact_content SET "mapEmbed" = map_embed WHERE "mapEmbed" IS NULL;
  END IF;
END $$;

-- If form_title exists but formTitle doesn't, copy data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'form_title'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_content' 
    AND column_name = 'formTitle'
  ) THEN
    UPDATE contact_content SET "formTitle" = form_title WHERE "formTitle" IS NULL;
  END IF;
END $$;

-- Insert default values for the new columns if they're NULL
UPDATE contact_content 
SET 
  "mapEmbed" = 'https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed',
  "formTitle" = 'Send us a message'
WHERE 
  "mapEmbed" IS NULL OR "formTitle" IS NULL;

-- Verify the final structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_content' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check the data
SELECT * FROM contact_content WHERE id = 'contact-page';
