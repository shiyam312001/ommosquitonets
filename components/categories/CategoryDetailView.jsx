import Link from "next/link";
import RemoteImage from "@/components/ui/RemoteImage";
import { MessageCircle, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import CategoryCard from "@/components/categories/CategoryCard";
import CategorySpecifications from "@/components/categories/CategorySpecifications";
import { normalizeCategory } from "@/lib/category-utils";
import { getCategoryEnquiryLink } from "@/lib/category-specs";
import { BUSINESS } from "@/lib/utils";

export default function CategoryDetailView({ category: raw, parent, children }) {
  const category = normalizeCategory(raw, parent);
  const parentNorm = parent ? normalizeCategory(parent) : null;
  const hasChildren = children?.length > 0;
  const enquiryLink = getCategoryEnquiryLink(category, parentNorm);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {parentNorm && (
            <Link
              href={`/categories/${parentNorm.slug}`}
              className="inline-flex items-center gap-1.5 text-sky-300/80 hover:text-sky-200 text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {parentNorm.name}
            </Link>
          )}

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              {parentNorm && (
                <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  {parentNorm.name}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {category.name}
              </h1>
              {category.tagline && (
                <p className="text-sky-300 text-lg font-medium mb-4">{category.tagline}</p>
              )}
              {category.description && (
                <p className="text-slate-300 leading-relaxed mb-6 max-w-xl">
                  {category.description}
                </p>
              )}
              {category.features?.length > 0 && (
                <ul className="grid sm:grid-cols-2 gap-2 mb-8">
                  {category.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={enquiryLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-0 shadow-lg shadow-green-900/30">
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

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <RemoteImage
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      {hasChildren && (
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-sky-700 text-sm font-medium mb-4">
                Choose Your Type
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-3">
                Select a {category.name} Option
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Each type is custom-measured and professionally installed across Chennai.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {children.map((child) => (
                <CategoryCard key={child.slug} category={child} variant="subcategory" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications (for leaf categories or when specs exist) */}
      {!hasChildren && category.specifications && (
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <CategorySpecifications specifications={category.specifications} />
          </div>
        </section>
      )}

      {/* WhatsApp CTA strip */}
   <section className="py-16 md:py-20 bg-slate-50">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-3xl bg-white px-6 py-14 sm:px-12 sm:py-16 text-center shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5">
      {/* Ambient glow, lightened for a white card */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(14,165,233,0.08),transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_110%)]"
        aria-hidden="true"
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" aria-hidden="true" />

      <div className="relative">
        <span className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 ring-1 ring-sky-500/20 mb-5">
          Free site visit across Chennai
        </span>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight max-w-2xl mx-auto">
          Get a free quote for {category.name}
        </h2>
        <p className="text-slate-600 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Send us your requirements on WhatsApp — measurements, photos, or just
          your address. We&apos;ll get back with a quote and a visit date.
        </p>

        {/* Trust stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Homes Protected" },
            { value: "5+ yrs", label: "In Business" },
            { value: "24 hrs", label: "Response Time" },
            { value: "100%", label: "Custom Fit" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-slate-50 ring-1 ring-slate-900/5 py-6 px-3"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}
