import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui";
import CategoryCard from "@/components/categories/CategoryCard";
import { getCategoriesGrouped } from "@/lib/categories";
import { BUSINESS } from "@/lib/utils";

export const metadata = {
  title: "Product Categories | Om Mosquito Nets Chennai",
  description:
    "Browse mosquito nets for doors, windows, balconies, beds & more. Pleated, magnetic, roller, Netlon & stainless steel mesh — custom fit with free installation in Chennai.",
};

export default async function CategoriesPage() {
  const groups = await getCategoriesGrouped();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-4">
            Complete Home Protection
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Product Categories
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            From magnetic door curtains to pleated balcony systems — Om Mosquito Nets
            offers Chennai&apos;s widest range of custom-fit insect screens, nets, and
            home curtains. Every product is measured, made, and installed by our team.
          </p>
        </div>
      </section>

      {/* Grouped categories */}
      {groups.map((group) => (
        <section key={group.title} className="py-12 md:py-16 even:bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {group.title}
              </h2>
              {group.description && <p className="text-slate-600">{group.description}</p>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-12 bg-sky-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Not sure which net suits your home?
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Call us for a free site visit and quote. We cover all Chennai localities
            including Thiruverkadu, Anna Nagar, Velachery, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phoneRaw}`}>
              <Button size="lg" variant="primary" className="w-full sm:w-auto bg-white text-sky-900 hover:bg-sky-50">
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Book Free Visit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
