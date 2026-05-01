"use client";

import { create } from "zustand";
import type { FilterStore, FilterState } from "@/types";

const defaultFilters: FilterState = {
  category: null,
  brands: [],
  sizes: [],
  colors: [],
  minPrice: 0,
  maxPrice: 500000,
  minRating: 0,
  discountMin: 0,
  sortBy: "recommended",
  searchQuery: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...defaultFilters,

  setFilter: (partial) => set((state) => ({ ...state, ...partial })),

  resetFilters: () => set(defaultFilters),
}));
