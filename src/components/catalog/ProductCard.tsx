"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { user, toggleWishlist } = useAuthStore();
  const { addItem } = useCartStore();

  const isWishlisted = user?.wishlistIds.includes(product.id) ?? false;
  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const firstInStockVariant = product.variants.find((v) => v.stock > 0) ?? product.variants[0];

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (firstInStockVariant) addItem(product, firstInStockVariant.id);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div
        className="relative bg-card rounded-lg overflow-hidden border border-border-default transition-shadow duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-300",
              isHovered && "scale-[1.03]"
            )}
          />

          {/* Badge top-left */}
          {product.discountPercent > 0 ? (
            <span className="absolute top-2 left-2 bg-accent-red text-white text-[10px] font-medium font-body px-2 py-0.5 rounded-full tracking-wider uppercase">
              {product.discountPercent}% OFF
            </span>
          ) : (
            <span className="absolute top-2 left-2 bg-primary-navy text-white text-[10px] font-medium font-body px-2 py-0.5 rounded-full tracking-wider uppercase">
              New
            </span>
          )}

          {/* Wishlist heart top-right */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              isWishlisted && "opacity-100"
            )}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors duration-200",
                isWishlisted ? "fill-accent-red text-accent-red" : "text-muted"
              )}
            />
          </button>

          {/* Quick View slides up on hover */}
          <button
            onClick={handleQuickAdd}
            aria-label="Quick add to cart"
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-primary-navy/90 text-white text-xs font-medium font-body py-2.5 flex items-center justify-center gap-1.5 transition-all duration-300",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}
          >
            <Eye size={14} />
            Quick Add
          </button>
        </div>

        {/* Info Block */}
        <div className="p-3">
          <p className="text-[10px] font-medium font-body tracking-widest uppercase text-muted mb-0.5 truncate sm:text-[11px]">
            {product.brand}
          </p>
          <h3 className="text-[13px] font-medium font-body text-primary-text line-clamp-2 mb-1.5 leading-tight sm:text-[14px]">
            {product.name}
          </h3>

          {/* Price Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[14px] font-semibold font-body text-primary-text">
              {formatCurrency(product.salePrice)}
            </span>
            {product.mrp > product.salePrice && (
              <>
                <span className="text-[12px] font-body text-muted line-through">
                  {formatCurrency(product.mrp)}
                </span>
                <span className="text-[12px] font-medium font-body text-accent-red">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex items-center gap-0.5 bg-success px-1.5 py-0.5 rounded">
                <span className="text-[11px] font-medium text-white">{product.avgRating}</span>
                <Star size={10} className="fill-white text-white" />
              </div>
              <span className="text-[11px] text-muted font-body">
                ({product.ratingsCount.toLocaleString()})
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
