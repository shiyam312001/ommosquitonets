"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const { addToast } = useToast();
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    if (error) { addToast(error.message, "error"); return; }
    addToast(`${user.full_name || "User"} is now ${newRole}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Users</h1>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{user.full_name || "—"}</td>
                  <td className="px-6 py-3 text-slate-500">{user.phone || "—"}</td>
                  <td className="px-6 py-3">
                    <Badge variant={user.role === "admin" ? "default" : "slate"}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => toggleRole(user)}>
                      {user.role === "admin" ? "Demote" : "Make Admin"}
                    </Button>
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
