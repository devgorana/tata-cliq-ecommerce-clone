"use client";

import Link from "next/link";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartItem from "@/components/cart/CartItem";
import PriceSummary from "@/components/cart/PriceSummary";

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-site mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-accent-red transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-text font-medium">My Cart</span>
        </nav>

        <h1 className="font-display text-h1 text-primary-text mb-6">
          My Cart
          {items.length > 0 && (
            <span className="ml-2 text-base font-body font-normal text-muted">
              ({items.reduce((s, i) => s + i.quantity, 0)} item
              {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <ShoppingCart className="w-20 h-20 text-border-default" />
            <p className="text-xl font-semibold text-primary-text">Your cart is empty</p>
            <p className="text-sm text-muted text-center max-w-xs">
              Looks like you haven&apos;t added anything yet. Start shopping to fill it up!
            </p>
            <Link
              href="/search"
              className="mt-2 px-8 py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Cart items */}
            <div className="bg-card rounded-lg border border-border-default px-5">
              {items.map((item) => (
                <CartItem key={`${item.product.id}-${item.variantId}`} item={item} />
              ))}
            </div>

            {/* Price summary — sticky on desktop */}
            <div className="lg:sticky lg:top-24">
              <PriceSummary showCheckoutButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
