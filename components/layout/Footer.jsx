"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Share2, Mail } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { BUSINESS } from "@/lib/utils";
import { getRootCategories } from "@/lib/category-utils";

export default function Footer({ categories: initialCategories = [] }) {
  const pathname = usePathname();
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    if (initialCategories.length) {
      setCategories(getRootCategories(initialCategories));
      return;
    }

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(getRootCategories(data)))
      .catch(() => {});
  }, [initialCategories]);

  if (pathname.startsWith("/manage")) return null;

  return (
    <footer className="bg-sky-950 text-slate-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          
             <div className="rounded-xl overflow-hidden h-48 md:h-56 bg-slate-800 ring-1 ring-white/10">
              <iframe
                title="Om Mosquito Nets Location"
                src="https://maps.google.com/maps?q=Kamadhenu+Nagar+Thiruverkadu+Chennai&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sky-900 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Om Mosquito Nets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
