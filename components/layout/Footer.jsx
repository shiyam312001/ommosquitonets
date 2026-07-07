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
      setCategories(initialCategories);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Logo href="/" size="header" className="mb-4" />
            <p className="text-sm leading-relaxed text-slate-400">
              Premium mosquito nets, curtains & installation services in Chennai.
              Custom fit, durable quality, expert installation.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-sky-400 transition-colors">Home</Link></li>
              <li><Link href="/categories" className="hover:text-sky-400 transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-sky-400 transition-colors">Contact</Link></li>
              <li><Link href="/account" className="hover:text-sky-400 transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Categories</h3>
            <nav aria-label="Footer categories">
              <ul className="space-y-2 text-sm columns-1 sm:columns-2 lg:columns-1">
                <li className="break-inside-avoid">
                  <Link
                    href="/categories"
                    className="font-medium text-sky-300 hover:text-sky-200 transition-colors"
                  >
                    All Categories
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug} className="break-inside-avoid">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-slate-400 hover:text-sky-300 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
                <span>{BUSINESS.address}</span>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Phone className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Mail className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-sky-400 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  @ommosquitonets
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sky-900 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Om Mosquito Nets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
