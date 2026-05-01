import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedProducts,
  getFlashSaleProducts,
  getProductsByCategory,
} from "@/data/mock-catalog";
import { formatCurrency } from "@/lib/utils";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryBanners from "@/components/home/CategoryBanners";
import FlashSaleModule from "@/components/home/FlashSaleModule";
import PromoBanners from "@/components/home/PromoBanners";
import SectionHeader from "@/components/home/SectionHeader";

// ─── Static promo banner data ──────────────────────────────────────────────────

const PROMO_2UP = [
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    alt: "Women's fashion sale",
    title: "Women's Fashion — Up to 50% Off",
    cta: "Shop Women",
    href: "/search?category=fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Men's fashion sale",
    title: "Men's Edit — New Season Styles",
    cta: "Shop Men",
    href: "/search?category=fashion",
  },
];

const PROMO_3UP = [
  {
    image:
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80",
    alt: "Summer essentials",
    title: "Summer Essentials",
    cta: "Explore",
    href: "/search?category=fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    alt: "Tech deals",
    title: "Tech Deals — Up to 30% Off",
    cta: "Shop Electronics",
    href: "/search?category=electronics",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    alt: "Luxury edit",
    title: "The Luxury Edit",
    cta: "Shop Luxury",
    href: "/search?category=luxury",
  },
];

const BRANDS = [
  "Zara", "H&M", "Levi's", "Tommy Hilfiger", "Nike",
  "Adidas", "Apple", "Samsung", "Ray-Ban", "Coach",
];

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function HomePage() {
  const flashSaleProducts = getFlashSaleProducts();
  const featuredProducts = getFeaturedProducts(8);
  const saleProducts = getProductsByCategory("fashion")
    .filter((p) => p.discountPercent >= 30)
    .slice(0, 8);

  return (
    <>
      {/* 3. Hero Carousel */}
      <HeroCarousel />

      {/* 4. Category Shortcut Strip */}
      <CategoryBanners />

      {/* 5. New Arrivals */}
      <section className="py-8 md:py-10 bg-surface">
        <div className="max-w-site mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="Just In"
            title="New Arrivals"
            viewAllHref="/search"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map((product) => {
              const img =
                product.images.find((i) => i.isMain) ?? product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-card rounded-lg overflow-hidden border border-border-default hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                    {product.discountPercent > 0 && (
                      <span className="absolute top-2 left-2 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[10px] font-medium text-muted uppercase tracking-widest truncate">
                      {product.brand}
                    </p>
                    <p className="text-xs font-medium text-primary-text line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-primary-text">
                        {formatCurrency(product.salePrice)}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-[11px] text-muted line-through">
                          {formatCurrency(product.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. 2-up Promo Banners (Women's | Men's) */}
      <PromoBanners variant="2up" banners={PROMO_2UP} className="bg-card" />

      {/* 7. Top Brands */}
      <section className="py-8 md:py-10 bg-surface border-y border-border-default">
        <div className="max-w-site mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="Authenticity Guaranteed" title="Top Brands" />
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/search?brand=${encodeURIComponent(brand)}`}
                className="flex-shrink-0 flex items-center justify-center w-[140px] md:w-[160px] h-[70px] md:h-[80px] bg-card border border-border-default rounded-md hover:border-accent-red transition-colors duration-150 group"
              >
                <span className="text-sm font-semibold text-muted group-hover:text-accent-red transition-colors">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trending Now — horizontal scroll product row */}
      <section className="py-8 md:py-10 bg-card">
        <div className="max-w-site mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="What's Hot"
            title="Trending Now"
            viewAllHref="/search"
          />
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {featuredProducts.map((product) => {
              const img =
                product.images.find((i) => i.isMain) ?? product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex-shrink-0 w-[150px] sm:w-[170px] md:w-[190px] group"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface mb-2">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="190px"
                    />
                  </div>
                  <p className="text-[10px] font-medium text-muted uppercase tracking-widest truncate">
                    {product.brand}
                  </p>
                  <p className="text-xs font-medium text-primary-text line-clamp-2 mt-0.5 leading-snug">
                    {product.name}
                  </p>
                  <span className="text-sm font-semibold text-primary-text">
                    {formatCurrency(product.salePrice)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Flash Sale */}
      <FlashSaleModule products={flashSaleProducts} />

      {/* 9b. 3-up Promo Banners */}
      <PromoBanners variant="3up" banners={PROMO_3UP} className="bg-surface" />

      {/* 10. Sale Picks */}
      <section className="py-8 md:py-10 bg-card">
        <div className="max-w-site mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="Best Deals"
            title="Sale Picks"
            viewAllHref="/search"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {saleProducts.map((product) => {
              const img =
                product.images.find((i) => i.isMain) ?? product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-card rounded-lg overflow-hidden border border-border-default hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                    <span className="absolute top-2 left-2 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      -{product.discountPercent}%
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[10px] font-medium text-muted uppercase tracking-widest truncate">
                      {product.brand}
                    </p>
                    <p className="text-xs font-medium text-primary-text line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-primary-text">
                        {formatCurrency(product.salePrice)}
                      </span>
                      <span className="text-[11px] text-muted line-through">
                        {formatCurrency(product.mrp)}
                      </span>
                      <span className="text-[11px] font-medium text-accent-red">
                        {product.discountPercent}% off
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Editorial / Lifestyle Banner */}
      <section className="relative h-[200px] sm:h-[260px] md:h-[320px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1440&q=80"
          alt="Shop the CLiQ lifestyle"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center px-4">
          <p className="text-[11px] font-medium text-white/75 uppercase tracking-widest mb-2">
            The CLiQ Way
          </p>
          <h2 className="font-display font-bold text-xl sm:text-3xl md:text-4xl text-white mb-4">
            Magic &amp; Joy in Shopping
          </h2>
          <Link
            href="/search"
            className="inline-block bg-white text-primary-text text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-surface transition-colors duration-200"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Bottom spacing for mobile nav */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
