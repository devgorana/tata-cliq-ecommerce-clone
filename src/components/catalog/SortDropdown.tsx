"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/useFilterStore";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "top_rated", label: "Customer Rating" },
  { value: "highest_discount", label: "Best Discount" },
];

export default function SortDropdown() {
  const { sortBy, setFilter } = useFilterStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Recommended";

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 border border-border-default rounded-lg text-[13px] font-body text-primary-text bg-card hover:border-accent-red transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Sort products"
      >
        <span className="hidden sm:inline text-muted text-[12px]">Sort:</span>
        <span className="font-medium">{currentLabel}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Sort options"
          className="absolute right-0 top-full mt-1 w-52 bg-card border border-border-default rounded-lg shadow-lg z-50 py-1"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              role="option"
              aria-selected={sortBy === value}
              onClick={() => {
                setFilter({ sortBy: value });
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-body text-left hover:bg-surface transition-colors min-h-[44px] md:min-h-0",
                sortBy === value ? "text-accent-red font-medium" : "text-primary-text"
              )}
            >
              {label}
              {sortBy === value && (
                <Check size={14} className="text-accent-red flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
