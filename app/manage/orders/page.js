"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Select } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const statusColors = { pending: "warning", confirmed: "default", shipped: "default", delivered: "success", cancelled: "danger" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { addToast } = useToast();
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*), profiles(full_name, phone)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { addToast(error.message, "error"); return; }
    addToast("Order status updated");
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card><p className="text-sm text-slate-500 text-center py-8">No orders yet</p></Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {order.profiles?.full_name || "Customer"} — {order.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  <span className="font-bold text-sky-600">{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              <div className="text-sm space-y-1 mb-4">
                {order.order_items?.map((item) => (
                  <p key={item.id} className="text-slate-600">
                    {item.product_name} x{item.quantity} — {formatPrice(item.price_at_purchase)}
                  </p>
                ))}
              </div>

              <p className="text-xs text-slate-400 mb-3">{order.shipping_address}</p>

              <Select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                options={statuses.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
