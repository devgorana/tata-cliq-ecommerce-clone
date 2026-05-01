"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface FlashSaleModuleProps {
  products: Product[];
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function FlashSaleModule({ products }: FlashSaleModuleProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 1,
    minutes: 59,
    seconds: 47,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds =
          prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          return { hours: 1, minutes: 59, seconds: 59 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      className="py-6 md:py-8 bg-card border-y border-border-default"
      aria-label="Flash sale"
    >
      <div className="max-w-site mx-auto px-4 md:px-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-accent-red rounded-lg p-1.5">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-accent-red uppercase tracking-widest">
                Limited Time
              </p>
              <h2 className="font-display font-semibold text-h2 text-primary-text leading-tight">
                Flash Sale
              </h2>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-1" aria-label={`Ends in ${timeLeft.hours} hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`}>
            <span className="text-[11px] text-muted font-medium mr-1 hidden sm:block">
              Ends in
            </span>
            {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map(
              (unit, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-primary-text text-white text-xs sm:text-sm font-bold rounded px-2 py-1 tabular-nums min-w-[30px] text-center">
                    {unit}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-primary-text font-bold text-sm">:</span>
                  )}
                </span>
              )
            )}
          </div>
        </div>

        {/* Product scroll row */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] group"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface mb-2">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="180px"
                  />
                  {/* Discount badge */}
                  <span className="absolute top-2 left-2 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    -{product.discountPercent}%
                  </span>
                </div>

                {/* Info */}
                <p className="text-[10px] font-medium text-muted uppercase tracking-widest truncate mb-0.5">
                  {product.brand}
                </p>
                <p className="text-xs font-medium text-primary-text line-clamp-2 mb-1 leading-tight">
                  {product.name}
                </p>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-primary-text">
                    {formatCurrency(product.salePrice)}
                  </span>
                  <span className="text-[11px] text-muted line-through">
                    {formatCurrency(product.mrp)}
                  </span>
                </div>

                {/* Stock progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-muted mb-1">
                    <span>Selling fast</span>
                  </div>
                  <div className="h-1 bg-border-default rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-accent-red rounded-full",
                        product.discountPercent >= 40 ? "w-4/5" :
                        product.discountPercent >= 30 ? "w-3/5" : "w-2/5"
                      )}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/search"
            className="inline-block text-sm font-semibold text-accent-red border border-accent-red px-6 py-2.5 rounded-md hover:bg-accent-red hover:text-white transition-colors duration-200"
          >
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
