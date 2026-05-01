"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    eyebrow: "NEW ARRIVALS",
    headline: "The Summer\nCollection",
    subtext: "Fresh styles for the season — up to 40% off",
    cta: "Shop Women",
    href: "/search?category=fashion",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1440&q=80",
    alt: "Women's summer fashion collection",
  },
  {
    id: 2,
    eyebrow: "MEN'S EDIT",
    headline: "Sharp. Bold.\nUnderstated.",
    subtext: "Curated menswear from top international brands",
    cta: "Shop Men",
    href: "/search?category=fashion",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1440&q=80",
    alt: "Men's fashion collection",
  },
  {
    id: 3,
    eyebrow: "TECH ESSENTIALS",
    headline: "Power Your\nWorld",
    subtext: "The latest gadgets — smartphones, laptops & more",
    cta: "Shop Electronics",
    href: "/search?category=electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1440&q=80",
    alt: "Electronics and gadgets",
  },
  {
    id: 4,
    eyebrow: "LUXURY AWAITS",
    headline: "Wear the\nExtraordinary",
    subtext: "Authentic luxury watches, bags & accessories",
    cta: "Shop Luxury",
    href: "/search?category=luxury",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1440&q=80",
    alt: "Luxury fashion and accessories",
  },
  {
    id: 5,
    eyebrow: "MEGA SALE",
    headline: "Up to 60%\nOff Everything",
    subtext: "Limited time offer — shop now before it ends",
    cta: "Shop Sale",
    href: "/search",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1440&q=80",
    alt: "Fashion mega sale event",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  );
  const goPrev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [paused, goNext]);

  return (
    <section
      className="relative w-full overflow-hidden h-[240px] sm:h-[320px] md:h-[400px] lg:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Promotional banners"
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${idx + 1} of ${SLIDES.length}: ${slide.headline.replace("\n", " ")}`}
          aria-hidden={idx !== current}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={idx === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

          {/* Text block — bottom-left per DESIGN.md §4.4 */}
          <div className="absolute bottom-6 left-5 sm:bottom-8 sm:left-10 lg:bottom-10 lg:left-14 max-w-xs sm:max-w-sm md:max-w-md">
            <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.12em] text-white/80 uppercase mb-1.5 sm:mb-2">
              {slide.eyebrow}
            </p>
            <h2 className="font-display font-bold text-xl sm:text-3xl md:text-4xl lg:text-[42px] text-white leading-tight whitespace-pre-line mb-2 sm:mb-3 md:mb-4">
              {slide.headline}
            </h2>
            <p className="hidden sm:block text-sm text-white/75 mb-4 md:mb-5">
              {slide.subtext}
            </p>
            <Link
              href={slide.href}
              className="inline-block bg-accent-red text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-md transition-all duration-200 hover:bg-opacity-90 active:scale-[0.97]"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Prev / Next chevrons */}
      <button
        onClick={goPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-1.5 sm:p-2 transition-all duration-200 min-w-[36px] min-h-[36px] flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-1.5 sm:p-2 transition-all duration-200 min-w-[36px] min-h-[36px] flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === current}
            className={cn(
              "rounded-full transition-all duration-300",
              idx === current
                ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-white"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>
    </section>
  );
}
