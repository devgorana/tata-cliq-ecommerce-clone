"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import AppliedFilters from "@/components/catalog/AppliedFilters";
import SortDropdown from "@/components/catalog/SortDropdown";
import ResultsGrid from "@/components/catalog/ResultsGrid";
import { useFilterStore } from "@/store/useFilterStore";

export default function SearchPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { searchQuery, category } = useFilterStore();

  const pageTitle = searchQuery
    ? `"${searchQuery}"`
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  return (
    <div className="bg-surface min-h-screen">
      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Product filters">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-card shadow-xl overflow-hidden">
            <FilterSidebar isDrawer onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="max-w-site mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <h1 className="text-h1 font-display text-primary-text leading-tight">
            {pageTitle}
          </h1>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden flex-shrink-0 mt-1">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3 border border-border-default rounded-lg text-[13px] font-body text-primary-text bg-card"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filter
            </button>
            <SortDropdown />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar — sticky */}
          <aside
            className="hidden md:block w-64 flex-shrink-0 sticky top-[72px] self-start max-h-[calc(100vh-88px)] overflow-y-auto"
            aria-label="Product filters"
          >
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Desktop top bar */}
            <div className="hidden md:flex items-center justify-between mb-4 gap-4 flex-wrap">
              <AppliedFilters />
              <SortDropdown />
            </div>

            {/* Mobile applied filters */}
            <div className="md:hidden mb-3">
              <AppliedFilters />
            </div>

            <ResultsGrid />
          </main>
        </div>
      </div>
    </div>
  );
}
