"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Card, Modal } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export default function AdminAttributesPage() {
  const [attributes, setAttributes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [valueModal, setValueModal] = useState(null);
  const [form, setForm] = useState({ name: "", type: "select" });
  const [newValue, setNewValue] = useState("");
  const { addToast } = useToast();
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("attributes").select("*, attribute_values(*)").order("name");
    setAttributes(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleCreateAttr = async () => {
    const { error } = await supabase.from("attributes").insert(form);
    if (error) { addToast(error.message, "error"); return; }
    addToast("Attribute created");
    setModalOpen(false);
    setForm({ name: "", type: "select" });
    load();
  };

  const handleAddValue = async () => {
    if (!newValue.trim() || !valueModal) return;
    const { error } = await supabase.from("attribute_values").insert({
      attribute_id: valueModal.id,
      value: newValue.trim(),
    });
    if (error) { addToast(error.message, "error"); return; }
    addToast("Value added");
    setNewValue("");
    setValueModal(null);
    load();
  };

  const handleDeleteValue = async (id) => {
    await supabase.from("attribute_values").delete().eq("id", id);
    addToast("Value removed", "info");
    load();
  };

  const handleDeleteAttr = async (id) => {
    if (!confirm("Delete attribute and all values?")) return;
    await supabase.from("attributes").delete().eq("id", id);
    addToast("Attribute deleted", "info");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Attributes</h1>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Attribute</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {attributes.map((attr) => (
          <Card key={attr.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{attr.name}</h3>
                <p className="text-xs text-slate-400 capitalize">{attr.type}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setValueModal(attr)}>+ Value</Button>
                <button onClick={() => handleDeleteAttr(attr.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attr.attribute_values?.map((val) => (
                <span key={val.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-600">
                  {val.value}
                  <button onClick={() => handleDeleteValue(val.id)} className="text-red-400 hover:text-red-600">&times;</button>
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Attribute">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mesh Color" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200">
            <option value="select">Select</option>
            <option value="color">Color</option>
            <option value="text">Text</option>
          </select>
          <Button onClick={handleCreateAttr} className="w-full">Create</Button>
        </div>
      </Modal>

      <Modal isOpen={!!valueModal} onClose={() => setValueModal(null)} title={`Add Value to ${valueModal?.name}`}>
        <div className="space-y-4">
          <Input label="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="e.g. Green" />
          <Button onClick={handleAddValue} className="w-full">Add</Button>
        </div>
      </Modal>
    </div>
  );
}
