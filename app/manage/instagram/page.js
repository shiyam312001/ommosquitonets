"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Share2 } from "lucide-react";
import { Button, Input, Textarea, Card, Modal } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

const emptyForm = {
  title: "",
  reel_url: "",
  thumbnail_url: "",
  caption: "",
  sort_order: "0",
  is_active: true,
};

export default function AdminInstagramPage() {
  const [videos, setVideos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { addToast } = useToast();
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from("instagram_videos")
      .select("*")
      .order("sort_order");
    setVideos(data || []);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (video) => {
    setEditing(video);
    setForm({
      title: video.title || "",
      reel_url: video.reel_url || "",
      thumbnail_url: video.thumbnail_url || "",
      caption: video.caption || "",
      sort_order: String(video.sort_order ?? 0),
      is_active: video.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title || null,
      reel_url: form.reel_url,
      thumbnail_url: form.thumbnail_url || null,
      caption: form.caption || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase.from("instagram_videos").update(payload).eq("id", editing.id);
      if (error) { addToast(error.message, "error"); return; }
      addToast("Video updated");
    } else {
      const { error } = await supabase.from("instagram_videos").insert(payload);
      if (error) { addToast(error.message, "error"); return; }
      addToast("Video added");
    }

    setModalOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("instagram_videos").delete().eq("id", id);
    if (error) { addToast(error.message, "error"); return; }
    addToast("Video deleted", "info");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="h-6 w-6 text-pink-500" />
            Instagram Videos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage homepage video gallery. Use reel URLs like https://www.instagram.com/reel/ABC123/
          </p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Video</Button>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="flex items-center justify-between gap-4 border-0 shadow-md">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">{video.title || "Untitled"}</p>
                {!video.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Hidden</span>
                )}
              </div>
              <p className="text-sm text-slate-500 truncate">{video.reel_url}</p>
              {video.caption && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{video.caption}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(video)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(video.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}

        {videos.length === 0 && (
          <Card className="text-center py-12 text-slate-500">
            No videos yet. Add Instagram reel URLs from @ommosquitonets
          </Card>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Video" : "Add Video"}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input
            label="Reel / Post URL"
            value={form.reel_url}
            onChange={(e) => setForm({ ...form, reel_url: e.target.value })}
            placeholder="https://www.instagram.com/reel/..."
          />
          <Input
            label="Thumbnail URL (optional)"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
          />
          <Textarea label="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-slate-300"
            />
            Show on homepage
          </label>
          <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add Video"}</Button>
        </div>
      </Modal>
    </div>
  );
}
