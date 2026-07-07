"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Phone, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useMounted } from "@/hooks/useMounted";
import Logo from "@/components/layout/Logo";
import CategoriesDropdown from "@/components/layout/CategoriesDropdown";
import { BUSINESS, cn } from "@/lib/utils";
import { getCategoryTree } from "@/lib/category-utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategories, setMobileCategories] = useState([]);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useMounted();
  const { user, profile, isAdmin, loading } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
    setMobileCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setMobileCategories(getCategoryTree(data)))
      .catch(() => {});
  }, []);

  const isAdminRoute = pathname.startsWith("/manage");
  const isCategoriesActive = pathname.startsWith("/categories");

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo href="/" size="header" priority className="min-w-0 shrink" />

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-sky-600 bg-sky-50"
                    : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <CategoriesDropdown isActive={isCategoriesActive} />
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(link.href)
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

            {!loading && mounted && user ? (
              <Link
                href={isAdmin ? "/manage" : "/account"}
                className="flex items-center gap-1.5 p-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                  {profile?.full_name || "Account"}
                </span>
              </Link>
            ) : !loading && mounted ? (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors shadow-sm"
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
        <div className="lg:hidden border-t border-slate-100 bg-white max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className={cn(
                "block px-4 py-3 rounded-xl text-sm font-medium",
                pathname === "/" ? "text-sky-600 bg-sky-50" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium",
                isCategoriesActive ? "text-sky-600 bg-sky-50" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              Categories
              <ChevronRight className={cn("h-4 w-4 transition-transform", mobileCatOpen && "rotate-90")} />
            </button>

            {mobileCatOpen && (
              <div className="pl-4 space-y-1">
                <Link
                  href="/categories"
                  className="block px-4 py-2.5 rounded-lg text-sm text-sky-600 font-medium"
                >
                  All Categories
                </Link>
                {mobileCategories.map((cat) => (
                  <div key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {cat.name}
                    </Link>
                    {cat.children?.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/categories/${child.slug}`}
                        className="block pl-8 pr-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium",
                  pathname === link.href ? "text-sky-600 bg-sky-50" : "text-slate-600 hover:bg-slate-50"
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
