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
  HeartPulse,
  IndianRupee,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import CategoryCard from "@/components/categories/CategoryCard";
import NetSystemsSection from "@/components/home/NetSystemsSection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
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
    name: "Surender Babu",
    location: "Anna Nagar, Chennai",
    rating: 5,
    text: "I recently Installed a mosquito net from a vendor named Muthu. He did excellent work, and the quality is also very good. My mom was very happy with the work. I highly recommend him to my friends and circle as well.",
    highlights: ["excellent work", "quality", "highly recommend"],
  },
  {
    name: "Kalyani PD",
    location: "Velachery, Chennai",
    rating: 5,
    text: "l am very much satisfied with the service, quality and cost provided by om mosquito nets.we put mosquito nets in our house 2 years back, my front door became loosen due to usage of many no. of times, immediately I called Muthu (Om nets)he came and modified very well and gave free service which was very much satisfied.",
    highlights: ["satisfied", "quality", "free service"],
  },
  {
    name: "Sharmila Queenthy",
    location: "Thiruverkadu",
    rating: 5,
    text: "Excellent Service ! The team was polite and installed mosquito nets for all windows and doors in 3 hours. Neat work, no mess, and very reasonable price. Quality of mesh and frame is strong. Highly recommend!",
    highlights: ["Excellent Service", "reasonable price", "Highly recommend"],
  },
  {
    name: "Kalayarasi Arvind",
    location: "Avadi, Chennai",
    rating: 5,
    text: "I am very happy with the mosquito net fitting service. The team was professional, arrived on time, and completed the Installation neatly. The quality of the mosquito net is excellent, and the fitting is perfect. It keeps mosquitoes out while allowing fresh air to come in. The staff were polite, and the overall service was worth the price. Highly recommended to anyone looking for quality mosquito net installation!",
    highlights: ["professional", "excellent", "perfect", "Highly recommended"],
  },
];

export default async function HomePage() {
  const [categories, instagramVideos] = await Promise.all([
    getCategories(),
    getInstagramVideos(),
  ]);
function highlightText(text, keywords) {
  if (!keywords?.length) return text;
  const pattern = new RegExp(`(${keywords.join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} className="font-semibold text-sky-600">
        {part}
      </span>
    ) : (
      part
    )
  );
}

const highlightedTestimonials = testimonials.map((t) => ({
  ...t,
  text: highlightText(t.text, t.highlights),
}));
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
                <span className="block mb-2">Protect Your Home Without Compromising Fresh Air</span>
                Experience premium mosquito net solutions designed to keep insects out while allowing fresh air and natural light to flow freely. We provide durable, elegant, and customized mosquito net installations for windows, doors, balconies, and ventilators that blend perfectly with your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                <div className="flex items-center gap-3">
                  {BUSINESS.whatsapp && (
                    <a
                      href={BUSINESS.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Message us on WhatsApp"
                      title="WhatsApp"
                      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all hover:ring-white/30"
                    >
                      <span className="absolute inset-0 rounded-full bg-green-400/40 animate-ping [animation-duration:2s]" />
                      <Image
                        src="/whatsapp.jpg"
                        alt="WhatsApp"
                        width={48}
                        height={48}
                        className="relative h-11 w-11 rounded-full object-cover"
                      />
                    </a>
                  )}

                  {BUSINESS.instagram && (
                    <a
                      href={BUSINESS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      title="Instagram"
                      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all hover:ring-white/30"
                    >
                      <span className="absolute inset-0 rounded-full bg-pink-400/40 animate-ping [animation-duration:2s]" />
                      <Image
                        src="/instagram.jpg"
                        alt="Instagram"
                        width={48}
                        height={48}
                        className="relative h-11 w-11 rounded-full object-cover"
                      />
                    </a>
                  )}

                  {BUSINESS.facebook && (
                    <a
                      href={BUSINESS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                      title="Facebook"
                      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all hover:ring-white/30"
                    >
                      <span className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping [animation-duration:2s]" />
                      <Image
                        src="/fb.avif"
                        alt="Facebook"
                        width={48}
                        height={48}
                        className="relative h-11 w-11 rounded-full object-cover"
                      />
                    </a>
                  )}

                  {BUSINESS.youtube && (
                    <a
                      href={BUSINESS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Subscribe on YouTube"
                      title="YouTube"
                      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all hover:ring-white/30"
                    >
                      <span className="absolute inset-0 rounded-full bg-red-400/40 animate-ping [animation-duration:2s]" />
                      <Image
                        src="/youtube.png"
                        alt="YouTube"
                        width={48}
                        height={48}
                        className="relative h-11 w-11 rounded-full object-cover"
                      />
                    </a>
                  )}
                </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
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
          <div className="mx-auto max-w-6xl">
<TestimonialsCarousel testimonials={highlightedTestimonials} />          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-12 bg-sky-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex h-full w-full items-center justify-center">
                <Link href="/" className="block w-full">
                  <Image
                    src="/footer.png"
                    alt="Om Mosquito Nets"
                    width={250}
                    height={100}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-display text-white text-lg font-semibold mb-4">Quick Links</h3>
              <div className="grid gap-3 text-sm">
                <Link href="/" className="block hover:text-white transition-colors">Home</Link>
                <Link href="/categories" className="block hover:text-white transition-colors">Categories</Link>
                <Link href="/products" className="block hover:text-white transition-colors">Products</Link>
                <Link href="/about" className="block hover:text-white transition-colors">About Us</Link>
              </div>
            </div>

            <div>
              <h3 className="font-display text-white text-lg font-semibold mb-4">Address</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 text-sky-400" aria-hidden="true" />
                  {BUSINESS.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-400" aria-hidden="true" />
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-white transition-colors">{BUSINESS.phone}</a>
                </p>
                <p>{BUSINESS.email}</p>
              </div>
            </div>

             <div className="flex flex-col sm:flex-row gap-4">
                 <div className="flex items-center gap-3">

                {BUSINESS.whatsapp && (
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Message us on WhatsApp"
                    title="WhatsApp"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-emerald-500 hover:ring-emerald-400 transition-all"
                  >
                    <Image
                      src="/whatsapp.jpg"
                      alt="WhatsApp"
                      width={24}
                      height={24}
                      className="h-5 w-5 rounded-full object-cover"
                    />
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
                    <Image
                      src="/instagram.jpg"
                      alt="Instagram"
                      width={24}
                      height={24}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  </a>
                )}

                {BUSINESS.facebook && (
                  <a
                    href={BUSINESS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                    title="Facebook"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-blue-600 hover:ring-blue-500 transition-all"
                  >
                    <Image
                      src="/fb.avif"
                      alt="Facebook"
                      width={24}
                      height={24}
                      className="h-5 w-5 rounded-full object-cover"
                    />
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
                    <Image
                      src="/youtube.png"
                      alt="YouTube"
                      width={24}
                      height={24}
                      className="h-auto w-[70px] rounded-full object-contain"
                    />
                  </a>
                )}
                

              </div>
              </div>
          </div>
        </div>
      </section>
    </>
  );
}
         