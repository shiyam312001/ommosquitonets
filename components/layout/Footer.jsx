"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Share2 } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { BUSINESS } from "@/lib/utils";

export default function Footer() {
  const pathname = usePathname();

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
              <li><Link href="/products" className="hover:text-sky-400 transition-colors">Shop</Link></li>
              <li><Link href="/categories" className="hover:text-sky-400 transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-sky-400 transition-colors">Contact</Link></li>
              <li><Link href="/account" className="hover:text-sky-400 transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="hover:text-sky-400 transition-colors">All Categories</Link></li>
              <li><Link href="/products?category=door-mosquito-nets" className="hover:text-sky-400 transition-colors">Door Nets</Link></li>
              <li><Link href="/products?category=window-mosquito-nets" className="hover:text-sky-400 transition-colors">Window Nets</Link></li>
              <li><Link href="/products?category=pleated-retractable-systems" className="hover:text-sky-400 transition-colors">Pleated Systems</Link></li>
              <li><Link href="/products?category=magnetic-mesh-screens" className="hover:text-sky-400 transition-colors">Magnetic Mesh</Link></li>
              <li><Link href="/products?category=mosquito-net-installation" className="hover:text-sky-400 transition-colors">Installation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-sky-400" />
                <span>{BUSINESS.address}</span>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Phone className="h-4 w-4 text-sky-400" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-sky-400 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-sky-400" />
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
