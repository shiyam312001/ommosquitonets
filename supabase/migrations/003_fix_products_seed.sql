-- Fix: run ONLY the products seed if categories already exist
-- Safe to re-run: ON CONFLICT skips existing slugs

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Om Magnet Seal - Magnetic Door Mesh',
  'om-magnet-seal-magnetic-door-mesh',
  $txt$Centre-split magnetic mesh curtain with automatic closure. Velcro mount, hands-free walk-through, washable fibre mesh. Ideal for kitchen and balcony doors.$txt$,
  (SELECT id FROM categories WHERE slug = 'magnetic-mesh-screens' LIMIT 1),
  1899.00, 1499.00, 'OM-MAG-001', 50, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Om Roll Fit - Roller Window Net',
  'om-roll-fit-roller-window-net',
  $txt$Spring-loaded vertical roller screen for kitchen windows and sun slits. Full light retrieval, washable mesh, aluminium side channels.$txt$,
  (SELECT id FROM categories WHERE slug = 'window-mosquito-nets' LIMIT 1),
  1299.00, NULL, 'OM-ROLL-001', 100, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Om Pleat Pro - Balcony Pleated Net',
  'om-pleat-pro-balcony-pleated-net',
  $txt$Double-cassette pleated retractable mesh for balcony doors and wide openings. Retracts into slim side profile with UV-resistant Netlon mesh.$txt$,
  (SELECT id FROM categories WHERE slug = 'pleated-retractable-systems' LIMIT 1),
  4499.00, 3999.00, 'OM-PLEAT-001', 30, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Classic Openable Door Mosquito Net',
  'classic-openable-door-mosquito-net',
  $txt$Aluminium-framed openable door mesh with smooth hinge operation. Custom-sized for main doors, with grey or black Netlon mesh.$txt$,
  (SELECT id FROM categories WHERE slug = 'door-mosquito-nets' LIMIT 1),
  2799.00, 2299.00, 'OM-DOOR-001', 50, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  '304 SS Security Window Mesh',
  '304-ss-security-window-mesh',
  $txt$Heavy-duty 304 stainless steel mesh for ground-floor windows. Insect protection plus added security against pets and rodents.$txt$,
  (SELECT id FROM categories WHERE slug = 'stainless-steel-mesh' LIMIT 1),
  3499.00, 2999.00, 'OM-SS-001', 40, FALSE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'King Size Cotton Bed Net',
  'king-size-cotton-bed-net',
  $txt$Soft cotton canopy bed net for king size beds. Hook-mount system, breathable fabric, elegant white finish.$txt$,
  (SELECT id FROM categories WHERE slug = 'mosquito-bed-nets' LIMIT 1),
  899.00, 749.00, 'OM-BED-001', 75, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Professional Net Installation',
  'professional-net-installation',
  $txt$On-site measurement, aluminium framing, mesh fitting and silicon sealing. Free site visit across Chennai with transparent per-sq-ft pricing.$txt$,
  (SELECT id FROM categories WHERE slug = 'mosquito-net-installation' LIMIT 1),
  500.00, NULL, 'OM-INST-001', 999, FALSE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Premium Shower Curtain',
  'premium-shower-curtain',
  $txt$Mould-resistant polyester shower curtain with reinforced eyelets. Solid colours for clean modern bathroom.$txt$,
  (SELECT id FROM categories WHERE slug = 'shower-curtains' LIMIT 1),
  599.00, NULL, 'OM-SHOW-001', 60, FALSE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800']
)
ON CONFLICT (slug) DO NOTHING;
