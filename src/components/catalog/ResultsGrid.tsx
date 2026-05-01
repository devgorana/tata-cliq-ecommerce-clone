"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/catalog/ProductCard";

const PAGE_SIZE = 12;

function SkeletonCard() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border-default animate-pulse">
      <div className="aspect-[3/4] bg-surface" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-surface rounded w-16" />
        <div className="h-3 bg-surface rounded w-full" />
        <div className="h-3 bg-surface rounded w-3/4" />
        <div className="h-4 bg-surface rounded w-24 mt-1" />
      </div>
    </div>
  );
}

export default function ResultsGrid() {
  const { products, total } = useProducts();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[40px] mb-4">🔍</p>
        <p className="text-[18px] font-semibold font-body text-primary-text mb-2">
          No products found
        </p>
        <p className="text-[14px] text-muted font-body">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] text-muted font-body mb-4">
        Showing{" "}
        <span className="font-medium text-primary-text">
          {Math.min(visibleCount, total)}
        </span>{" "}
        of{" "}
        <span className="font-medium text-primary-text">{total}</span> products
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Skeleton placeholders to maintain grid shape during interaction */}
        {visibleProducts.length < 4 &&
          Array.from({ length: 4 - visibleProducts.length }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="h-11 px-8 border-2 border-accent-red text-accent-red font-semibold font-body text-[14px] rounded-lg hover:bg-accent-red hover:text-white transition-all duration-200"
          >
            Load More ({products.length - visibleCount} remaining)
          </button>
          <p className="text-[12px] text-muted font-body">
            Showing {Math.min(visibleCount, total)} of {total}
          </p>
        </div>
      )}
    </div>
  );
}
