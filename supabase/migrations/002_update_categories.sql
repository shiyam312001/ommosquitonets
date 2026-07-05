-- Run this if you already applied 001_initial_schema.sql with old categories
-- Updates categories and products to match the new Om Mosquito Nets structure

-- Clear old seed products (optional — only if re-seeding)
-- DELETE FROM products WHERE sku LIKE 'OM-%';

-- Update existing categories or insert new ones
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Door Mosquito Nets', 'door-mosquito-nets',
   'Openable, foldable and magnetic door mesh systems for main entrances, balcony doors and French doors.',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'),
  ('Window Mosquito Nets', 'window-mosquito-nets',
   'Roller, sliding & openable window nets for bedrooms, kitchens & living spaces.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'),
  ('Pleated & Retractable', 'pleated-retractable-systems',
   'Retractable pleated mesh for balconies, double doors & large window spans.',
   'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600'),
  ('Magnetic Mesh Screens', 'magnetic-mesh-screens',
   'Magnetic strip & Velcro-secured mesh curtains with auto-closing magnets.',
   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
  ('Stainless Steel Mesh', 'stainless-steel-mesh',
   '304-grade stainless steel mesh for insect protection and added security.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Update old slug references if they exist
UPDATE categories SET slug = 'door-mosquito-nets', name = 'Door Mosquito Nets'
WHERE slug = 'mosquito-curtain-nets-doors';

UPDATE categories SET slug = 'window-mosquito-nets', name = 'Window Mosquito Nets'
WHERE slug = 'mosquito-curtain-nets-windows';

UPDATE categories SET slug = 'mosquito-net-installation', name = 'Installation Services'
WHERE slug = 'mosquito-net-installation-services';
