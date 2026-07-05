"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Textarea, Select, Card } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

export default function AdminProductFormPage() {
  const params = useParams();
  const isNew = params.id === "new";
  const router = useRouter();
  const { addToast } = useToast();
  const supabase = createClient();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", category_id: "", base_price: "", discount_price: "",
    sku: "", stock_quantity: "0", is_featured: false, is_active: true, images: "",
  });

  useEffect(() => {
    supabase.from("categories").select("id, name").order("name").then(({ data }) => setCategories(data || []));
  }, [supabase]);

  useEffect(() => {
    if (!isNew) {
      supabase.from("products").select("*").eq("id", params.id).single().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name, description: data.description || "", category_id: data.category_id || "",
            base_price: String(data.base_price), discount_price: data.discount_price ? String(data.discount_price) : "",
            sku: data.sku || "", stock_quantity: String(data.stock_quantity),
            is_featured: data.is_featured, is_active: data.is_active,
            images: (data.images || []).join("\n"),
          });
        }
      });
    }
  }, [isNew, params.id, supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description,
      category_id: form.category_id || null,
      base_price: parseFloat(form.base_price) || 0,
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      sku: form.sku,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_featured: form.is_featured,
      is_active: form.is_active,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("products").insert(payload));
    } else {
      ({ error } = await supabase.from("products").update(payload).eq("id", params.id));
    }

    if (error) {
      addToast(error.message, "error");
      setLoading(false);
      return;
    }

    addToast(isNew ? "Product created" : "Product updated");
    router.push("/manage/products");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Upload failed", "error");
        return;
      }

      setForm((prev) => ({
        ...prev,
        images: prev.images ? prev.images + "\n" + data.url : data.url,
      }));
      addToast("Image uploaded to Supabase Storage");
    } catch (err) {
      addToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">
        {isNew ? "New Product" : "Edit Product"}
      </h1>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl space-y-4">
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Base Price (₹)" type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} required />
            <Input label="Discount Price (₹)" type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Images</label>
            <p className="text-xs text-slate-500 mb-2">
              Paste image URLs (one per line) or upload — files are stored in Supabase Storage (works on Vercel).
            </p>
            <Textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://... (one URL per line)" rows={3} />
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50">
                {uploading ? "Uploading..." : "Upload image"}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} disabled={uploading} className="sr-only" />
              </label>
              {uploading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded text-sky-500" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded text-sky-500" />
              Active
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>{isNew ? "Create Product" : "Update Product"}</Button>
            <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
