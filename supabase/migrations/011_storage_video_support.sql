-- Allow category/product video uploads in the product-images bucket
-- Matches app/api/upload/route.js (25MB max, images + common video types)

UPDATE storage.buckets
SET
  file_size_limit = 26214400, -- 25MB
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg'
  ]
WHERE id = 'product-images';
