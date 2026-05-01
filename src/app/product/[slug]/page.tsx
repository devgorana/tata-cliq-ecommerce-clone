import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, mockProducts } from "@/data/mock-catalog";
import ImageGallery from "@/components/pdp/ImageGallery";
import ReviewsSection from "@/components/pdp/ReviewsSection";
import DeliveryEstimate from "@/components/pdp/DeliveryEstimate";
import EMICalculator from "@/components/pdp/EMICalculator";
import PDPActions from "@/components/pdp/PDPActions";
import CLiQPromise from "@/components/pdp/CLiQPromise";
import OfferTags from "@/components/pdp/OfferTags";
import NeuCoins from "@/components/pdp/NeuCoins";
import type { Product } from "@/types";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <PDPContent product={product} />;
}

function PDPContent({ product }: { product: Product }) {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-[12px] font-body text-muted mb-4 flex-wrap"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-accent-red transition-colors">
            Home
          </Link>
          {product.categoryPath.map((crumb) => (
            <span key={crumb.slug} className="flex items-center gap-1.5">
              <span aria-hidden="true">/</span>
              <Link
                href={`/search?category=${crumb.slug}`}
                className="hover:text-accent-red transition-colors capitalize"
              >
                {crumb.label}
              </Link>
            </span>
          ))}
          <span aria-hidden="true">/</span>
          <span className="text-primary-text truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* 2-column layout: 55% image | 45% info */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
          {/* Left: Image Gallery */}
          <div className="w-full md:w-[55%]">
            <ImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-[45%] space-y-4">
            {/* Brand */}
            <Link
              href={`/search?brand=${encodeURIComponent(product.brand)}`}
              className="text-[12px] font-body font-semibold uppercase tracking-widest text-accent-red hover:underline"
            >
              {product.brand}
            </Link>

            {/* Title */}
            <h1 className="text-[20px] md:text-[24px] font-display font-semibold text-primary-text leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            {product.avgRating > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="flex items-center gap-1 bg-success px-2.5 py-1 rounded"
                  aria-label={`${product.avgRating} stars`}
                >
                  <span className="text-[13px] font-semibold text-white">
                    {product.avgRating}
                  </span>
                  <span className="text-white text-[13px]" aria-hidden="true">
                    ★
                  </span>
                </div>
                <span className="text-[13px] text-muted font-body">
                  {product.ratingsCount.toLocaleString()} ratings
                </span>
                {product.authenticityGuaranteed && (
                  <span className="text-[11px] font-medium text-success font-body">
                    ✓ Genuine Product
                  </span>
                )}
              </div>
            )}

            {/* NeuCoins */}
            <NeuCoins price={product.salePrice} />

            {/* Offers */}
            <OfferTags />

            {/* Variant Selector + Price + CTA Buttons */}
            <PDPActions product={product} />

            {/* Delivery Estimate */}
            <DeliveryEstimate />

            {/* CLiQ Promise */}
            <CLiQPromise />

            {/* EMI Calculator */}
            <EMICalculator price={product.salePrice} />

            {/* Product Description (collapsible) */}
            <details className="group border border-border-default rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-card text-[13px] font-semibold font-body text-primary-text list-none">
                Product Description
                <span
                  className="text-muted transition-transform duration-200 group-open:rotate-180 text-[16px]"
                  aria-hidden="true"
                >
                  ▾
                </span>
              </summary>
              <div className="px-4 py-3 bg-surface border-t border-border-default">
                <p className="text-[13px] font-body text-primary-text leading-relaxed">
                  {product.description}
                </p>

                {Object.keys(product.specifications).length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold font-body text-muted uppercase tracking-wider mb-3">
                      Specifications
                    </p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, val]) => (
                          <div key={key}>
                            <dt className="text-[11px] font-body text-muted">
                              {key}
                            </dt>
                            <dd className="text-[12px] font-medium font-body text-primary-text">
                              {val}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection product={product} />
      </div>
    </div>
  );
}
