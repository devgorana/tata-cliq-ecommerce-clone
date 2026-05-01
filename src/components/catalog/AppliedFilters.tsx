"use client";

import { X } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";
import { formatCurrency } from "@/lib/utils";

export default function AppliedFilters() {
  const {
    category,
    brands,
    sizes,
    minPrice,
    maxPrice,
    minRating,
    discountMin,
    searchQuery,
    setFilter,
    resetFilters,
  } = useFilterStore();

  const chips: { label: string; onRemove: () => void }[] = [];

  if (category) {
    chips.push({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      onRemove: () => setFilter({ category: null }),
    });
  }
  if (discountMin > 0) {
    chips.push({
      label: `${discountMin}% off`,
      onRemove: () => setFilter({ discountMin: 0 }),
    });
  }
  if (minPrice > 0 || maxPrice < 500000) {
    chips.push({
      label: `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`,
      onRemove: () => setFilter({ minPrice: 0, maxPrice: 500000 }),
    });
  }
  if (minRating > 0) {
    chips.push({
      label: `${minRating}★ & above`,
      onRemove: () => setFilter({ minRating: 0 }),
    });
  }
  brands.forEach((b) =>
    chips.push({
      label: b,
      onRemove: () => setFilter({ brands: brands.filter((x) => x !== b) }),
    })
  );
  sizes.forEach((s) =>
    chips.push({
      label: s,
      onRemove: () => setFilter({ sizes: sizes.filter((x) => x !== s) }),
    })
  );
  if (searchQuery) {
    chips.push({
      label: `"${searchQuery}"`,
      onRemove: () => setFilter({ searchQuery: "" }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      {chips.map(({ label, onRemove }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 bg-surface border border-border-default text-primary-text text-[12px] font-body px-2.5 py-1 rounded-full"
        >
          {label}
          <button
            onClick={onRemove}
            aria-label={`Remove ${label} filter`}
            className="text-muted hover:text-primary-text ml-0.5"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={resetFilters}
        className="text-[12px] text-accent-red font-medium font-body hover:underline ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
