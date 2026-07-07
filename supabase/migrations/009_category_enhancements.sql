-- Category enhancements: tagline, features, specifications, sort order
-- Instagram videos for homepage gallery

ALTER TABLE categories ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE categories ADD COLUMN IF NOT EXISTS specifications JSONB;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- Instagram videos / reels for homepage gallery
CREATE TABLE IF NOT EXISTS instagram_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  reel_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instagram_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read instagram videos" ON instagram_videos
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admin manage instagram videos" ON instagram_videos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Enrich existing categories with taglines and features
UPDATE categories SET
  tagline = '3 types of window openable systems',
  features = ARRAY['Sleek & classic profiles', 'SS 304 black coated mesh', 'ISO 9001 certified', 'Custom sizing'],
  sort_order = 1
WHERE slug = 'window-openable';

UPDATE categories SET
  tagline = '3 types of door openable systems',
  features = ARRAY['Classic & smart doors', 'Grill door design', 'Magnetic strip lock', 'Custom fit'],
  sort_order = 2
WHERE slug = 'door-openable';

UPDATE categories SET
  tagline = '3 types of pleated systems',
  features = ARRAY['Elite pleated cassette', 'Fiberglass mesh options', 'Inside rail hook lock', 'Retractable design'],
  sort_order = 3
WHERE slug = 'pleated-system';

UPDATE categories SET
  tagline = 'Velcro and magnetic mesh solutions',
  features = ARRAY['Hook-and-loop mount', 'Magnetic auto-close', 'Removable & washable', 'No drilling options'],
  sort_order = 4
WHERE slug = 'velcro-system';

UPDATE categories SET
  tagline = 'Smooth sliding insect screens',
  features = ARRAY['Smooth sliding tracks', 'Space-saving design', 'Custom dimensions', 'Easy maintenance'],
  sort_order = 5
WHERE slug = 'sliding-system';

UPDATE categories SET
  tagline = 'Compact roll-up roller nets',
  features = ARRAY['Spring-loaded roller', 'Compact cassette', 'Full light when open', 'Washable mesh'],
  sort_order = 6
WHERE slug = 'rollup-system';

UPDATE categories SET
  tagline = 'Honeycomb pleated fabric screens',
  features = ARRAY['Honeycomb fabric', 'Pleated fold design', 'UV-resistant options', 'Modern look'],
  sort_order = 7
WHERE slug = 'honey-comb';

-- Seed subcategories from product catalog (window openable)
INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Sleek Openable', 'sleek-openable',
  'Sleek profile openable window mosquito net with aluminium frame and SS 304 black coated mesh.',
  'https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'window-openable' LIMIT 1),
  'Slim aluminium profile',
  '{"sizeRange":"Width 20mm, Thick 8mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated","installation":"Customized","lockMode":"Stopper","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}'::jsonb,
  1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'sleek-openable');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Classic Openable', 'classic-openable',
  'Classic openable window mosquito net with durable aluminium profile and premium mesh.',
  'https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'window-openable' LIMIT 1),
  'Durable classic profile',
  '{"sizeRange":"Width 25mm, Thick 8mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated","installation":"Customized","lockMode":"Stopper","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}'::jsonb,
  2
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'classic-openable');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Magnetic Openable', 'magnetic-openable',
  'Magnetic openable window mosquito net for convenient daily use and secure closure.',
  'https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'window-openable' LIMIT 1),
  'Magnetic closure system',
  '{"sizeRange":"Width 20mm, Thick 8mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated","installation":"Customized","lockMode":"Stopper","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}'::jsonb,
  3
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'magnetic-openable');

-- Door openable subcategories
INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Classic Door Openable', 'classic-door-openable',
  'Classic door openable mosquito net with aluminium handles and magnetic strip locking.',
  'https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'door-openable' LIMIT 1),
  'Classic entrance profile',
  '{"sizeRange":"Outer 45mm, Thick 18mm, Middle 40mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated, Pet Mesh","handle":"Aluminium Coated Handles","installation":"Customized","lockMode":"Magnetic Strip (A+B)","woolPile":"Silicate Weather Strip","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}'::jsonb,
  1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'classic-door-openable');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Smart Door Openable', 'smart-door-openable',
  'Smart door openable mosquito net with wider middle profile for main entrance doors.',
  'https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'door-openable' LIMIT 1),
  'Wide smart profile',
  '{"sizeRange":"Outer 45mm, Thick 18mm, Middle 120mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated, Pet Mesh","handle":"Aluminium Coated Handles","installation":"Customized","lockMode":"Magnetic Strip (A+B)","woolPile":"Silicate Weather Strip","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}'::jsonb,
  2
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'smart-door-openable');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Grill Door Openable', 'grill-door-openable',
  'Open grill design integrated with mosquito mesh for insect protection while allowing airflow.',
  'https://images.unsplash.com/photo-1601583438330-a61d0df44f1f?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'door-openable' LIMIT 1),
  'Grill + mesh combination',
  NULL,
  3
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'grill-door-openable');

