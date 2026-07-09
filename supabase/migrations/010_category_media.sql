-- Add media gallery column for categories (images + videos)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS media TEXT[];

-- Backfill existing image_url into media array
UPDATE categories
SET media = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (media IS NULL OR media = '{}');
