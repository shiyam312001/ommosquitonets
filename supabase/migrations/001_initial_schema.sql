-- Om Mosquito Nets E-commerce Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ATTRIBUTES
-- ============================================
CREATE TABLE attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'select' CHECK (type IN ('select', 'color', 'text')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attribute_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attribute_id UUID NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_price DECIMAL(10,2),
  sku TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_attribute_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  attribute_value_id UUID NOT NULL REFERENCES attribute_values(id) ON DELETE CASCADE,
  UNIQUE(product_id, attribute_value_id)
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  attribute_combination JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cod')),
  payment_method TEXT DEFAULT 'cod',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  product_name TEXT,
  variant_details JSONB
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- ============================================
-- WHATSAPP CONFIG
-- ============================================
CREATE TABLE whatsapp_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_connected BOOLEAN NOT NULL DEFAULT FALSE,
  session_data TEXT,
  admin_phone TEXT DEFAULT '919064244204',
  business_phone TEXT,
  api_token TEXT,
  phone_number_id TEXT,
  last_connected_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_phone TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('welcome', 'order_customer', 'order_admin')),
  message_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default WhatsApp config row
INSERT INTO whatsapp_config (admin_phone) VALUES ('919064244204');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_attribute_values_attr ON attribute_values(attribute_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES policies
CREATE POLICY "Public profiles read own" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin update any profile" ON profiles FOR UPDATE USING (is_admin());

-- CATEGORIES policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (is_admin());

-- ATTRIBUTES policies
CREATE POLICY "Public read attributes" ON attributes FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage attributes" ON attributes FOR ALL USING (is_admin());

-- ATTRIBUTE_VALUES policies
CREATE POLICY "Public read attribute_values" ON attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage attribute_values" ON attribute_values FOR ALL USING (is_admin());

-- PRODUCTS policies
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admin manage products" ON products FOR ALL USING (is_admin());

-- PRODUCT_ATTRIBUTE_VALUES policies
CREATE POLICY "Public read product_attribute_values" ON product_attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage product_attribute_values" ON product_attribute_values FOR ALL USING (is_admin());

-- PRODUCT_VARIANTS policies
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage product_variants" ON product_variants FOR ALL USING (is_admin());

-- ORDERS policies
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (is_admin());

-- ORDER_ITEMS policies
CREATE POLICY "Users read own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin())));
CREATE POLICY "Users create own order items" ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admin manage order items" ON order_items FOR ALL USING (is_admin());

-- REVIEWS policies
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin manage reviews" ON reviews FOR ALL USING (is_admin());

-- WHATSAPP policies (admin only)
CREATE POLICY "Admin read whatsapp_config" ON whatsapp_config FOR SELECT USING (is_admin());
CREATE POLICY "Admin manage whatsapp_config" ON whatsapp_config FOR ALL USING (is_admin());
CREATE POLICY "Admin read whatsapp_messages" ON whatsapp_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admin manage whatsapp_messages" ON whatsapp_messages FOR ALL USING (is_admin());
CREATE POLICY "Service insert whatsapp_messages" ON whatsapp_messages FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- STORAGE BUCKET — run 005_storage_bucket.sql separately
-- Or create in Dashboard: Storage → New bucket → "product-images" (Public)
-- ============================================

-- ============================================
-- SEED DATA: CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Door Mosquito Nets', 'door-mosquito-nets',
   'Openable, foldable and magnetic door mesh systems for main entrances, balcony doors and French doors. Aluminium-framed with custom sizing.',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'),
  ('Window Mosquito Nets', 'window-mosquito-nets',
   'Roller, sliding and openable window nets for bedrooms, kitchens and living spaces. Spring-loaded rollers and sleek openable frames.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'),
  ('Pleated and Retractable', 'pleated-retractable-systems',
   'Retractable pleated mesh for balconies, double doors and large window spans. Folds away neatly when not in use.',
   'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600'),
  ('Magnetic Mesh Screens', 'magnetic-mesh-screens',
   'Magnetic strip and Velcro-secured mesh curtains with auto-closing magnets. Hands-free, tool-free installation.',
   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
  ('Netlon Mosquito Nets', 'netlon-mosquito-nets',
   'Premium Netlon mesh - tear-resistant, weatherproof, built for Chennai climate. Fibre and stainless steel variants.',
   'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'),
  ('Stainless Steel Mesh', 'stainless-steel-mesh',
   '304-grade stainless steel mesh combining insect screening with added security for ground-floor windows and doors.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'),
  ('Bed Mosquito Nets', 'mosquito-bed-nets',
   'Soft cotton and polyester canopy nets for all bed sizes. Easy hook installation, breathable and elegant.',
   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
  ('Insect Screens', 'insect-screens-netlon',
   'Fixed-frame Netlon insect screens for balconies, utility areas and ventilation openings.',
   'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600'),
  ('Installation Services', 'mosquito-net-installation',
   'Professional on-site measurement and installation across Chennai. Free site visit and transparent per-sq-ft pricing.',
   'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'),
  ('Plain Curtains', 'plain-curtains',
   'Cotton, polyester and blackout plain curtains. Custom lengths and widths in multiple colours.',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'),
  ('Shower Curtains', 'shower-curtains',
   'Mould-resistant polyester shower curtains with reinforced eyelets for modern bathrooms.',
   'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600'),
  ('Window Curtains', 'window-curtains',
   'Light-filtering and blackout window curtains tailored to your frame size.',
   'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600');

-- ============================================
-- SEED DATA: ATTRIBUTES & VALUES
-- ============================================
INSERT INTO attributes (name, type) VALUES
  ('Net Type', 'select'),
  ('Application', 'select'),
  ('Mesh Color', 'color'),
  ('Size', 'select'),
  ('Frame Material', 'select'),
  ('Installation Included', 'select'),
  ('Fabric Type', 'select');

-- Net Type values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Netlon', 'Fibre', 'Cotton', 'Nylon Mesh'])
FROM attributes WHERE name = 'Net Type';

-- Application values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Door', 'Window', 'Bed', 'Balcony'])
FROM attributes WHERE name = 'Application';

-- Mesh Color values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['White', 'Grey', 'Black', 'Beige'])
FROM attributes WHERE name = 'Mesh Color';

-- Size values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Custom (WxH)', '3x4 ft', '4x6 ft', '5x7 ft', '6x8 ft'])
FROM attributes WHERE name = 'Size';

-- Frame Material values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Aluminium', 'PVC', 'No Frame (Curtain style)'])
FROM attributes WHERE name = 'Frame Material';

-- Installation Included values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Yes', 'No'])
FROM attributes WHERE name = 'Installation Included';

-- Fabric Type values
INSERT INTO attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Cotton', 'Polyester', 'Blackout'])
FROM attributes WHERE name = 'Fabric Type';

-- ============================================
-- SEED DATA: SAMPLE PRODUCTS
-- (Separate INSERTs — avoids UNION ALL parsing issues with & and special chars)
-- ============================================

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Om Magnet Seal - Magnetic Door Mesh',
  'om-magnet-seal-magnetic-door-mesh',
  $txt$Centre-split magnetic mesh curtain with automatic closure. Velcro mount, hands-free walk-through, washable fibre mesh. Ideal for kitchen and balcony doors.$txt$,
  (SELECT id FROM categories WHERE slug = 'magnetic-mesh-screens' LIMIT 1),
  1899.00, 1499.00, 'OM-MAG-001', 50, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Om Roll Fit - Roller Window Net',
  'om-roll-fit-roller-window-net',
  $txt$Spring-loaded vertical roller screen for kitchen windows and sun slits. Full light retrieval, washable mesh, aluminium side channels.$txt$,
  (SELECT id FROM categories WHERE slug = 'window-mosquito-nets' LIMIT 1),
  1299.00, NULL, 'OM-ROLL-001', 100, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Om Pleat Pro - Balcony Pleated Net',
  'om-pleat-pro-balcony-pleated-net',
  $txt$Double-cassette pleated retractable mesh for balcony doors and wide openings. Retracts into slim side profile with UV-resistant Netlon mesh.$txt$,
  (SELECT id FROM categories WHERE slug = 'pleated-retractable-systems' LIMIT 1),
  4499.00, 3999.00, 'OM-PLEAT-001', 30, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Classic Openable Door Mosquito Net',
  'classic-openable-door-mosquito-net',
  $txt$Aluminium-framed openable door mesh with smooth hinge operation. Custom-sized for main doors, with grey or black Netlon mesh.$txt$,
  (SELECT id FROM categories WHERE slug = 'door-mosquito-nets' LIMIT 1),
  2799.00, 2299.00, 'OM-DOOR-001', 50, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  '304 SS Security Window Mesh',
  '304-ss-security-window-mesh',
  $txt$Heavy-duty 304 stainless steel mesh for ground-floor windows. Insect protection plus added security against pets and rodents.$txt$,
  (SELECT id FROM categories WHERE slug = 'stainless-steel-mesh' LIMIT 1),
  3499.00, 2999.00, 'OM-SS-001', 40, FALSE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'King Size Cotton Bed Net',
  'king-size-cotton-bed-net',
  $txt$Soft cotton canopy bed net for king size beds. Hook-mount system, breathable fabric, elegant white finish.$txt$,
  (SELECT id FROM categories WHERE slug = 'mosquito-bed-nets' LIMIT 1),
  899.00, 749.00, 'OM-BED-001', 75, TRUE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Professional Net Installation',
  'professional-net-installation',
  $txt$On-site measurement, aluminium framing, mesh fitting and silicon sealing. Free site visit across Chennai with transparent per-sq-ft pricing.$txt$,
  (SELECT id FROM categories WHERE slug = 'mosquito-net-installation' LIMIT 1),
  500.00, NULL, 'OM-INST-001', 999, FALSE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800']
);

INSERT INTO products (name, slug, description, category_id, base_price, discount_price, sku, stock_quantity, is_featured, is_active, images)
VALUES (
  'Premium Shower Curtain',
  'premium-shower-curtain',
  $txt$Mould-resistant polyester shower curtain with reinforced eyelets. Solid colours for clean modern bathroom.$txt$,
  (SELECT id FROM categories WHERE slug = 'shower-curtains' LIMIT 1),
  599.00, NULL, 'OM-SHOW-001', 60, FALSE, TRUE,
  ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800']
);
