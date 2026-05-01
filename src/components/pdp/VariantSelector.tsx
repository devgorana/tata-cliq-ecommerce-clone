"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  const hasSizes = variants.some((v) => v.size);
  const hasColors = variants.some((v) => v.color);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  // Unique colors
  const colorVariants = hasColors
    ? variants.filter(
        (v, idx, arr) => arr.findIndex((x) => x.color === v.color) === idx
      )
    : [];

  // Sizes for the selected colour (or all if no colour)
  const selectedColor = selectedVariant?.color;
  const sizeVariants = hasSizes
    ? variants.filter((v) => !hasColors || v.color === selectedColor)
    : [];

  const handleColorSelect = (color: string) => {
    const first = variants.find((v) => v.color === color && v.stock > 0) ??
      variants.find((v) => v.color === color);
    if (first) onSelect(first.id);
  };

  return (
    <div className="space-y-4">
      {/* Colour Swatches */}
      {hasColors && colorVariants.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-semibold font-body text-primary-text">
              Colour
            </span>
            <span className="text-[13px] font-body text-muted">
              {selectedVariant?.color}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((v) => {
              const isSelected =
                selectedVariant?.color === v.color;
              const isOutOfStock = variants
                .filter((x) => x.color === v.color)
                .every((x) => x.stock === 0);

              return (
                <button
                  key={v.id}
                  onClick={() =>
                    !isOutOfStock && handleColorSelect(v.color ?? "")
                  }
                  aria-label={`Colour: ${v.color}${isOutOfStock ? " (out of stock)" : ""}`}
                  disabled={isOutOfStock}
                  title={v.color}
                  className={cn(
                    "w-9 h-9 rounded-full border-2 transition-all duration-200",
                    isSelected
                      ? "border-accent-red scale-110"
                      : "border-transparent hover:border-muted",
                    isOutOfStock && "opacity-40 cursor-not-allowed"
                  )}
                  style={{ backgroundColor: v.colorHex ?? "#cccccc" }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Size Chips */}
      {hasSizes && sizeVariants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold font-body text-primary-text">
                Size
              </span>
              {selectedVariant?.size && (
                <span className="text-[13px] font-body text-muted">
                  {selectedVariant.size}
                </span>
              )}
            </div>
            <button
              className="text-[12px] text-cta-blue font-medium font-body hover:underline"
              aria-label="View size guide"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const isOutOfStock = v.stock === 0;

              return (
                <button
                  key={v.id}
                  onClick={() => !isOutOfStock && onSelect(v.id)}
                  aria-label={`Size: ${v.size}${isOutOfStock ? " — Out of stock" : ""}`}
                  aria-pressed={isSelected}
                  disabled={isOutOfStock}
                  className={cn(
                    "relative min-w-[44px] h-11 px-3 rounded border text-[13px] font-medium font-body transition-all duration-200",
                    isSelected &&
                      "border-accent-red bg-accent-red text-white",
                    !isSelected &&
                      !isOutOfStock &&
                      "border-border-default text-primary-text hover:border-accent-red hover:text-accent-red",
                    isOutOfStock &&
                      "border-border-default text-muted opacity-60 cursor-not-allowed"
                  )}
                >
                  {v.size}
                  {isOutOfStock && (
                    <span
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <span className="absolute w-full border-t border-muted/60 rotate-[-18deg]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
