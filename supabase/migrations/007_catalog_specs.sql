-- Add product model + specifications for catalog content
ALTER TABLE products ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT NULL;

-- Royalty-free Unsplash images (https://unsplash.com/license)

-- ============================================
-- UPDATE CATEGORIES (new catalog structure)
-- ============================================
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Window Openable', 'window-openable', '3 Types of Window Openable Systems', 'https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop'),
  ('Door Openable', 'door-openable', '3 Types of Door Openable Systems', 'https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop'),
  ('Pleated System', 'pleated-system', '3 Types of Pleated Systems', 'https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop'),
  ('Velcro System', 'velcro-system', 'Velcro and magnetic mesh solutions for easy installation', 'https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop'),
  ('Sliding System', 'sliding-system', 'Smooth sliding mosquito net systems for windows and doors', 'https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop'),
  ('Rollup System', 'rollup-system', 'Roll-up roller mosquito nets for compact storage', 'https://images.unsplash.com/photo-1776261293170-66fd3b09273e?w=800&q=80&auto=format&fit=crop'),
  ('Honey Comb', 'honey-comb', 'Honeycomb fabric pleated insect screen systems', 'https://images.unsplash.com/photo-1642219046655-caa5ff2b78a0?w=800&q=80&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- ============================================
-- SEED / UPDATE PRODUCTS
-- base_price 0 = enquiry-only on frontend
-- ============================================

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Sleek Openable',
  'sleek-openable',
  $txt$Sleek profile openable window mosquito net with aluminium frame and SS 304 black coated mesh.$txt$,
  'Openable Type – Window',
  $json${"sizeRange":"Width 20mm, Thick 8mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated","installation":"Customized","lockMode":"Stopper","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'window-openable' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Classic Openable',
  'classic-openable',
  $txt$Classic openable window mosquito net with durable aluminium profile and premium mesh.$txt$,
  'Openable Type – Window',
  $json${"sizeRange":"Width 25mm, Thick 8mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated","installation":"Customized","lockMode":"Stopper","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'window-openable' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Magnetic Openable',
  'magnetic-openable',
  $txt$Magnetic openable window mosquito net for convenient daily use and secure closure.$txt$,
  'Openable Type – Window',
  $json${"sizeRange":"Width 20mm, Thick 8mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated","installation":"Customized","lockMode":"Stopper","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'window-openable' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Classic Door Openable',
  'classic-door-openable',
  $txt$Classic door openable mosquito net with aluminium handles and magnetic strip locking.$txt$,
  'Openable Type – Classic, Smart, Box Door',
  $json${"sizeRange":"Outer 45mm, Thick 18mm, Middle 40mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated, Pet Mesh","handle":"Aluminium Coated Handles","installation":"Customized","lockMode":"Magnetic Strip (A+B)","woolPile":"Silicate Weather Strip","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'door-openable' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1761052056661-05a554df6ff4?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Smart Door Openable',
  'smart-door-openable',
  $txt$Smart door openable mosquito net with wider middle profile for main entrance doors.$txt$,
  'Openable Type – Classic, Smart, Box Door',
  $json${"sizeRange":"Outer 45mm, Thick 18mm, Middle 120mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastic","mesh":"SS 304 Black Coated, Pet Mesh","handle":"Aluminium Coated Handles","installation":"Customized","lockMode":"Magnetic Strip (A+B)","woolPile":"Silicate Weather Strip","rubber":"EPDM Rubbers","verification":"ISO 9001:2015 Certified"}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'door-openable' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1758998222336-d48b2390a686?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Grill Door Openable',
  'grill-door-openable',
  $txt$Features an open grill design made from steel or iron grills, integrated with a mosquito mesh for insect protection while allowing airflow. Includes a hinged mechanism and secure locking system for safety and convenience.$txt$,
  'Grill Door',
  NULL,
  (SELECT id FROM categories WHERE slug = 'door-openable' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1601583438330-a61d0df44f1f?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Elite Pleated System',
  'elite-pleated-system',
  $txt$Premium elite pleated retractable mosquito net system for wide openings and balconies.$txt$,
  'Pleated System',
  $json${"sizeRange":"Width 30mm, Thick 25mm","profile":"Aluminium 6063 Alloy","coating":"PP Coating (50-70 microns)","components":"Virgin HD Plastics","mesh":"Fiberglass, PP, Honeycomb Fabrics, SS 304","lockMode":"Inside Rail Hook","woolPile":"Silicate Weather Strip","installation":"Customized","verification":"ISO 9001:2015 Certified"}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'pleated-system' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1767032915447-a09b88e07b0c?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Dual Pleated System',
  'dual-pleated-system',
  $txt$Dual pleated mosquito net system with fiberglass mesh for home windows.$txt$,
  NULL,
  $json${"material":"Fiberglass","usage":"Home Windows","packing":"Color Box","description":"Screens Spline Roller is a tool needed for DIY screens. It works by rolling the screen into the frame."}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'pleated-system' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1642219046655-caa5ff2b78a0?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Freedom Pleated System',
  'freedom-pleated-system',
  $txt$Freedom pleated mosquito net system with easy operation for everyday window use.$txt$,
  NULL,
  $json${"material":"Fiberglass","usage":"Home Windows","packing":"Color Box","description":"Screens Spline Roller is a tool needed for DIY screens. It works by rolling the screen into the frame."}$json$::jsonb,
  (SELECT id FROM categories WHERE slug = 'pleated-system' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1776261293170-66fd3b09273e?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Velcro Mosquito Nets',
  'velcro-mosquito-nets',
  $txt$A simple and effective insect protection solution using hook-and-loop (Velcro) fastening for easy installation and removal. Keeps mosquitoes, flies, and insects out while allowing fresh air and natural light.$txt$,
  NULL, NULL,
  (SELECT id FROM categories WHERE slug = 'velcro-system' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Magnetic Mesh',
  'magnetic-mesh',
  $txt$A Velcro mosquito net with built-in magnetic closure, providing a hands-free, durable, removable insect barrier for windows and doors.$txt$,
  NULL, NULL,
  (SELECT id FROM categories WHERE slug = 'velcro-system' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;

INSERT INTO products (name, slug, description, model, specifications, category_id, base_price, stock_quantity, is_featured, is_active, images)
VALUES (
  'Magnetic Door Screen',
  'magnetic-door-screen',
  $txt$A magnetic mesh screen for doorways that allows fresh air while preventing insects from entering. Features automatic magnetic closure after passing through.$txt$,
  NULL, NULL,
  (SELECT id FROM categories WHERE slug = 'velcro-system' LIMIT 1),
  0, 999, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?w=800&q=80&auto=format&fit=crop']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, model = EXCLUDED.model,
  specifications = EXCLUDED.specifications, category_id = EXCLUDED.category_id, images = EXCLUDED.images;
