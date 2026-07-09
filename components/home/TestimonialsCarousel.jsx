"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card } from "@/components/ui";

export default function TestimonialsCarousel({ testimonials }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const visibleTestimonials = Array.from({ length: 3 }, (_, offset) => {
    const index = (activeIndex + offset) % testimonials.length;
    return testimonials[index];
  });

  const goTo = (index) => setActiveIndex(index);
  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="grid gap-6 md:grid-cols-3"
          style={{ animation: "testimonialSlide 0.5s ease-out" }}
        >
          {visibleTestimonials.map((testimonial, index) => (
            <Card key={`${testimonial.name}-${index}`} className="h-full border-0 shadow-md">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">&ldquo;{testimonial.text}&rdquo;</p>
              <div>
                <p className="font-medium text-slate-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-slate-400">{testimonial.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-sky-500" : "w-2.5 bg-slate-300"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes testimonialSlide {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
