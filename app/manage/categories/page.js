"use client";

import { useState, useEffect, useMemo } from "react";
import RemoteImage from "@/components/ui/RemoteImage";
import { Plus, Pencil, Trash2, ChevronRight, FolderTree, Upload, X } from "lucide-react";
import { Button, Input, Card, Modal, Badge, RichTextEditor } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { getCategoryImage } from "@/lib/catalog-images";

const emptyForm = {
  name: "",
  description: "",
  tagline: "",
  image_url: "",
  media: [],
  parent_id: "",
  features: "",
  specifications: "",
  sort_order: "0",
};

const MAX_UPLOAD = 25 * 1024 * 1024; // 25MB client limit

function parseSpecs(text) {
  if (!text?.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function formatSpecs(specs) {
  if (!specs) return "";
  return JSON.stringify(specs, null, 2);
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [specError, setSpecError] = useState("");
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order")
        .order("name");
      setCategories(data || []);
    }

    loadCategories();
  }, [supabase]);

  const tree = useMemo(() => {
    const roots = categories.filter((c) => !c.parent_id);
    return roots.map((root) => ({
      ...root,
      children: categories.filter((c) => c.parent_id === root.id),
    }));
  }, [categories]);

  const openCreate = (parentId = "") => {
    setEditing(null);
    setForm({ ...emptyForm, parent_id: parentId, media: [] });
    setSpecError("");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      tagline: cat.tagline || "",
      image_url: cat.image_url || "",
      media: cat.media || [],
      parent_id: cat.parent_id || "",
      features: cat.features?.join(", ") || "",
      specifications: formatSpecs(cat.specifications),
      sort_order: String(cat.sort_order ?? 0),
    });
    setSpecError("");
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const uploaded = [];
    try {
      for (const file of files) {
        if (file.size > MAX_UPLOAD) {
          addToast(`${file.name} is too large. Max ${Math.round(MAX_UPLOAD / (1024 * 1024))}MB.`, "error");
          continue;
        }
        const body = new FormData();
        body.append("file", file);
        body.append("folder", "categories");

        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();

        if (!res.ok) {
          addToast(data.error || `Upload failed for ${file.name}`, "error");
          continue;
        }

        uploaded.push(data.url);
      }

      if (uploaded.length) {
        setForm((prev) => ({
          ...prev,
          media: [...(prev.media || []), ...uploaded],
          image_url: prev.image_url || uploaded[0],
        }));
        addToast("Upload complete");
      }
    } catch (err) {
      addToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index = -1) => {
    if (index === -1) {
      setForm((prev) => ({ ...prev, media: [], image_url: "" }));
      return;
    }

    setForm((prev) => {
      const media = [...(prev.media || [])];
      media.splice(index, 1);
      return { ...prev, media, image_url: media[0] || "" };
    });
  };


  const handleSave = async () => {
    const specs = parseSpecs(form.specifications);
    if (form.specifications.trim() && !specs) {
      setSpecError("Invalid JSON format for specifications");
      return;
    }
    setSpecError("");

    const features = form.features
      ? form.features.split(",").map((f) => f.trim()).filter(Boolean)
      : null;

    const payload = {
      name: form.name,
      slug: editing ? editing.slug : slugify(form.name),
      description: form.description || null,
      tagline: form.tagline || null,
      image_url: form.image_url || null,
      media: form.media?.length ? form.media : null,
      parent_id: form.parent_id || null,
      features: features?.length ? features : null,
      specifications: specs,
      sort_order: parseInt(form.sort_order, 10) || 0,
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
    if (!confirm("Delete this category? Subcategories will lose their parent.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { addToast(error.message, "error"); return; }
    addToast("Category deleted", "info");
    load();
  };

  const parentOptions = categories.filter((c) => c.id !== editing?.id);
  const previewImage = form.media?.[0] || form.image_url || (editing ? getCategoryImage(editing.slug) : null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage categories, subcategories & specifications</p>
        </div>
        <Button onClick={() => openCreate()}><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="space-y-4">
        {tree.map((root) => (
          <Card key={root.id} padding={false} className="overflow-hidden border-0 shadow-md">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-sky-50 to-white border-b border-slate-100">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <RemoteImage
                  src={root.image_url || getCategoryImage(root.slug)}
                  alt={root.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-slate-900">{root.name}</h3>
                  <Badge variant="default">Parent</Badge>
                  {root.specifications && <Badge variant="slate">Has Specs</Badge>}
                </div>
                {root.tagline && <p className="text-sm text-sky-600 mt-0.5">{root.tagline}</p>}
                <p className="text-xs text-slate-400 mt-0.5">/{root.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openCreate(root.id)}
                  className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg text-xs font-medium"
                  title="Add subcategory"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button onClick={() => openEdit(root)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(root.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {root.children.length > 0 && (
              <div className="divide-y divide-slate-50">
                {root.children.map((child) => (
                  <div key={child.id} className="flex items-center gap-4 p-4 pl-8 hover:bg-slate-50/50 transition-colors">
                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <RemoteImage
                        src={child.image_url || getCategoryImage(child.slug)}
                        alt={child.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800">{child.name}</p>
                        <Badge variant="slate" className="text-xs">Subcategory</Badge>
                        {child.specifications && <Badge variant="slate" className="text-xs">Specs</Badge>}
                      </div>
                      {child.tagline && <p className="text-xs text-slate-500">{child.tagline}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(child)} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(child.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {root.children.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                No subcategories — add types under this category
              </div>
            )}
          </Card>
        ))}

        {tree.length === 0 && (
          <Card className="text-center py-12 text-slate-500">
            No categories yet. Click &quot;Add Category&quot; to get started.
          </Card>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "New Category"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short highlight text" />
          <RichTextEditor label="Description" value={form.description} onChange={(html) => setForm({ ...form, description: html })} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Media</label>
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              {previewImage ? (
                <div className="relative aspect-[16/10] w-full">
                  {/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(previewImage) ? (
                    <video src={previewImage} className="object-cover w-full h-full" autoPlay muted loop playsInline controls />
                  ) : (
                    <RemoteImage
                      src={previewImage}
                      alt="Category preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  )}
                  { (form.media?.length || form.image_url) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage()}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-red-600 transition-colors"
                      title="Remove media"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {form.media?.length > 1 && (
                    <div className="absolute left-4 bottom-4 flex gap-2">
                      {form.media.map((m, i) => (
                        <div key={m} className="relative w-12 h-8 rounded overflow-hidden bg-slate-100">
                          {/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(m) ? (
                            <video src={m} className="object-cover w-full h-full" muted playsInline />
                          ) : (
                            <img src={m} alt={`thumb-${i}`} className="object-cover w-full h-full" />
                          )}
                          <button onClick={() => handleRemoveImage(i)} className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 text-xs shadow">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 mb-3">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-500 mb-3">JPG, PNG, WebP, MP4 or WebM — max 5MB</p>
                </div>
              )}
              <div className="space-y-3 border-t border-slate-200 bg-white p-3">
                <label className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                  {uploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {form.image_url ? "Replace media" : "Upload media"}
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/ogg"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    multiple
                    className="sr-only"
                  />
                </label>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload files directly</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/ogg"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    multiple
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 file:cursor-pointer file:border-none file:bg-slate-900 file:px-3 file:py-1 file:text-white"
                  />
                  <p className="mt-2 text-xs text-slate-500">Upload local JPG, PNG, WebP, GIF, MP4, WebM, MOV, or OGG files. 25MB max per file.</p>
                </div>
              </div>
            </div>
          </div>

          <Input
            label="Features (comma-separated)"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            placeholder="SS 304 mesh, Custom sizing, ISO certified"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Specifications (JSON)</label>
            <textarea
              value={form.specifications}
              onChange={(e) => setForm({ ...form, specifications: e.target.value })}
              rows={6}
              placeholder='{"mesh": "SS 304 Black Coated", "profile": "Aluminium 6063"}'
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {specError && <p className="text-red-500 text-xs mt-1">{specError}</p>}
          </div>
          <div className="text-sm text-slate-500">
            Use the upload button above for local MP4/WebM/MOV/OGG files.
          </div>
          <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent Category</label>
            <select
              value={form.parent_id}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">No Parent (top-level category)</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={uploading}>
            {editing ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
