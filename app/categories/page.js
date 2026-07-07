import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import CategoryCard from "@/components/categories/CategoryCard";
import { getCategoriesGrouped } from "@/lib/categories";
import { BUSINESS, getWhatsAppLink } from "@/lib/utils";

export const metadata = {
  title: "Mosquito Net Categories | Om Mosquito Nets Chennai",
  description:
    "Browse mosquito nets for doors, windows, balconies & more. Pleated, magnetic, roller, Netlon & stainless steel mesh — custom fit with free installation in Chennai.",
};

export default async function CategoriesPage() {
  const groups = await getCategoriesGrouped();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-sm font-medium mb-6 border border-sky-500/30">
            Complete Home Protection
          </span>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Our Mosquito Net Categories
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            From magnetic door curtains to pleated balcony systems — custom-fit insect
            screens measured, made, and installed by our Chennai team.
          </p>
        </div>
      </section>

      {/* Grouped categories */}
      {groups.map((group, idx) => (
        <section
          key={group.title}
          className={idx % 2 === 0 ? "py-16 md:py-20 bg-white" : "py-16 md:py-20 bg-slate-50/80"}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                {group.slug && (
                  <Link
                    href={`/categories/${group.slug}`}
                    className="inline-flex items-center gap-1 text-sky-600 text-sm font-semibold mb-2 hover:gap-2 transition-all"
                  >
                    View all types <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-2">
                  {group.title}
                </h2>
                {group.description && (
                  <p className="text-slate-600 text-lg">{group.description}</p>
                )}
              </div>
              {group.image && (
                <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-lg shrink-0 hidden md:block">
                  <Image
                    src={group.image}
                    alt={group.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {group.items.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-sky-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Not sure which net suits your home?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Call us for a free site visit and quote. We cover all Chennai localities
            including Thiruverkadu, Anna Nagar, Velachery, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-0">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Enquiry
              </Button>
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-white hover:bg-white/10">
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
