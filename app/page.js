import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Ruler,
  Wrench,
  Award,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Leaf,
  HeartPulse,
  IndianRupee,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import ProductCard from "@/components/products/ProductCard";
import CategoryCard, { ProductSystemCard } from "@/components/categories/CategoryCard";
import { getFeaturedProducts } from "@/lib/products";
import {
  CATEGORIES,
  PRODUCT_SYSTEMS,
  NET_BENEFITS,
} from "@/lib/categories-content";
import { BUSINESS } from "@/lib/utils";
import { SITE_IMAGES } from "@/lib/catalog-images";

const features = [
  {
    icon: Shield,
    title: "Premium Materials",
    desc: "Netlon, 304 SS mesh, fibre & cotton — sourced for Chennai's heat and humidity.",
  },
  {
    icon: Ruler,
    title: "Made to Measure",
    desc: "Free site visit, exact measurements, and per-sq-ft pricing with no surprises.",
  },
  {
    icon: Wrench,
    title: "Expert Installation",
    desc: "Factory-trained fitters handle aluminium framing, mesh fitting & silicon sealing.",
  },
  {
    icon: Award,
    title: "After-Sales Care",
    desc: "Warranty on workmanship plus responsive support when you need adjustments.",
  },
];

const benefitIcons = [Leaf, HeartPulse, Ruler, Shield, IndianRupee, Award];

const testimonials = [
  {
    name: "Priya R.",
    location: "Anna Nagar, Chennai",
    rating: 5,
    text: "Got pleated nets for our balcony doors — quality is excellent and the team was very professional. No gaps at all!",
  },
  {
    name: "Karthik M.",
    location: "Velachery, Chennai",
    rating: 5,
    text: "Magnetic mesh on the kitchen door changed our life — walk through hands-free and no mosquitoes. Highly recommend Om!",
  },
  {
    name: "Lakshmi S.",
    location: "Thiruverkadu",
    rating: 5,
    text: "They installed window rollers and door nets for our entire flat. Fair pricing, on-time delivery, great finishing.",
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);
  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-6">
                Thiruverkadu, Chennai — Custom Mosquito Net Specialists
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Chennai&apos;s Smart Way to{" "}
                <span className="text-sky-500">Keep Insects Out</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-lg">
                Pleated, roller, magnetic & openable mosquito nets for doors, windows,
                balconies & beds. Measured, made & installed by our team — chemical-free
                protection for your family.
              </p>
              <p className="text-sm text-sky-600 font-medium mb-8">
                Free site visit & quote · All Chennai localities
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/categories">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Categories
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={`tel:${BUSINESS.phoneRaw}`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Phone className="h-4 w-4" />
                    {BUSINESS.phone}
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={SITE_IMAGES.hero}
                alt="Professional mosquito net mesh installation — Om Mosquito Nets Chennai"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Systems */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Our Net Systems
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Purpose-built solutions for every opening — engineered for Chennai homes,
              not off-the-shelf kits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {PRODUCT_SYSTEMS.map((system) => (
              <ProductSystemCard key={system.name} system={system} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-slate-600">
                Door nets, window rollers, pleated balconies, magnetic mesh & more
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1 text-sky-600 font-medium hover:text-sky-700"
            >
              All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topCategories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Popular Products
                </h2>
                <p className="text-slate-600">Best-selling nets & curtains in Chennai</p>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-sky-600 font-medium hover:text-sky-700">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why mosquito nets */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Install Mosquito Nets?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Repellent creams, mosquito bats, and zappers only go so far — and some
                come with health concerns. A properly fitted mosquito net is the only
                fool-proof, chemical-free way to keep dengue and malaria carriers out
                while enjoying fresh air and natural light.
              </p>
              <Link href="/about">
                <Button variant="outline">Learn About Om <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {NET_BENEFITS.map((b, i) => {
                const Icon = benefitIcons[i] || Shield;
                return (
                  <Card key={b.title} className="flex gap-3">
                    <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{b.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Om Mosquito Nets
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Chennai Customers Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-12 bg-sky-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Visit Us in Thiruverkadu, Chennai
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Walk into our store or call for a free home visit anywhere in Chennai.
              </p>
              <div className="space-y-3 text-slate-300">
                <p className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-sky-400 mt-0.5" />
                  {BUSINESS.address}
                </p>
                <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Phone className="h-5 w-5 text-sky-400" />
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden h-48 md:h-56 bg-slate-800">
              <iframe
                title="Om Mosquito Nets Location"
                src="https://maps.google.com/maps?q=Kamadhenu+Nagar+Thiruverkadu+Chennai&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
