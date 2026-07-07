"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingBag,
  Users,
  MessageCircle,
  Share2,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/manage", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manage/categories", label: "Categories", icon: FolderTree },
  { href: "/manage/instagram", label: "Instagram", icon: Share2 },
  { href: "/manage/products", label: "Products", icon: Package },
  { href: "/manage/attributes", label: "Attributes", icon: Tags },
  { href: "/manage/orders", label: "Orders", icon: ShoppingBag },
  { href: "/manage/users", label: "Users", icon: Users },
  { href: "/manage/whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/manage/login");
  };

  return (
    <aside className="w-64 shrink-0 bg-sky-950 text-slate-300 min-h-screen flex flex-col">
      <div className="p-6 border-b border-sky-900">
        <Logo href="/manage" size="sm" className="mb-1" />
        <p className="text-xs text-slate-500 mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/manage" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-sky-500/20 text-sky-300"
                  : "text-slate-400 hover:bg-sky-900/50 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sky-900 space-y-1">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-sky-900/50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-sky-900/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
