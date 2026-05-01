# react.md — React Component & Hook Patterns
_Phase 2 skill reference for building the Layout and Homepage modules._
_Read alongside @docs/DESIGN.md (visual specs) and @docs/ARCHITECTURE.md (module rules)._

---

## 1. Introduction

This document captures the React patterns used in this project. Every pattern here
is constrained by the rules in `CLAUDE.md`:

- TypeScript strict mode — no `any`
- Tailwind only — no CSS Modules, no inline styles
- TanStack Query for server state — no `useEffect` for data fetching
- Zustand for client state — cart, filters, auth
- One component per file, one visual responsibility per component

All component code must match the spec in @docs/DESIGN.md §4 before it is considered done.

---

## 2. Component Patterns

### 2.1 React Server Component (RSC)

Use for pages that fetch data at build or request time and have no interactivity.

```tsx
// src/app/product/[slug]/page.tsx
import { getProductBySlug } from "@/data/mock-catalog";
import { ImageGallery } from "@/components/pdp/ImageGallery";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <main>
      <ImageGallery images={product.images} />
    </main>
  );
}
```

**Rules:**
- No `"use client"` directive.
- No Zustand store reads — stores are client-only.
- May call data helpers directly (`getProductBySlug`, `getFeaturedProducts`).
- Async function body is allowed (Next.js 14 RSC).

---

### 2.2 Client Component

Use whenever the component needs browser APIs, event handlers, or Zustand stores.

```tsx
// src/components/cart/CartDrawer.tsx
"use client";

import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { PriceSummary } from "@/components/cart/PriceSummary";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <aside aria-label="Shopping cart" className="flex flex-col w-full md:w-96">
      <header className="px-6 py-4 border-b border-default">
        <h2 className="font-display text-xl font-semibold text-primary-text">
          Cart ({totalItems})
        </h2>
      </header>
      <ul className="flex-1 overflow-y-auto divide-y divide-default">
        {items.map((item) => (
          <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
        ))}
      </ul>
      <PriceSummary />
    </aside>
  );
}
```

**Rules:**
- `"use client"` must be the first line (before imports).
- Read Zustand stores only in the top-level section/page component, then pass props down.
- Use selector functions (`(s) => s.items`) to prevent unnecessary re-renders.

---

### 2.3 Props-Driven Leaf Component

Leaf components receive all data as props — they never read stores directly.

```tsx
// src/components/catalog/ProductCard.tsx
"use client";

import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onWishlistToggle: (productId: string) => void;
  isWishlisted: boolean;
}

export function ProductCard({ product, onWishlistToggle, isWishlisted }: ProductCardProps) {
  const salePrice = product.variants[0]?.salePrice ?? product.basePrice;
  const discount = Math.round(((product.basePrice - salePrice) / product.basePrice) * 100);

  return (
    <article className="group relative bg-card rounded-lg overflow-hidden border border-default hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-accent-red text-white text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-widest">
            {discount}% off
          </span>
        )}
        <button
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onWishlistToggle(product.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Heart
            size={20}
            className={isWishlisted ? "fill-accent-red stroke-accent-red" : "stroke-muted"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 py-3 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
          {product.brand}
        </p>
        <p className="text-sm font-medium text-primary-text line-clamp-2">{product.name}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-primary-text">
            {formatCurrency(salePrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-[13px] text-muted line-through">
                {formatCurrency(product.basePrice)}
              </span>
              <span className="text-[13px] font-medium text-accent-red">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
```

---

### 2.4 Compound Component Pattern

Use when a feature is too complex for a single file but shares tightly coupled state.
Split into a parent + named sub-components exported from the same file.

