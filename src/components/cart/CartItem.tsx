"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const variant = item.product.variants.find((v) => v.id === item.variantId);
  const unitPrice = item.product.salePrice + (variant?.additionalPrice ?? 0);
  const lineTotal = unitPrice * item.quantity;

  return (
    <div className="flex gap-3 py-4 border-b border-border-default last:border-0">
      {/* Product image */}
      <div className="relative w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-surface">
        <Image
          src={item.product.images.find((img) => img.isMain)?.url ?? item.product.images[0]?.url ?? "/placeholder.jpg"}
          alt={item.product.images.find((img) => img.isMain)?.alt ?? item.product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted mb-0.5">
          {item.product.brand}
        </p>
        <p className="text-sm font-medium text-primary-text line-clamp-2 leading-snug">
          {item.product.name}
        </p>

        {/* Variant details */}
        {(item.selectedSize || item.selectedColor) && (
          <div className="flex gap-2 mt-1">
            {item.selectedSize && (
              <span className="text-xs text-muted">
                Size: <span className="text-primary-text font-medium">{item.selectedSize}</span>
              </span>
            )}
            {item.selectedColor && (
              <span className="text-xs text-muted">
                Color: <span className="text-primary-text font-medium">{item.selectedColor}</span>
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-primary-text">
            {formatCurrency(unitPrice)}
          </span>
          {item.product.mrp > item.product.salePrice && (
            <>
              <span className="text-xs text-muted line-through">
                {formatCurrency(item.product.mrp)}
              </span>
              <span className="text-xs font-medium text-accent-red">
                {item.product.discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* Qty stepper + remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-border-default rounded-md overflow-hidden">
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.variantId, item.quantity - 1)
              }
              className="w-8 h-8 flex items-center justify-center text-primary-text hover:bg-surface transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-primary-text border-x border-border-default">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.variantId, item.quantity + 1)
              }
              className="w-8 h-8 flex items-center justify-center text-primary-text hover:bg-surface transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
              disabled={item.quantity >= (variant?.stock ?? 1)}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.product.id, item.variantId)}
            className="flex items-center gap-1 text-xs text-muted hover:text-accent-red transition-colors min-h-[44px] px-2"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold text-primary-text">
          {formatCurrency(lineTotal)}
        </p>
      </div>
    </div>
  );
}
