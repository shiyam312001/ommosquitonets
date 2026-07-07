import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ProductSystemCard } from "@/components/categories/CategoryCard";

export const FEATURED_SLUGS = [
  "window-openable",
  "door-openable",
  "pleated-system",
  "velcro-system",
];

export default function NetSystemsSection({ systems }) {
  if (!systems?.length) return null;

  return (
    <section
      className="relative py-20 md:py-28 bg-slate-950 overflow-hidden"
      aria-labelledby="net-systems-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.15),transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-300 ring-1 ring-sky-500/25 mb-5">
              Engineered for Chennai homes
            </span>
            <h2
              id="net-systems-heading"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Our Net Systems
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Purpose-built solutions for every opening — measured, made, and installed
              by our team. Not off-the-shelf kits.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 hover:ring-sky-400/40 transition-all shrink-0 self-start lg:self-auto"
          >
            View all categories
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 list-none p-0 m-0">
          {systems.map((system, index) => (
            <li key={system.href} className="h-full min-h-[22rem]">
              <ProductSystemCard system={system} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
