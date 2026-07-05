"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToast } = useToast();
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { addToast(error.message, "error"); return; }
    addToast("Product deleted", "info");
    load();
  };

  const toggleActive = async (product) => {
    await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Products</h1>
        <Link href="/manage/products/new">
          <Button><Plus className="h-4 w-4" /> Add Product</Button>
        </Link>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.sku}</p>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{p.categories?.name || "—"}</td>
                  <td className="px-6 py-3">{formatPrice(p.discount_price ?? p.base_price)}</td>
                  <td className="px-6 py-3">{p.stock_quantity}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => toggleActive(p)}>
                      <Badge variant={p.is_active ? "success" : "slate"}>
                        {p.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/manage/products/${p.id}`} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg inline-block"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
