"use client";

import { create } from "zustand";
import type { CartState, Product } from "@/types";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product: Product, variantId: string, qty = 1) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.stock === 0) return;

    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.variantId === variantId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id && i.variantId === variantId
              ? { ...i, quantity: Math.min(i.quantity + qty, variant.stock) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            product,
            variantId,
            quantity: qty,
            selectedSize: variant.size,
            selectedColor: variant.color,
          },
        ],
      };
    });
  },

  removeItem: (productId: string, variantId: string) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.id === productId && i.variantId === variantId)
      ),
    }));
  },

  updateQuantity: (productId: string, variantId: string, qty: number) => {
    if (qty < 1) {
      get().removeItem(productId, variantId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId && i.variantId === variantId
          ? { ...i, quantity: qty }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce(
      (sum, i) =>
        sum +
        (i.product.salePrice +
          (i.product.variants.find((v) => v.id === i.variantId)
            ?.additionalPrice ?? 0)) *
          i.quantity,
      0
    ),
}));
