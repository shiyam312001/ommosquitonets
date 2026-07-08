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
  Mail,
  MessageCircle,
  Share2,
  Video,
  HeartPulse,
  IndianRupee,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import CategoryCard from "@/components/categories/CategoryCard";
import NetSystemsSection from "@/components/home/NetSystemsSection";
import { FEATURED_SLUGS } from "@/lib/constants";
import VideoCard from "@/components/home/VideoCard";
import { getCategories, categoryToSystem } from "@/lib/categories";
import { getInstagramVideos } from "@/lib/instagram";
import { NET_BENEFITS } from "@/lib/categories-content";
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
  const [categories, instagramVideos] = await Promise.all([
    getCategories(),
    getInstagramVideos(),
  ]);

  const rootCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const featuredRoots = FEATURED_SLUGS.map((slug) =>
    rootCategories.find((c) => c.slug === slug)
  ).filter(Boolean);

  const productSystems = (featuredRoots.length ? featuredRoots : rootCategories)
    .slice(0, 4)
    .map(categoryToSystem);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Chennai&apos;s Smart Way to{" "}
                <span className="text-sky-500">Keep Insects Out</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-lg">
                Pleated, roller, magnetic & openable mosquito nets for doors, windows,
                balconies & beds. Measured, made & installed by our team — chemical-free
                protection for your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/categories">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-sky-500/20">
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
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50">
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

      <NetSystemsSection systems={productSystems} />

      {/* Instagram Video Gallery */}
      <VideoCard videos={instagramVideos} />

      {/* Categories */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Browse by Category
              </h2>
              <p className="text-slate-600">
                Door nets, window rollers, pleated balconies, magnetic mesh & more
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1 text-sky-600 font-medium hover:text-sky-700 hover:gap-2 transition-all"
            >
              All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {rootCategories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Why mosquito nets */}
      <section className="py-16 md:py-20 bg-slate-50">
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
                  <Card key={b.title} className="flex gap-3 border-0 shadow-sm">
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
      <section className="py-16 md:py-20 bg-white">
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
                <Card key={f.title} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
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
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Chennai Customers Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-md">
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            {/* Store info */}
            <div className="min-w-0 md:max-w-[50%]">
            
              <div className="space-y-3 text-slate-300">
                <p className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-sky-400 mt-0.5" aria-hidden="true" />
                  {BUSINESS.address}
                </p>
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center gap-2 hover:text-sky-400 transition-colors w-fit"
                >
                  <Phone className="h-5 w-5 text-sky-400" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
              </div>
            </div>

            {/* Connect / social icons */}
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-white mb-4">Connect With Us</h3>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  aria-label="Call us"
                  title="Call"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-sky-500 hover:ring-sky-400 transition-all"
                >
                  <Phone className="h-5 w-5 text-sky-400 group-hover:text-white transition-colors" aria-hidden="true" />
                </a>

                {BUSINESS.whatsapp && (
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Message us on WhatsApp"
                    title="WhatsApp"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-emerald-500 hover:ring-emerald-400 transition-all"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" aria-hidden="true" />
                  </a>
                )}

                {BUSINESS.instagram && (
                  <a
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    title="Instagram"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-pink-500 hover:ring-pink-400 transition-all"
                  >
                    <Share2 className="h-5 w-5 text-pink-400 group-hover:text-white transition-colors" aria-hidden="true" />
                  </a>
                )}

                {BUSINESS.youtube && (
                  <a
                    href={BUSINESS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe on YouTube"
                    title="YouTube"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-red-500 hover:ring-red-400 transition-all"
                  >
                    <Video className="h-5 w-5 text-red-400 group-hover:text-white transition-colors" aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-400">{BUSINESS.email}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
         