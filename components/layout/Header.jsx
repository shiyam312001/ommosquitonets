"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useCartStore } from "@/store/cart";
import { useMounted } from "@/hooks/useMounted";
import Logo from "@/components/layout/Logo";
import { BUSINESS, cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useMounted();
  const { user, profile, isAdmin, loading } = useAuth();
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname.startsWith("/manage");

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo href="/" size="header" priority className="min-w-0 shrink" />
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-sky-600 bg-sky-50"
                    : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="hidden md:flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-700"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS.phone}
            </a>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {!loading && mounted && user ? (
              <div className="relative group">
                <Link
                  href={isAdmin ? "/manage" : "/account"}
                  className="flex items-center gap-1.5 p-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {profile?.full_name || "Account"}
                  </span>
                </Link>
              </div>
            ) : !loading && mounted ? (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors"
              >
                Login
              </Link>
            ) : (
              <div className="hidden sm:block h-9 w-[72px]" aria-hidden="true" />
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-sky-600 bg-sky-50"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!loading && mounted && !user && (
              <Link
                href="/auth"
                className="block mx-4 mt-2 py-3 text-center rounded-xl bg-sky-500 text-white text-sm font-medium"
              >
                Login / Register
              </Link>
            )}
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="flex items-center gap-2 px-4 py-3 text-sm text-sky-600 font-medium"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
