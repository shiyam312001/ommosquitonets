"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import RemoteImage from "@/components/ui/RemoteImage";
import { ChevronDown, ArrowRight, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryTree } from "@/lib/category-utils";

export default function CategoriesDropdown({ isActive }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const tree = getCategoryTree(data);
        setCategories(tree);
        if (tree.length) setActiveGroup(tree[0].slug);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const active = categories.find((c) => c.slug === activeGroup) || categories[0];

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive || open
            ? "text-sky-600 bg-sky-50"
            : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Categories
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && categories.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[min(90vw,720px)]">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
            <div className="grid md:grid-cols-[200px_1fr]">
              {/* Group list */}
              <div className="bg-slate-50 border-r border-slate-100 p-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onMouseEnter={() => setActiveGroup(cat.slug)}
                    onClick={() => setActiveGroup(cat.slug)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      activeGroup === cat.slug
                        ? "bg-white text-sky-700 shadow-sm"
                        : "text-slate-600 hover:bg-white/60"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
                <Link
                  href="/categories"
                  className="flex items-center gap-2 px-3 py-2.5 mt-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
                  onClick={() => setOpen(false)}
                >
                  <Grid3X3 className="h-4 w-4" />
                  All Categories
                </Link>
              </div>

              {/* Preview panel */}
              {active && (
                <div className="p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <RemoteImage
                        src={active.image}
                        alt={active.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-slate-900 text-lg">{active.name}</h3>
                      {active.tagline && (
                        <p className="text-sky-600 text-sm font-medium mt-0.5">{active.tagline}</p>
                      )}
                      {active.description && (
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{active.description}</p>
                      )}
                      <Link
                        href={`/categories/${active.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 mt-2 hover:gap-2 transition-all"
                        onClick={() => setOpen(false)}
                      >
                        View Category <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {active.children?.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Subcategories
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {active.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`/categories/${child.slug}`}
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-sky-50 transition-colors group"
                            onClick={() => setOpen(false)}
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <RemoteImage
                                src={child.image}
                                alt={child.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 group-hover:text-sky-600 truncate">
                                {child.name}
                              </p>
                              {child.tagline && (
                                <p className="text-xs text-slate-400 truncate">{child.tagline}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : active.features?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {active.features.slice(0, 4).map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-700 font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
