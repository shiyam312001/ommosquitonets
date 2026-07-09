-- Fix storage/category RLS for admin media uploads
-- Run in Supabase SQL Editor if category media upload fails with
-- "new row violates row-level security policy"

-- Harden is_admin() so storage RLS policies can resolve the current user
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- Categories: explicit write policies (INSERT needs WITH CHECK)
DROP POLICY IF EXISTS "Admin manage categories" ON categories;
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
DROP POLICY IF EXISTS "Admin update categories" ON categories;
DROP POLICY IF EXISTS "Admin delete categories" ON categories;

CREATE POLICY "Admin insert categories" ON categories
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update categories" ON categories
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete categories" ON categories
  FOR DELETE
  USING (public.is_admin());

-- Storage: ensure authenticated admins can upload category/product media
DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;

CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());
