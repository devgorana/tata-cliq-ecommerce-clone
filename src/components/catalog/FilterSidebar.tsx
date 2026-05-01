"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useFilterStore } from "@/store/useFilterStore";
import { mockProducts } from "@/data/mock-catalog";
import type { Category } from "@/types";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "Fashion", value: "fashion" },
  { label: "Electronics", value: "electronics" },
  { label: "Luxury", value: "luxury" },
  { label: "Home", value: "home" },
];

const ALL_BRANDS = Array.from(new Set(mockProducts.map((p) => p.brand))).sort();
const ALL_SIZES = (
  Array.from(
    new Set(
      mockProducts.flatMap((p) =>
        p.variants.map((v) => v.size).filter((s): s is string => !!s)
      )
    )
  ) as string[]
).sort();

const DISCOUNT_OPTIONS = [10, 20, 30, 40, 50];
const RATING_OPTIONS = [4, 3, 2];

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-default py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={open}
      >
        <span className="text-[12px] font-semibold font-body text-primary-text uppercase tracking-wider">
          {title}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-muted" />
        ) : (
          <ChevronDown size={16} className="text-muted" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

interface FilterSidebarProps {
  isDrawer?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({ isDrawer = false, onClose }: FilterSidebarProps) {
  const {
    category,
    brands,
    sizes,
    minPrice,
    maxPrice,
    minRating,
    discountMin,
    setFilter,
    resetFilters,
  } = useFilterStore();

  const toggleBrand = (brand: string) => {
    setFilter({
      brands: brands.includes(brand)
        ? brands.filter((b) => b !== brand)
        : [...brands, brand],
    });
  };

  const toggleSize = (size: string) => {
    setFilter({
      sizes: sizes.includes(size)
        ? sizes.filter((s) => s !== size)
        : [...sizes, size],
    });
  };

  return (
    <div className={cn("bg-card", isDrawer ? "h-full flex flex-col" : "")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-text" />
          <span className="text-[14px] font-semibold font-body text-primary-text">Filters</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="text-[12px] text-accent-red font-medium font-body hover:underline"
          >
            Clear All
          </button>
          {isDrawer && onClose && (
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="text-muted hover:text-primary-text"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Groups */}
      <div className={cn("px-4", isDrawer ? "overflow-y-auto flex-1" : "")}>
        {/* Category */}
        <FilterGroup title="Category">
          <div className="space-y-2">
            {CATEGORIES.map(({ label, value }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer min-h-[44px] md:min-h-0">
                <input
                  type="radio"
                  name="category"
                  checked={category === value}
                  onChange={() => setFilter({ category: value })}
                  className="w-4 h-4 cursor-pointer accent-[#E4002B]"
                />
                <span
                  className={cn(
                    "text-[13px] font-body transition-colors",
                    category === value ? "text-accent-red font-medium" : "text-primary-text"
                  )}
                >
                  {label}
                </span>
              </label>
            ))}
            {category && (
              <button
                onClick={() => setFilter({ category: null })}
                className="text-[12px] text-muted font-body hover:text-accent-red transition-colors"
              >
                Any Category
              </button>
            )}
          </div>
        </FilterGroup>

        {/* Discount */}
        <FilterGroup title="Discount">
          <div className="space-y-2">
            {DISCOUNT_OPTIONS.map((pct) => (
              <label key={pct} className="flex items-center gap-2.5 cursor-pointer min-h-[44px] md:min-h-0">
                <input
                  type="radio"
                  name="discount"
                  checked={discountMin === pct}
                  onChange={() => setFilter({ discountMin: pct })}
                  className="w-4 h-4 cursor-pointer accent-[#E4002B]"
                />
                <span
                  className={cn(
                    "text-[13px] font-body",
                    discountMin === pct ? "text-accent-red font-medium" : "text-primary-text"
                  )}
                >
                  {pct}% or more
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>

        {/* Price Range */}
        <FilterGroup title="Price Range">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[12px] text-muted font-body">
              <span>{formatCurrency(minPrice)}</span>
              <span>{formatCurrency(maxPrice === 500000 ? 500000 : maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={500}
              value={maxPrice}
              onChange={(e) => setFilter({ maxPrice: Number(e.target.value) })}
              className="w-full cursor-pointer accent-[#E4002B]"
              aria-label="Maximum price"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice || ""}
                onChange={(e) => setFilter({ minPrice: Number(e.target.value) || 0 })}
                className="flex-1 border border-border-default rounded px-2 py-1.5 text-[12px] font-body text-primary-text focus:outline-none focus:border-accent-red min-h-[44px] md:min-h-0"
                aria-label="Minimum price"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice >= 500000 ? "" : maxPrice}
                onChange={(e) =>
                  setFilter({ maxPrice: Number(e.target.value) || 500000 })
                }
                className="flex-1 border border-border-default rounded px-2 py-1.5 text-[12px] font-body text-primary-text focus:outline-none focus:border-accent-red min-h-[44px] md:min-h-0"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </FilterGroup>

        {/* Rating */}
        <FilterGroup title="Customer Rating" defaultOpen={false}>
          <div className="space-y-2">
            {RATING_OPTIONS.map((rating) => (
              <label key={rating} className="flex items-center gap-2.5 cursor-pointer min-h-[44px] md:min-h-0">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => setFilter({ minRating: rating })}
                  className="w-4 h-4 cursor-pointer accent-[#E4002B]"
                />
                <span
                  className={cn(
                    "text-[13px] font-body",
                    minRating === rating ? "text-accent-red font-medium" : "text-primary-text"
                  )}
                >
                  {rating}★ &amp; above
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>

        {/* Brand */}
        <FilterGroup title="Brand" defaultOpen={false}>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ALL_BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer min-h-[44px] md:min-h-0">
                <input
                  type="checkbox"
                  checked={brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 cursor-pointer accent-[#E4002B]"
                />
                <span
                  className={cn(
                    "text-[13px] font-body",
                    brands.includes(brand) ? "text-accent-red font-medium" : "text-primary-text"
                  )}
                >
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>

        {/* Size */}
        <FilterGroup title="Size" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "min-w-[44px] h-11 md:h-9 px-2.5 text-[12px] font-medium font-body rounded border transition-all duration-200",
                  sizes.includes(size)
                    ? "border-accent-red bg-accent-red text-white"
                    : "border-border-default text-primary-text hover:border-accent-red hover:text-accent-red"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>

      {/* Apply button for drawer */}
      {isDrawer && onClose && (
        <div className="p-4 border-t border-border-default">
          <button
            onClick={onClose}
            className="w-full h-12 bg-accent-red text-white font-semibold font-body text-[14px] rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
