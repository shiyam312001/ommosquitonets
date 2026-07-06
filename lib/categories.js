import { createClient } from "@/lib/supabase/server";
import { getCategoriesGroupedFromList } from "@/lib/category-utils";

export { normalizeCategory, categoryToSystem } from "@/lib/category-utils";

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export async function getCategoryBySlug(slug) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data || null;
}

export async function getCategoriesGrouped() {
  const categories = await getCategories();
  return getCategoriesGroupedFromList(categories);
}
