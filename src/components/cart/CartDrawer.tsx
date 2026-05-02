"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import CartItem from "./CartItem";
import PriceSummary from "./PriceSummary";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap & close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-[1100] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-[420px] bg-card z-[1200]",
          "flex flex-col shadow-xl transition-transform duration-300 ease-out outline-none",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-text" />
            <h2 className="text-base font-semibold text-primary-text">
              My Cart
              {items.length > 0 && (
                <span className="ml-1.5 text-sm font-normal text-muted">
                  ({items.reduce((s, i) => s + i.quantity, 0)} item
                  {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary-text transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items — scrollable */}
        <div className="flex-1 overflow-y-auto px-5" aria-live="polite" aria-atomic="false">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <ShoppingCart className="w-16 h-16 text-border-default" />
              <p className="text-base font-medium text-primary-text">Your cart is empty</p>
              <p className="text-sm text-muted text-center">
                Add items to your cart to see them here
              </p>
              <Link
                href="/search"
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={`${item.product.id}-${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer — price summary + CTA */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-border-default">
            <PriceSummary showCheckoutButton />
          </div>
        )}
      </div>
    </>
  );
}