```tsx
// src/components/pdp/VariantSelector.tsx
"use client";

import { ProductVariant } from "@/types";
import { cn } from "@/lib/utils";

interface RootProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
}

function Root({ variants, selectedId, onSelect }: RootProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
      {variants.map((v) => (
        <Chip key={v.id} variant={v} isSelected={v.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface ChipProps {
  variant: ProductVariant;
  isSelected: boolean;
  onSelect: (variantId: string) => void;
}

function Chip({ variant, isSelected, onSelect }: ChipProps) {
  const outOfStock = variant.stock === 0;

  return (
    <button
      role="radio"
      aria-checked={isSelected}
      aria-disabled={outOfStock}
      onClick={() => !outOfStock && onSelect(variant.id)}
      className={cn(
        "min-w-[36px] h-9 px-3 rounded-md border text-sm font-medium transition-colors duration-150",
        isSelected
          ? "border-accent-red bg-accent-red text-white"
          : "border-default text-primary-text hover:border-accent-red",
        outOfStock && "opacity-40 cursor-not-allowed line-through"
      )}
    >
      {variant.size}
    </button>
  );
}

export const VariantSelector = { Root, Chip };
```

---

### 2.5 Loading UI with Skeleton

Always use animated shimmer skeletons — never spinners — per @docs/DESIGN.md §6.

```tsx
// src/components/catalog/ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-default animate-pulse">
      <div className="aspect-[3/4] bg-surface" />
      <div className="px-3 py-3 space-y-2">
        <div className="h-3 bg-surface rounded w-1/3" />
        <div className="h-4 bg-surface rounded w-3/4" />
        <div className="h-4 bg-surface rounded w-1/2" />
      </div>
    </div>
  );
}
```

---

## 3. Hook Patterns

### 3.1 Data Hook — `useProducts`

The canonical pattern for all data hooks. The signature is stable; the implementation
swaps from `useMemo` (V1) to `useQuery` (V2) without any component changes.

```ts
// src/hooks/useProducts.ts
"use client";

import { useMemo } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import { mockProducts } from "@/data/mock-catalog";
import { Product } from "@/types";

interface UseProductsResult {
  products: Product[];
  total: number;
}

export function useProducts(): UseProductsResult {
  const filters = useFilterStore();

  const products = useMemo(() => {
    let result = [...mockProducts];

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.basePrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.basePrice <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      result = result.filter((p) => (p.rating ?? 0) >= filters.minRating!);
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return result;
  }, [filters]);

  return { products, total: products.length };
}
```

---

### 3.2 Zustand Store Selector Pattern

Always select a specific slice to prevent components re-rendering on unrelated state changes.

```ts
// ✓ — component only re-renders when `items` changes
const items = useCartStore((s) => s.items);

// ✗ — component re-renders on every store mutation
const store = useCartStore();
```

---

### 3.3 Computed Value Hook

Wrap expensive computations in a dedicated hook rather than inline in components.

```ts
// src/hooks/useCartSummary.ts
"use client";

import { useCartStore } from "@/store/useCartStore";

export function useCartSummary() {
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  return { subtotal, totalItems, shipping, total };
}
```

---

### 3.4 Event Handler Naming

| Event type      | Prop name convention | Example                    |
|-----------------|----------------------|----------------------------|
| Click           | `onClick`            | `onClick={() => ...}`      |
| Change (input)  | `onChange`           | `onChange={(e) => ...}`    |
| Submit (form)   | `onSubmit`           | `onSubmit={(e) => ...}`    |
| Custom action   | `on` + PascalNoun    | `onWishlistToggle`, `onSizeSelect` |

---

## 4. Responsive Pattern

Every layout component must include `sm:` / `md:` / `lg:` breakpoints.
Reference @docs/DESIGN.md §7 for breakpoint values.

```tsx
// 1-col mobile → 2-col sm → 3-col md → 4-col lg
<ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {products.map((p) => <ProductCard key={p.id} product={p} />)}
</ul>
```

---

## 5. Accessibility Checklist

Before marking any component done, verify:

- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have `<label>` or `aria-label`
- [ ] Interactive elements are reachable by keyboard (`Tab` / `Enter` / `Space`)
- [ ] Focus ring visible: `focus-visible:ring-2 focus-visible:ring-accent-red`
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Images have descriptive `alt` text (`"{brand} {productName}"`)
- [ ] Dynamic regions use `aria-live` (cart count, toast messages)

See @docs/DESIGN.md §10 for full accessibility guidelines.

---

_Last updated: 2026-05-01 — Phase 2 reference established._
