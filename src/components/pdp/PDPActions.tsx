"use client";

import { useState } from "react";
import VariantSelector from "@/components/pdp/VariantSelector";
import StickyAddToCart from "@/components/pdp/StickyAddToCart";
import type { Product } from "@/types";

interface PDPActionsProps {
  product: Product;
}

export default function PDPActions({ product }: PDPActionsProps) {
  const defaultVariant =
    product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  return (
    <div className="space-y-4">
      <VariantSelector
        variants={product.variants}
        selectedVariantId={selectedVariantId}
        onSelect={setSelectedVariantId}
      />

      {isOutOfStock && (
        <p className="text-[13px] font-medium text-accent-red font-body">
          Currently out of stock in the selected option
        </p>
      )}

      <StickyAddToCart
        product={product}
        selectedVariantId={selectedVariantId}
      />
    </div>
  );
}
