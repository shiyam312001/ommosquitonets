import { createClient } from "@/lib/supabase/server";

export { getCategories } from "@/lib/categories";

export async function getProducts({
  category,
  search,
  sort = "newest",
  page = 1,
  limit = 12,
  filters = {},
} = {}) {
  const supabase = await createClient();
  if (!supabase) return { products: [], total: 0 };
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)", { count: "exact" })
    .eq("is_active", true);

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (sort === "price_asc") query = query.order("base_price", { ascending: true });
  else if (sort === "price_desc") query = query.order("base_price", { ascending: false });
  else if (sort === "popular") query = query.order("is_featured", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, count, error } = await query;
  if (error) return { products: [], total: 0 };

  return { products: data || [], total: count || 0 };
}

export async function getProductBySlug(slug) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) return null;

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id);

  const { data: attrLinks } = await supabase
    .from("product_attribute_values")
    .select("attribute_value_id, attribute_values(id, value, attribute_id, attributes(name, type))")
    .eq("product_id", product.id);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  return { product, variants: variants || [], attributes: attrLinks || [], reviews: reviews || [] };
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(limit);
  return data || [];
}

export async function getRelatedProducts(categoryId, excludeId, limit = 4) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(limit);
  return data || [];
}

export async function getAttributes() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("attributes")
    .select("*, attribute_values(*)")
    .order("name");
  return data || [];
}
