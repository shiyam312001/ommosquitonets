"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Package, User, MapPin } from "lucide-react";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";

const statusColors = {
  pending: "warning",
  confirmed: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

function AccountContent() {
  const { user, profile, updateProfile } = useAuth();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  const newOrderId = searchParams.get("order");

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      addToast("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">My Account</h1>

      {newOrderId && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
          Order placed successfully! Order #{newOrderId.slice(0, 8).toUpperCase()}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-sky-500" /> Profile
              </h2>
              {!editing && (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </div>
            {editing ? (
              <div className="space-y-3">
                <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Textarea label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} loading={saving}>Save</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-500">Name:</span> {profile?.full_name || "—"}</p>
                <p><span className="text-slate-500">Email:</span> {user?.email}</p>
                <p><span className="text-slate-500">Phone:</span> {profile?.phone || "—"}</p>
                <p className="flex items-start gap-1">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  {profile?.address || "No address saved"}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-sky-500" /> Order History
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No orders yet. Start shopping!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                        <span className="font-semibold text-sky-600">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.order_items?.map((item) => (
                        <p key={item.id} className="text-sm text-slate-600">
                          {item.product_name} x{item.quantity} — {formatPrice(item.price_at_purchase)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
