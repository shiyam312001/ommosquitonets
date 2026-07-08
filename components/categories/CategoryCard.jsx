import Link from "next/link";
import RemoteImage from "@/components/ui/RemoteImage";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";
import { normalizeCategory } from "@/lib/category-utils";

export default function CategoryCard({ category: raw, variant = "default" }) {
  const category = normalizeCategory(raw);
  if (!category) return null;

  const href = `/categories/${category.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group block h-full">
        <Card hover padding={false} className="overflow-hidden h-full border-0 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden">
            <RemoteImage
              src={category.image}
              alt={`${category.name} — mosquito net category`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display font-semibold text-white text-sm md:text-base">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="text-sky-200/90 text-xs mt-1 line-clamp-1">{category.tagline}</p>
              )}
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <ArrowRight className="h-4 w-4 text-white" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "subcategory") {
    return (
      <Link href={href} className="group block h-full">
        <Card
          hover
          padding={false}
          className="overflow-hidden h-full border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300"
        >
          <div className="relative aspect-[16/11] overflow-hidden">
            <RemoteImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
          <div className="p-5">
            <h3 className="font-display font-semibold text-slate-900 text-lg mb-1 group-hover:text-sky-600 transition-colors">
              {category.name}
            </h3>
            {category.tagline && (
              <p className="text-sm text-sky-600 font-medium mb-2">{category.tagline}</p>
            )}
            {category.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{category.description}</p>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 group-hover:gap-2 transition-all">
              View Details <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block h-full">
      <Card
        hover
        padding={false}
        className="overflow-hidden h-full flex flex-col border-0 shadow-md hover:shadow-2xl transition-all duration-300"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <RemoteImage
            src={category.image}
            alt={`${category.name} — mosquito net category`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-sky-500/0 group-hover:via-sky-900/20 transition-all duration-300" />
          {category.group && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-sky-700 uppercase tracking-wide">
              {category.group}
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1 bg-white">
          <h3 className="font-display font-bold text-slate-900 text-xl mb-1 group-hover:text-sky-600 transition-colors">
            {category.name}
          </h3>
          {category.tagline && (
            <p className="text-sm text-sky-600 font-medium mb-3">{category.tagline}</p>
          )}
          {category.description && (
            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-3">
              {category.description}
            </p>
          )}
          {category.features?.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-4">
              {category.features.slice(0, 4).map((f) => (
                <li
                  key={f}
                  className="text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-medium border border-sky-100"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 group-hover:gap-3 transition-all">
            Explore Category <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function ProductSystemCard({ system, index = 0 }) {
  return (
    <Link
      href={system.href}
      className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-500 hover:ring-sky-400/50 hover:shadow-2xl hover:shadow-sky-950/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <article className="relative flex h-full min-h-[22rem] flex-col">
        <RemoteImage
          src={system.image}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          priority={index < 2}
          aria-hidden="true"
        />

        {/* Strong gradient overlay for readable text (WCAG contrast) */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/40"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-slate-950/0 transition-colors duration-500 group-hover:bg-sky-950/20"
          aria-hidden="true"
        />

        <div className="relative mt-auto flex flex-1 flex-col justify-end p-6 pt-32">
          {system.tagline && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-300">
              {system.tagline}
            </p>
          )}

          <h3 className="font-display text-xl font-bold leading-snug text-white mb-2">
            {system.name}
          </h3>

          <p className="text-sm leading-relaxed text-slate-200 line-clamp-2 mb-4">
            {system.description}
          </p>

          {system.features?.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-1.5" aria-label={`${system.name} features`}>
              {system.features.map((f) => (
                <li
                  key={f}
                  className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-100 backdrop-blur-sm"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 group-hover:text-white transition-colors">
            View details
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 ring-1 ring-sky-400/30 transition-all group-hover:bg-sky-500 group-hover:ring-sky-400"
              aria-hidden="true"
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