-- Pleated subcategories
INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Elite Pleated System', 'elite-pleated-system',
  'Premium elite pleated retractable mosquito net system for wide openings and balconies.',
  'https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'pleated-system' LIMIT 1),
  'Premium elite cassette',
  '{"sizeRange":"Width 30mm, Thick 25mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastics","mesh":"Fiberglass, PP, Honeycomb Fabrics, SS 304","lockMode":"Inside Rail Hook","woolPile":"Silicate Weather Strip","installation":"Customized","verification":"ISO 9001:2015 Certified"}'::jsonb,
  1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'elite-pleated-system');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Dual Pleated System', 'dual-pleated-system',
  'Dual pleated mosquito net system with fiberglass mesh for home windows.',
  'https://images.unsplash.com/photo-1642219046655-caa5ff2b78a0?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'pleated-system' LIMIT 1),
  'Dual fold design',
  '{"material":"Fiberglass","usage":"Home Windows","packing":"Color Box","description":"Screens Spline Roller is a tool needed for DIY screens."}'::jsonb,
  2
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'dual-pleated-system');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, specifications, sort_order)
SELECT
  'Freedom Pleated System', 'freedom-pleated-system',
  'Freedom pleated mosquito net system with easy operation for everyday window use.',
  'https://images.unsplash.com/photo-1776261293170-66fd3b09273e?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'pleated-system' LIMIT 1),
  'Easy everyday operation',
  '{"material":"Fiberglass","usage":"Home Windows","packing":"Color Box","description":"Screens Spline Roller is a tool needed for DIY screens."}'::jsonb,
  3
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'freedom-pleated-system');

-- Velcro subcategories
INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, sort_order)
SELECT
  'Velcro Mosquito Nets', 'velcro-mosquito-nets',
  'Hook-and-loop fastening for easy installation and removal. Keeps mosquitoes out while allowing fresh air.',
  'https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'velcro-system' LIMIT 1),
  'Easy hook-and-loop mount',
  1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'velcro-mosquito-nets');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, sort_order)
SELECT
  'Magnetic Mesh', 'magnetic-mesh',
  'Velcro net with built-in magnetic closure for hands-free, removable insect barrier.',
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'velcro-system' LIMIT 1),
  'Hands-free magnetic close',
  2
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'magnetic-mesh');

INSERT INTO categories (name, slug, description, image_url, parent_id, tagline, sort_order)
SELECT
  'Magnetic Door Screen', 'magnetic-door-screen',
  'Magnetic mesh screen for doorways with automatic magnetic closure after passing through.',
  'https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop',
  (SELECT id FROM categories WHERE slug = 'velcro-system' LIMIT 1),
  'Auto-close door screen',
  3
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'magnetic-door-screen');

-- Seed Instagram videos (add reel URLs via admin panel)
INSERT INTO instagram_videos (title, reel_url, caption, sort_order, is_active)
SELECT 'Installation Showcase', 'https://www.instagram.com/ommosquitonets/', 'Watch our latest installations on Instagram', 1, TRUE
WHERE NOT EXISTS (SELECT 1 FROM instagram_videos LIMIT 1);

INSERT INTO instagram_videos (title, reel_url, caption, sort_order, is_active)
SELECT 'Pleated System Demo', 'https://www.instagram.com/ommosquitonets/', 'Pleated mosquito net systems in action', 2, TRUE
WHERE (SELECT COUNT(*) FROM instagram_videos) < 2;

INSERT INTO instagram_videos (title, reel_url, caption, sort_order, is_active)
SELECT 'Door Net Fitting', 'https://www.instagram.com/ommosquitonets/', 'Professional door net installation', 3, TRUE
WHERE (SELECT COUNT(*) FROM instagram_videos) < 3;
