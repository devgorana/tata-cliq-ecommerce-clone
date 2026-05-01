"use client";

import { useMemo } from "react";
import { mockProducts } from "@/data/mock-catalog";
import { useFilterStore } from "@/store/useFilterStore";
import type { Product } from "@/types";

export function useProducts(): { products: Product[]; total: number } {
  const {
    category,
    brands,
    sizes,
    colors,
    minPrice,
    maxPrice,
    minRating,
    discountMin,
    sortBy,
    searchQuery,
  } = useFilterStore();

  const products = useMemo(() => {
    let result = mockProducts.filter((p) => p.isActive);

    if (category) result = result.filter((p) => p.category === category);
    if (brands.length) result = result.filter((p) => brands.includes(p.brand));
    if (sizes.length)
      result = result.filter((p) =>
        p.variants.some((v) => v.size && sizes.includes(v.size))
      );
    if (colors.length)
      result = result.filter((p) =>
        p.variants.some((v) => v.color && colors.includes(v.color))
      );
    result = result.filter(
      (p) => p.salePrice >= minPrice && p.salePrice <= maxPrice
    );
    if (minRating > 0) result = result.filter((p) => p.avgRating >= minRating);
    if (discountMin > 0)
      result = result.filter((p) => p.discountPercent >= discountMin);
    if (searchQuery)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "top_rated":
        result = [...result].sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "highest_discount":
        result = [...result].sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "newest":
        result = [...result].reverse();
        break;
      default:
        break;
    }

    return result;
  }, [category, brands, sizes, colors, minPrice, maxPrice, minRating, discountMin, sortBy, searchQuery]);

  return { products, total: products.length };
}
