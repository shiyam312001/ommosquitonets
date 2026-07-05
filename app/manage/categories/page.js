"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input, Textarea, Card, Modal } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image_url: "", parent_id: "" });
  const { addToast } = useToast();
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", image_url: "", parent_id: "" });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "", image_url: cat.image_url || "", parent_id: cat.parent_id || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description,
      image_url: form.image_url || null,
      parent_id: form.parent_id || null,
    };

    if (editing) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editing.id);
      if (error) { addToast(error.message, "error"); return; }
      addToast("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { addToast(error.message, "error"); return; }
      addToast("Category created");
    }

    setModalOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { addToast(error.message, "error"); return; }
    addToast("Category deleted", "info");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Categories</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">Parent</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{cat.name}</td>
                  <td className="px-6 py-3 text-slate-500">{cat.slug}</td>
                  <td className="px-6 py-3 text-slate-500">
                    {categories.find((c) => c.id === cat.parent_id)?.name || "—"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => openEdit(cat)} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "New Category"}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <select
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          >
            <option value="">No Parent</option>
            {categories.filter((c) => c.id !== editing?.id).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
        </div>
      </Modal>
    </div>
  );
}
