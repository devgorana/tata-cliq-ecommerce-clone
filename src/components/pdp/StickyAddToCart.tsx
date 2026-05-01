"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Heart, Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { Product } from "@/types";

interface StickyAddToCartProps {
  product: Product;
  selectedVariantId: string;
}

export default function StickyAddToCart({
  product,
  selectedVariantId,
}: StickyAddToCartProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCartStore();
  const { toggleWishlist, user } = useAuthStore();

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );
  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;
  const isWishlisted = user?.wishlistIds.includes(product.id) ?? false;
  const price =
    product.salePrice + (selectedVariant?.additionalPrice ?? 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariantId);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {/* Desktop Inline Buttons */}
      <div className="hidden md:flex flex-col gap-3">
        {/* Price Block */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[26px] font-bold font-body text-primary-text">
            {formatCurrency(price)}
          </span>
          {product.mrp > product.salePrice && (
            <>
              <span className="text-[16px] text-muted font-body line-through">
                {formatCurrency(product.mrp)}
              </span>
              <span className="text-[15px] font-medium font-body text-accent-red">
                {product.discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? "Out of stock"
                : addedToCart
                ? "Added to cart"
                : "Add to cart"
            }
            className={cn(
              "flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 font-semibold font-body text-[15px] transition-all duration-200",
              isOutOfStock
                ? "border-border-default text-muted cursor-not-allowed"
                : addedToCart
                ? "border-success bg-success text-white"
                : "border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
            )}
          >
            {addedToCart ? (
              <Check size={18} />
            ) : (
              <ShoppingCart size={18} />
            )}
            {isOutOfStock
              ? "Out of Stock"
              : addedToCart
              ? "Added!"
              : "Add to Cart"}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Buy now"
            className={cn(
              "flex-1 h-12 flex items-center justify-center gap-2 rounded-lg font-semibold font-body text-[15px] transition-all duration-200",
              isOutOfStock
                ? "bg-border-default text-muted cursor-not-allowed"
                : "bg-accent-red text-white hover:bg-red-700"
            )}
          >
            <Zap size={18} />
            Buy Now
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="flex items-center justify-center gap-2 h-10 border border-border-default rounded-lg text-[13px] font-medium font-body text-primary-text hover:border-accent-red hover:text-accent-red transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              isWishlisted && "fill-accent-red text-accent-red"
            )}
          />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
      </div>

      {/* Mobile Sticky Bar — sits above bottom nav */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-card border-t border-border-default shadow-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[18px] font-bold font-body text-primary-text">
                {formatCurrency(price)}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-[12px] font-medium font-body text-accent-red">
                  {product.discountPercent}% off
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="w-11 h-11 rounded-lg border border-border-default flex items-center justify-center flex-shrink-0"
          >
            <Heart
              size={18}
              className={cn(
                isWishlisted && "fill-accent-red text-accent-red"
              )}
            />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            className={cn(
              "flex-1 h-11 rounded-lg flex items-center justify-center gap-1.5 font-semibold font-body text-[14px] transition-all duration-200 min-w-[120px]",
              isOutOfStock
                ? "bg-border-default text-muted cursor-not-allowed"
                : addedToCart
                ? "bg-success text-white"
                : "bg-accent-red text-white"
            )}
          >
            {addedToCart ? <Check size={16} /> : <ShoppingCart size={16} />}
            {isOutOfStock
              ? "Out of Stock"
              : addedToCart
              ? "Added!"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}
