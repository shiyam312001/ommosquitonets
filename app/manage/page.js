import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { Package, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
        <p className="text-slate-500">Configure Supabase environment variables to view dashboard data.</p>
      </div>
    );
  }

  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: orders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount, created_at, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("name, stock_quantity, sku").lt("stock_quantity", 10).eq("is_active", true).limit(5),
  ]);

  const totalRevenue = orders?.reduce((s, o) => s + Number(o.total_amount), 0) || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;

  const stats = [
    { label: "Total Products", value: productCount || 0, icon: Package, color: "text-sky-600 bg-sky-100" },
    { label: "Total Orders", value: orderCount || 0, icon: ShoppingBag, color: "text-green-600 bg-green-100" },
    { label: "Total Users", value: userCount || 0, icon: Users, color: "text-purple-600 bg-purple-100" },
    { label: "Revenue (Recent)", value: formatPrice(totalRevenue), icon: ShoppingBag, color: "text-amber-600 bg-amber-100" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display font-semibold text-lg mb-4">Recent Orders</h2>
          {orders?.length === 0 ? (
            <p className="text-sm text-slate-500">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders?.map((order, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-600 capitalize">{order.status}</span>
                  <span className="font-medium">{formatPrice(order.total_amount)}</span>
                </div>
              ))}
            </div>
          )}
          {pendingOrders > 0 && (
            <p className="text-sm text-amber-600 mt-3">{pendingOrders} pending orders need attention</p>
          )}
        </Card>

        <Card>
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Alerts
          </h2>
          {lowStock?.length === 0 ? (
            <p className="text-sm text-slate-500">All products well stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStock?.map((p) => (
                <div key={p.sku} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate mr-2">{p.name}</span>
                  <span className="text-red-500 font-medium shrink-0">{p.stock_quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
