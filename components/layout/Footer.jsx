"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Instagram, Youtube, Mail } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { BUSINESS, getWhatsAppLink } from "@/lib/utils";
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
        <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr] items-start">
          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
            <div>
              <Logo href="/" size="sm" className="mb-4" />
              <p className="text-sm text-slate-400 leading-relaxed">
                Custom mosquito net solutions for Chennai windows, doors, balconies and beds.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Contact</p>
                <div className="mt-3 space-y-3 text-slate-300 text-sm">
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-3 hover:text-sky-300 transition-colors">
                    <Phone className="h-4 w-4 text-sky-400" aria-hidden="true" />
                    {BUSINESS.phone}
                  </a>
                  <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 hover:text-sky-300 transition-colors">
                    <Mail className="h-4 w-4 text-sky-400" aria-hidden="true" />
                    {BUSINESS.email}
                  </a>
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-sky-400" aria-hidden="true" />
                    <span>{BUSINESS.address}</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">Connect with us</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 hover:border-sky-400 hover:bg-sky-950/80 hover:text-white transition"
                  >
                    <Phone className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    WhatsApp
                  </Link>
                  <Link
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 hover:border-pink-400 hover:bg-pink-950/80 hover:text-white transition"
                  >
                    <Instagram className="h-4 w-4 text-pink-400" aria-hidden="true" />
                    Instagram
                  </Link>
                  <Link
                    href={BUSINESS.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 hover:border-red-400 hover:bg-red-950/80 hover:text-white transition"
                  >
                    <Youtube className="h-4 w-4 text-red-400" aria-hidden="true" />
                    YouTube
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-slate-800 ring-1 ring-white/10 h-72 md:h-96">
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
