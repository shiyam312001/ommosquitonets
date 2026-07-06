import Link from "next/link";
import {
  Shield,
  Users,
  Award,
  MapPin,
  Phone,
  Target,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import CategoryCard from "@/components/categories/CategoryCard";
import { getCategories } from "@/lib/categories";
import { NET_BENEFITS } from "@/lib/categories-content";
import { BUSINESS } from "@/lib/utils";

export const metadata = {
  title: "About Us | Om Mosquito Nets Chennai",
  description:
    "Om Mosquito Nets — Thiruverkadu-based specialists in custom mosquito nets, pleated systems, magnetic mesh & curtains for Chennai homes.",
};

export default async function AboutPage() {
  const categories = await getCategories();
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              About Om Mosquito Nets
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Based in Kamadhenu Nagar, Thiruverkadu, we are Chennai&apos;s dedicated
              specialists in custom mosquito nets, insect screens, and home curtains.
              We measure, manufacture, and install — so every net fits your opening
              perfectly, not approximately.
            </p>
            <p className="text-slate-600 leading-relaxed">
              From pleated balcony systems and magnetic door mesh to Netlon window
              rollers and cotton bed nets, we bring together the full range of modern
              insect protection under one trusted local brand.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Target className="h-8 w-8 text-sky-500 mb-4" />
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                To protect Chennai families from mosquito-borne illnesses — dengue,
                malaria, chikungunya — through affordable, chemical-free physical
                barriers. We never compromise on mesh quality or installation
                finishing, because a net with gaps is no net at all.
              </p>
            </Card>
            <Card>
              <Eye className="h-8 w-8 text-sky-500 mb-4" />
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">Our Vision</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                To become the most trusted name in custom insect screening across
                Tamil Nadu — known for honest pricing, on-time delivery, and nets
                that look as good as they perform. Every home deserves fresh air
                without the bite.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Quality Mesh", desc: "Netlon, 304 SS, fibre & cotton — materials chosen for Chennai's climate." },
              { icon: Users, title: "Customer First", desc: "Free measurement, transparent sq-ft pricing, and responsive after-sales." },
              { icon: Award, title: "Local Expertise", desc: "Years of fitting nets across Chennai — we know every frame type and challenge." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Benefits of Professional Mosquito Net Installation
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NET_BENEFITS.map((b) => (
              <Card key={b.title}>
                <h3 className="font-semibold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              What We Offer
            </h2>
            <Link href="/categories" className="text-sky-600 text-sm font-medium hover:text-sky-700 flex items-center gap-1">
              All categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center">
            <MapPin className="h-8 w-8 text-sky-500 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">Visit Our Store</h2>
            <p className="text-slate-600 text-sm mb-4">{BUSINESS.address}</p>
            <a href={`tel:${BUSINESS.phoneRaw}`}>
              <Button>
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </Button>
            </a>
          </Card>
        </div>
      </section>
    </div>
  );
}
