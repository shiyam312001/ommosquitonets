-- Update category & product images to mosquito-net / screen / mesh photos (Unsplash License)
-- Safe to re-run after 007_catalog_specs.sql

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop' WHERE slug = 'window-openable';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop' WHERE slug = 'door-openable';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop' WHERE slug = 'pleated-system';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop' WHERE slug = 'velcro-system';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop' WHERE slug = 'sliding-system';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1776261293170-66fd3b09273e?w=800&q=80&auto=format&fit=crop' WHERE slug = 'rollup-system';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1642219046655-caa5ff2b78a0?w=800&q=80&auto=format&fit=crop' WHERE slug = 'honey-comb';

UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'sleek-openable';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'classic-openable';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'magnetic-openable';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'classic-door-openable';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'smart-door-openable';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1601583438330-a61d0df44f1f?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'grill-door-openable';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'elite-pleated-system';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1642219046655-caa5ff2b78a0?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'dual-pleated-system';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1776261293170-66fd3b09273e?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'freedom-pleated-system';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'velcro-mosquito-nets';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'magnetic-mesh';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop'] WHERE slug = 'magnetic-door-screen';

-- Fix legacy products from older seeds (wrong interior/room photos)
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop']
WHERE slug IN ('om-magnet-seal-magnetic-door-mesh', 'om-roll-fit-roller-window-net', 'om-pleat-pro-balcony-pleated-net', 'classic-openable-door-mosquito-net')
  AND (images IS NULL OR images = '{}' OR images[1] LIKE '%photo-1631049307264%' OR images[1] LIKE '%photo-1560185007%' OR images[1] LIKE '%photo-1586023492125%');
