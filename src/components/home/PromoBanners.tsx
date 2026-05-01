import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PromoBanner {
  image: string;
  alt: string;
  title: string;
  cta: string;
  href: string;
}

interface PromoBannersProps {
  variant: "2up" | "3up";
  banners: PromoBanner[];
  className?: string;
}

export default function PromoBanners({
  variant,
  banners,
  className,
}: PromoBannersProps) {
  const count = variant === "2up" ? 2 : 3;
  const displayBanners = banners.slice(0, count);

  return (
    <section
      className={cn("py-6 md:py-8", className)}
      aria-label="Promotional banners"
    >
      <div className="max-w-site mx-auto px-4 md:px-6">
        {/* Grid: 1 col mobile → 2 col sm → 2up or 3up on lg */}
        <div
          className={cn(
            "grid gap-4",
            variant === "2up"
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {displayBanners.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              className="relative overflow-hidden rounded-xl group block"
              aria-label={banner.title}
            >
              {/* Banner image: 200px (2up) or 160px (3up) per DESIGN.md §4.9 */}
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  variant === "2up" ? "h-[160px] sm:h-[200px]" : "h-[140px] sm:h-[160px]"
                )}
              >
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={
                    variant === "2up"
                      ? "(max-width:640px) 100vw, 50vw"
                      : "(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  }
                />
                {/* Bottom gradient for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display font-semibold text-sm sm:text-base leading-tight mb-1.5">
                    {banner.title}
                  </p>
                  <span className="text-[12px] font-medium text-white/90 underline underline-offset-2">
                    {banner.cta} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
