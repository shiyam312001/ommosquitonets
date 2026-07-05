import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";

export default function CategoryCard({ category, variant = "default" }) {
  if (variant === "compact") {
    return (
      <Link href={`/products?category=${category.slug}`}>
        <Card hover padding={false} className="group overflow-hidden h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-900/30 to-transparent group-hover:from-sky-600/90 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display font-semibold text-white text-sm md:text-base">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="text-sky-200 text-xs mt-0.5 line-clamp-1">{category.tagline}</p>
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
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 transition-colors duration-300" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wide mb-1">
            {category.group}
          </p>
          <h3 className="font-display font-semibold text-slate-900 text-lg mb-1 group-hover:text-sky-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-sky-600 font-medium mb-2">{category.tagline}</p>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {category.description}
          </p>
          {category.features && (
            <ul className="flex flex-wrap gap-1.5 mb-4">
              {category.features.slice(0, 3).map((f) => (
                <li
                  key={f}
                  className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
            Explore <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function ProductSystemCard({ system }) {
  return (
    <Link href={system.href}>
      <Card hover padding={false} className="group overflow-hidden h-full">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={system.image}
            alt={system.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-sky-300 text-xs font-medium uppercase tracking-wider mb-1">
              {system.subtitle}
            </p>
            <h3 className="font-display font-bold text-white text-xl mb-2">{system.name}</h3>
            <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
              {system.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sky-300 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
              View products <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
