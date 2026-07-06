import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { normalizeCategory } from "@/lib/category-utils";

export default function CategoryCard({ category: raw, variant = "default" }) {
  const category = normalizeCategory(raw);
  if (!category) return null;

  if (variant === "compact") {
    return (
      <Link href={`/products?category=${category.slug}`}>
        <Card hover padding={false} className="group overflow-hidden h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={category.image}
              alt={`${category.name} — mosquito net category`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent group-hover:from-sky-950/95 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display font-semibold text-white text-sm md:text-base">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="text-sky-100 text-xs mt-0.5">{category.tagline}</p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card hover padding={false} className="group overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={category.image}
            alt={`${category.name} — mosquito net category`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 transition-colors duration-300" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          {category.group && (
            <p className="text-xs font-medium text-sky-600 uppercase tracking-wide mb-1">
              {category.group}
            </p>
          )}
          <h3 className="font-display font-semibold text-slate-900 text-lg mb-1 group-hover:text-sky-600 transition-colors">
            {category.name}
          </h3>
          {category.tagline && (
            <p className="text-sm text-sky-700 font-medium mb-2">{category.tagline}</p>
          )}
          {category.description && (
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
              {category.description}
            </p>
          )}
          {category.features?.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mb-4">
              {category.features.slice(0, 3).map((f) => (
                <li
                  key={f}
                  className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
            Explore <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function ProductSystemCard({ system }) {
  return (
    <Link
      href={system.href}
      className="group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      aria-label={`${system.name} — ${system.subtitle}. ${system.description}`}
    >
      <Card hover padding={false} className="overflow-hidden h-full flex flex-col bg-slate-800 border-slate-700">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={system.image}
            alt={`${system.name} mosquito net system`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="p-5 flex flex-col flex-1 bg-slate-800">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
            {system.subtitle}
          </p>
          <h3 className="font-display font-bold text-white text-xl mb-3">{system.name}</h3>
          <p className="text-slate-200 text-sm leading-relaxed mb-4 flex-1">
            {system.description}
          </p>
          <span className="inline-flex items-center gap-1 text-sky-300 text-sm font-semibold group-hover:gap-2 group-hover:text-white transition-all">
            View products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
