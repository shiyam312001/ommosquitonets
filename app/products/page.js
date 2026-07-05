"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, Package } from "lucide-react";
import { Button, Select, ProductGridSkeleton } from "@/components/ui";
import ProductCard from "@/components/products/ProductCard";
import { createClient } from "@/lib/supabase/client";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories-content";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("search") || "",
    page: 1,
  });

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setFilters((f) => ({ ...f, category: cat }));
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      if (!supabase) { setLoading(false); return; }

      let query = supabase
        .from("products")
        .select("*, categories(name, slug)", { count: "exact" })
        .eq("is_active", true);

      if (filters.category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.category)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters.sort === "price_asc") query = query.order("base_price", { ascending: true });
      else if (filters.sort === "price_desc") query = query.order("base_price", { ascending: false });
      else if (filters.sort === "popular") query = query.order("is_featured", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const limit = 12;
      const from = (filters.page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, count } = await query;
      setProducts(data || []);
      setTotal(count || 0);
      setLoading(false);
    };
    load();
  }, [filters]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setCategories(CATEGORIES.map((c) => ({ id: c.slug, name: c.name, slug: c.slug })));
      return;
    }
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      setCategories(data?.length ? data : CATEGORIES.map((c) => ({ id: c.slug, name: c.name, slug: c.slug })));
    });
    supabase.from("attributes").select("*, attribute_values(*)").order("name").then(({ data }) => setAttributes(data || []));
  }, []);

  const totalPages = Math.ceil(total / 12);
  const activeCategory = filters.category ? getCategoryBySlug(filters.category) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {activeCategory ? (
        <div className="mb-8 p-6 rounded-2xl bg-sky-50 border border-sky-100">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wide mb-1">{activeCategory.group}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2">{activeCategory.name}</h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">{activeCategory.description}</p>
        </div>
      ) : (
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Shop</h1>
          <p className="text-slate-600">Browse our premium mosquito nets & curtains</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-6 sticky top-24">
            <h2 className="font-display font-semibold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>

            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
              placeholder="All Categories"
            />

            <Select
              label="Sort By"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              options={[
                { value: "newest", label: "Newest" },
                { value: "price_asc", label: "Price: Low to High" },
                { value: "price_desc", label: "Price: High to Low" },
                { value: "popular", label: "Popular" },
              ]}
            />

            {attributes.map((attr) => (
              <div key={attr.id}>
                <p className="text-sm font-medium text-slate-700 mb-2">{attr.name}</p>
                <div className="space-y-1.5">
                  {attr.attribute_values?.map((val) => (
                    <label key={val.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                      {val.value}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
            <Button
              variant="secondary"
              className="lg:hidden"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-slate-500 mb-4">{total} products found</p>

          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                  className={`h-10 w-10 rounded-xl text-sm font-medium transition-colors ${
                    filters.page === i + 1
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8"><ProductGridSkeleton /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
