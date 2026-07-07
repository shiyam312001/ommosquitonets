import { createClient } from "@/lib/supabase/server";
import {
  getCategoriesGroupedFromList,
  getCategoryTree,
  getSubcategories,
} from "@/lib/category-utils";

export {
  normalizeCategory,
  categoryToSystem,
  getCategoryTree,
  getSubcategories,
} from "@/lib/category-utils";

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("name");
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

export async function getCategoryWithChildren(slug) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return null;

  const { data: allCategories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const parent = category.parent_id
    ? allCategories?.find((c) => c.id === category.parent_id) || null
    : null;

  const children = getSubcategories(allCategories || [], category.id);

  return { category, parent, children, allCategories: allCategories || [] };
}

export async function getCategoriesGrouped() {
  const categories = await getCategories();
  return getCategoriesGroupedFromList(categories);
}

export async function getCategoriesTree() {
  const categories = await getCategories();
  return getCategoryTree(categories);
}
