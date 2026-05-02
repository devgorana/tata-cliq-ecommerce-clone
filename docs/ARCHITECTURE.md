# ARCHITECTURE.md — Tata CLiQ E-Commerce Clone
_Module structure, boundaries, data flow, and architectural decisions._
_Read alongside @docs/DESIGN.md (visual/component specs) and CLAUDE.md (build rules)._

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Build Strategy: V1 vs V2](#2-build-strategy-v1-vs-v2)
3. [High-Level Architecture Diagram](#3-high-level-architecture-diagram)
4. [Directory Structure & Module Map](#4-directory-structure--module-map)
5. [Module Responsibilities](#5-module-responsibilities)
   - 5.1 Types Module
   - 5.2 Data Module
   - 5.3 Store Module (Zustand)
   - 5.4 Hooks Module
   - 5.5 Lib / Utils Module
   - 5.6 Components Module
   - 5.7 App (Routing) Module
   - 5.8 Docs Module
6. [State Management Architecture](#6-state-management-architecture)
7. [Data Flow](#7-data-flow)
8. [Routing Architecture](#8-routing-architecture)
9. [Component Design Rules](#9-component-design-rules)
10. [Naming Conventions](#10-naming-conventions)
11. [Module Boundaries & Dependency Rules](#11-module-boundaries--dependency-rules)
12. [V2 Extension Points](#12-v2-extension-points)
13. [Architectural Decision Log](#13-architectural-decision-log)

---

## 1. Project Overview

**Tata CLiQ E-Commerce Clone** is a multi-category retail marketplace replica covering
Fashion, Electronics, Luxury, and Home. The V1 build is a fully navigable, demo-ready
frontend using 100% mock data. V2 wires the same frontend to real Fastify microservices,
MongoDB, PostgreSQL, and Razorpay.

**Key constraints driving all decisions:**
- The frontend must be independently deployable (Vercel) without a backend.
- Mock data must be swappable for live API calls with zero component changes.
- All UI decisions are governed by @docs/DESIGN.md — no values are hardcoded in components.
- TypeScript strict mode is non-negotiable; shapes are defined once in `src/types/index.ts`.

---

## 2. Build Strategy: V1 vs V2

| Dimension        | V1 — Showcase Build (current)          | V2 — Production Extension (future)         |
|------------------|----------------------------------------|--------------------------------------------|
| **Data**         | TypeScript constants in `src/data/`    | Live MongoDB + PostgreSQL via REST/GraphQL  |
| **Auth**         | Zustand memory session (mock login)    | JWT RS256 + OTP + Google OAuth (Fastify)   |
| **Payments**     | "Order Placed" screen only             | Razorpay SDK + PayU failover               |
| **Search**       | `useMemo` filter over mock array       | Elasticsearch 8 / AWS OpenSearch           |
| **Hosting**      | Vercel (single command deploy)         | AWS ECS Fargate + CloudFront CDN           |
| **AI**           | Not present                            | AWS Bedrock (Claude Sonnet) — smart search |

The swap from V1 to V2 happens **inside hooks only** (`useProducts`, `useOrders`).
No component needs to change — it always calls a hook, never `fetch` directly.

---

## 3. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                          │
│                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │  Zustand     │   │  TanStack    │   │  Next.js App Router  │ │
│  │  Stores      │   │  Query       │   │  (SSR + RSC)         │ │
│  │  cart        │◄──┤  (V2 only)   │   │  page.tsx            │ │
│  │  filter      │   │              │   │  search/page.tsx     │ │
│  │  auth        │   └──────┬───────┘   │  product/[slug]/     │ │
│  └──────┬───────┘          │           │  cart/ checkout/     │ │
│         │                  │           └──────────┬───────────┘ │
│         │                  │                      │             │
│  ┌──────▼──────────────────▼──────────────────────▼───────────┐ │
│  │                    Hooks Layer                               │ │
│  │   useProducts()  useOrders()  (mock data in V1, API in V2)  │ │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                  Components Layer                          │  │
│  │  layout/   home/   catalog/   pdp/   cart/   checkout/    │  │
│  │  auth/   (all props-driven, no direct store reads)         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ (V2 only)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Fastify Microservices (V2)                       │
│  auth-service  user-service  catalog-service  search-service     │
│  cart-service  order-service  payment-service  notification-svc  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure & Module Map

```
tata-cliq-ecommerce-clone/
│
├── docs/                          ← Project documentation (never imported by src/)
│   ├── DESIGN.md                  ← @docs/DESIGN.md — visual/component source of truth
│   └── ARCHITECTURE.md            ← this file
│
├── src/
│   ├── types/
│   │   └── index.ts               ← [TYPES MODULE] all shared TypeScript interfaces
│   │
│   ├── data/
│   │   └── mock-catalog.ts        ← [DATA MODULE] 50 typed products + helper fns
│   │
│   ├── store/
│   │   ├── useCartStore.ts        ← [STORE MODULE] cart state (Zustand)
│   │   ├── useFilterStore.ts      ← [STORE MODULE] PLP filter/sort state (Zustand)
│   │   └── useAuthStore.ts        ← [STORE MODULE] user session state (Zustand)
│   │
│   ├── hooks/
│   │   ├── useProducts.ts         ← [HOOKS MODULE] filtered product list
│   │   └── useOrders.ts           ← [HOOKS MODULE] order history (Phase 5)
│   │
│   ├── lib/
│   │   └── utils.ts               ← [LIB MODULE] cn(), formatCurrency(), formatDate(),
│   │                                              slugify(), calculateEMI(), getDeliveryDate()
│   │
│   ├── components/
│   │   ├── layout/                ← [COMPONENTS] Header, Footer, MegaMenu, BottomNav
│   │   ├── home/                  ← [COMPONENTS] HeroCarousel, CategoryBanners,
│   │   │                                          FlashSaleModule, PromoBanners
│   │   ├── catalog/               ← [COMPONENTS] ProductCard, FilterSidebar,
│   │   │                                          AppliedFilters, SortDropdown, ResultsGrid
│   │   ├── pdp/                   ← [COMPONENTS] ImageGallery, VariantSelector,
│   │   │                                          DeliveryEstimate, EMICalculator,
│   │   │                                          StickyAddToCart, ReviewsSection
│   │   ├── cart/                  ← [COMPONENTS] CartDrawer, CartItem, PriceSummary
│   │   ├── checkout/              ← [COMPONENTS] AddressStep, PaymentStep, OrderSummary
│   │   └── auth/                  ← [COMPONENTS] OTPInput, SocialLogin, ProtectedRoute
│   │
│   └── app/                       ← [APP MODULE] Next.js 14 App Router pages
│       ├── layout.tsx             ← root layout (fonts, metadata, providers)
│       ├── globals.css            ← Tailwind directives + base styles
│       ├── page.tsx               ← / homepage
│       ├── search/page.tsx        ← /search PLP
│       ├── product/[slug]/        ← /product/:slug PDP
│       ├── cart/page.tsx          ← /cart
│       ├── checkout/page.tsx      ← /checkout
│       ├── orders/page.tsx        ← /orders
│       └── auth/                  ← /auth/login, /auth/register, /auth/otp
│
├── CLAUDE.md                      ← build rules, stack, design token references
├── TODO.md                        ← phase-by-phase task checklist
├── tailwind.config.ts             ← design tokens (derived from @docs/DESIGN.md §2)
├── tsconfig.json                  ← TypeScript strict config, @/* path alias
├── next.config.mjs                ← image remote patterns
└── .env.example                   ← environment variable template
```

---

## 5. Module Responsibilities

### 5.1 Types Module — `src/types/index.ts`

**Single responsibility**: define every shared TypeScript interface and type in one place.
No business logic. No imports from other `src/` modules.

| Type / Interface   | Purpose |
|--------------------|---------|
| `Category`         | Union type — `"fashion" \| "electronics" \| "luxury" \| "home"` |
| `Product`          | Full product shape including variants, images, pricing, GST rate |
| `ProductVariant`   | Size, colour, stock count, additionalPrice per variant |
| `ProductImage`     | URL, alt text, isMain flag |
| `CartItem`         | Product reference + variantId + quantity + selected attrs |
| `CartState`        | Zustand cart store interface (actions + computed values) |
| `FilterState`      | All active filter values for the PLP |
| `FilterStore`      | FilterState extended with `setFilter` and `resetFilters` |
| `SortOption`       | Union type for the 6 sort modes |
| `User`             | Authenticated user profile + wishlist IDs + CLiQ Cash balance |
| `AuthStore`        | Zustand auth store interface |
| `Order`            | Full order shape including 7-state status machine |
| `OrderStatus`      | Union type — `"Placed" \| "Confirmed" \| ... \| "Cancelled"` |
| `Address`          | Delivery address shape |
| `PaymentMethod`    | Union type — `"UPI" \| "Card" \| "COD" \| "EMI" \| "CLiQCash"` |

**Rules:**
- Extend this file when a new domain concept is introduced — never declare types inline in components.
- Never import from `src/data/`, `src/store/`, or `src/hooks/` — this module has no dependencies.

---

### 5.2 Data Module — `src/data/mock-catalog.ts`

**Single responsibility**: provide typed product fixtures and catalog helper functions for V1.
Replaced entirely by API calls in V2 — the hooks layer handles the swap transparently.

| Export | Purpose |
|--------|---------|
| `mockProducts` | Array of 50 `Product` objects (Fashion×15, Electronics×15, Luxury×10, Home×10) |
| `getProductBySlug(slug)` | Returns `Product \| undefined` — used by PDP SSR page |
| `getProductsByCategory(cat)` | Returns `Product[]` filtered by category |
| `getFeaturedProducts(limit?)` | Returns top-rated products — used by homepage sections |
| `getFlashSaleProducts()` | Returns products with ≥ 28% discount — used by FlashSaleModule |

**Rules:**
- Never import this file directly inside a component — go through `useProducts` hook only.
- PDP `page.tsx` may call `getProductBySlug` directly (it is a Server Component doing SSG).

---

### 5.3 Store Module — `src/store/`

**Single responsibility**: manage client-side UI state that must survive navigation.
All stores use Zustand. All files are `"use client"` — never imported in Server Components.

#### `useCartStore.ts`
| State / Action | Description |
|----------------|-------------|
| `items: CartItem[]` | Current cart contents |
| `addItem(product, variantId, qty?)` | Adds or increments; respects `variant.stock` ceiling |
| `removeItem(productId, variantId)` | Removes one line item |
| `updateQuantity(productId, variantId, qty)` | Updates qty; calls `removeItem` if qty < 1 |
| `clearCart()` | Empties the cart (post-order-placed) |
| `totalItems()` | Derived: sum of all `item.quantity` values |
| `subtotal()` | Derived: sum of `(salePrice + additionalPrice) × qty` per item |

#### `useFilterStore.ts`
| State / Action | Description |
|----------------|-------------|
| `category`, `brands`, `sizes`, `colors` | Active filter selections |
| `minPrice`, `maxPrice` | Price range (INR) |
| `minRating`, `discountMin` | Quality / deal filters |
| `sortBy: SortOption` | Active sort mode |
| `searchQuery` | Free-text search string |
| `setFilter(partial)` | Merges partial state — any combination of fields |
| `resetFilters()` | Restores all defaults |

#### `useAuthStore.ts`
| State / Action | Description |
|----------------|-------------|
| `user: User \| null` | Authenticated user profile |
| `accessToken: string \| null` | JWT — stored in memory **only**, never localStorage |
| `isAuthenticated: boolean` | Derived flag for conditional rendering |
| `login(user, token)` | Sets all three fields atomically |
| `logout()` | Clears all three fields |
| `toggleWishlist(productId)` | Adds/removes product from `user.wishlistIds` |

**Security rule**: `accessToken` lives in Zustand memory exclusively. On page refresh it resets —
the user must re-authenticate. This is intentional (XSS protection). In V2, a `httpOnly` cookie
carries the refresh token to obtain a new access token silently.

---

### 5.4 Hooks Module — `src/hooks/`

**Single responsibility**: be the single boundary between the data layer and the component layer.
Components never import from `src/data/` directly (except SSR pages).

#### `useProducts.ts`
- Reads the full `FilterStore` state via `useFilterStore()`.
- Applies all active filters and sort order to `mockProducts` using `useMemo`.
- Returns `{ products: Product[], total: number }`.
- **V2 swap**: replace the `useMemo` body with a `useQuery` call to the catalog API.
  The return signature stays identical — zero component changes required.

#### `useOrders.ts` _(Phase 5)_
- Returns mock order history for the authenticated user.
- **V2 swap**: replace with `useQuery` to the order-service API.

---

### 5.5 Lib / Utils Module — `src/lib/utils.ts`

**Single responsibility**: pure utility functions with no side effects and no store dependencies.

| Function | Signature | Purpose |
|----------|-----------|---------|
| `cn()`   | `(...inputs: ClassValue[]) => string` | Merges Tailwind classes (clsx + twMerge) |
| `formatCurrency()` | `(amount: number) => string` | Formats INR using `en-IN` locale (e.g. ₹1,49,900) |
| `formatDate()` | `(date: Date) => string` | Formats date in IST locale (e.g. 1 May 2026) |
| `slugify()` | `(text: string) => string` | Converts a string to a URL-safe slug |
| `calculateEMI()` | `(principal, rate, tenure) => number` | Calculates monthly EMI (0% or interest-bearing) |
| `getDeliveryDate()` | `(daysFromNow: number) => string` | Returns a formatted delivery date string |

---

### 5.6 Components Module — `src/components/`

**Single responsibility**: render UI. Components are props-driven and design-token-driven.
Every component matches a spec in @docs/DESIGN.md §4.

#### Rules that apply to every component file
- One component per file. One visual responsibility per component.
- Never call `fetch` or `axios` inside a component — use hooks.
- Never read from Zustand stores in deeply nested leaf components — pass props down.
- All Tailwind classes must use tokens from `tailwind.config.ts` (e.g. `bg-primary-navy`, not `bg-[#1A1A6B]`).
- Must include `sm:` / `md:` / `lg:` responsive variants for any layout class.
- Interactive elements must have `aria-label` if icon-only, and meet 44×44px touch target.

#### Component groups and their design spec references

| Folder | Components | @docs/DESIGN.md reference |
|--------|-----------|--------------------------|
| `layout/` | Header, MegaMenu, Footer, BottomNav | §4.1, §4.2, §4.3, §4.13, §7 |
| `home/` | HeroCarousel, CategoryBanners, FlashSaleModule, PromoBanners | §4.4, §4.5, §4.9, §5.1 |
| `catalog/` | ProductCard, FilterSidebar, AppliedFilters, SortDropdown, ResultsGrid | §4.6, §4.7, §5.2 |
| `pdp/` | ImageGallery, VariantSelector, DeliveryEstimate, EMICalculator, StickyAddToCart, ReviewsSection | §4.10, §4.11, §5.3, §8 |
| `cart/` | CartDrawer, CartItem, PriceSummary | §4.10, §4.12 |
| `checkout/` | AddressStep, PaymentStep, OrderSummary | §4.10, §3.2, §3.3 |
| `auth/` | OTPInput, SocialLogin, ProtectedRoute | §10 |

---

### 5.7 App (Routing) Module — `src/app/`

**Single responsibility**: define URL routes and compose page layouts from components.
Uses Next.js 14 App Router. Pages are React Server Components by default.

| Route | File | Rendering | Notes |
|-------|------|-----------|-------|
| `/` | `app/page.tsx` | SSG | Composes homepage sections from `home/` components |
| `/search` | `app/search/page.tsx` | CSR (client) | PLP — reads `useFilterStore`, renders `catalog/` grid |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | SSR/ISR | Calls `getProductBySlug(slug)` at build time |
| `/cart` | `app/cart/page.tsx` | CSR | Reads `useCartStore` |
| `/checkout` | `app/checkout/page.tsx` | CSR | Multi-step wizard — `checkout/` components |
| `/orders` | `app/orders/page.tsx` | CSR | Reads `useOrders` hook |
| `/auth/login` | `app/auth/login/page.tsx` | CSR | Login form |
| `/auth/register` | `app/auth/register/page.tsx` | CSR | Registration form |
| `/auth/otp` | `app/auth/otp/page.tsx` | CSR | OTP verification |

**`app/layout.tsx`** — root layout:
- Loads Inter font via `next/font/google`.
- Will load Playfair Display + DM Sans (Phase 2, per @docs/DESIGN.md §2.2).
- Sets site-wide `<html lang="en">` and metadata.
- Wraps all pages — provider tree (TanStack QueryClient, etc.) added here in V2.

---

### 5.8 Docs Module — `docs/`

Not imported by any source file. Contains human-authored reference documents only.

| File | Purpose |
|------|---------|
| `docs/DESIGN.md` | @docs/DESIGN.md — visual design source of truth (colours, fonts, components, motion, a11y) |
| `docs/ARCHITECTURE.md` | This file — module structure and architectural decisions |

---

## 6. State Management Architecture

Three Zustand stores handle all client state. They are deliberately separated by domain
to keep each store's surface area small and predictable.

```
┌─────────────────────────────────────────────────────┐
│                   Zustand Stores                     │
│                                                      │
│  useCartStore          useFilterStore  useAuthStore  │
│  ─────────────         ─────────────  ────────────  │
│  items[]               category       user           │
│  addItem()             brands[]       accessToken    │
│  removeItem()          sizes[]        isAuthenticated│
│  updateQuantity()      colors[]       login()        │
│  clearCart()           minPrice       logout()       │
│  totalItems()          maxPrice       toggleWishlist │
│  subtotal()            minRating                     │
│                        discountMin                   │
│                        sortBy                        │
│                        searchQuery                   │
│                        setFilter()                   │
│                        resetFilters()                │
└─────────────────────────────────────────────────────┘
         ▲                    ▲                  ▲
         │                    │                  │
   CartDrawer           FilterSidebar        Header
   CartItem             SortDropdown         ProtectedRoute
   PriceSummary         ResultsGrid          WishlistButton
   Header (badge)       AppliedFilters
```

**Why Zustand over Redux or Context?**
- No boilerplate — store is one `create()` call with state + actions collocated.
- Subscriptions are granular — a component re-renders only when its subscribed slice changes.
- Claude Code generates Zustand stores cleanly with no ambiguity.
- See [Decision Log ADR-004](#adr-004-zustand-over-redux-or-context) for full rationale.

---

## 7. Data Flow

### V1 Data Flow (current — mock data)

```
src/data/mock-catalog.ts
         │
         ▼
src/hooks/useProducts.ts   ◄── reads FilterStore state
         │
         │  { products[], total }
         ▼
src/app/search/page.tsx   ──►  catalog/ResultsGrid  ──►  catalog/ProductCard
```

### PDP Data Flow (Server Component path)

```
URL: /product/navy-blazer
         │
         ▼
src/app/product/[slug]/page.tsx  (Server Component)
         │
         │  calls getProductBySlug(slug)  directly from mock-catalog
         │
         ▼
pdp/ImageGallery + pdp/VariantSelector + pdp/ReviewsSection
         │
         │  user clicks "Add to Cart"
         ▼
useCartStore.addItem(product, variantId)
```

### V2 Data Flow (future — live API)

```
Fastify catalog-service  (MongoDB)
         │
         │  REST GET /api/products?filters...
         ▼
src/hooks/useProducts.ts   ◄── same interface, now wraps useQuery()
         │
         │  { products[], total }  (same shape)
         ▼
components (zero changes)
```

---

## 8. Routing Architecture

Next.js 14 **App Router** is used throughout. The key patterns:

### Server vs Client Components

| Pattern | When used | Example |
|---------|-----------|---------|
| **React Server Component (default)** | Data fetching at build/request time, no interactivity | `product/[slug]/page.tsx` |
| **`"use client"` directive** | Needs browser APIs, event handlers, Zustand stores | All store files, `search/page.tsx`, `cart/page.tsx` |

### Dynamic Routes
- `/product/[slug]` — slug derived from `product.slug` in `mock-catalog.ts`.
- In V2, `generateStaticParams()` will pre-generate top-N product pages at build time.

### Path Alias
All imports use the `@/*` alias (mapped to `src/*` in `tsconfig.json`):
```ts
import { useCartStore } from "@/store/useCartStore";  // ✓
import { useCartStore } from "../../store/useCartStore"; // ✗ — never use relative paths
```

---

## 9. Component Design Rules

These rules ensure every component is consistent, testable, and design-spec-compliant.

1. **One component per file** — filename equals the exported component name.
2. **Props down, events up** — parent passes data as props; child calls handler callbacks.
3. **No direct store reads in leaf components** — read stores in page/section components and pass data as props.
4. **Design tokens, not raw values** — use `bg-primary-navy`, not `bg-[#1A1A6B]`. See @docs/DESIGN.md §2.
5. **Responsive by default** — every layout class includes `sm:` / `md:` / `lg:` variants. See @docs/DESIGN.md §7.
6. **Motion from spec** — all transitions use durations and easing from @docs/DESIGN.md §6.
7. **Accessibility first** — `aria-label` on icon buttons, focus rings on all interactive elements, min 44×44px tap targets. See @docs/DESIGN.md §10.
8. **Skeleton over spinner** — use animated shimmer skeleton loaders (see @docs/DESIGN.md §6), not spinners, for async states.

---

## 10. Naming Conventions

| Asset | Convention | Example |
|-------|-----------|---------|
| Component files | PascalCase | `ProductCard.tsx` |
| Hook files | camelCase, `use` prefix | `useProducts.ts` |
| Store files | camelCase, `use` prefix | `useCartStore.ts` |
| Utility functions | camelCase | `formatCurrency()` |
| Type interfaces | PascalCase | `ProductVariant` |
| Type unions | PascalCase | `OrderStatus` |
| Route segments | kebab-case (Next.js default) | `/product/[slug]` |
| Tailwind token classes | kebab-case with prefix | `bg-primary-navy`, `text-accent-red` |
| CSS custom properties | kebab-case with `--cliq-` prefix | `--cliq-red`, `--cliq-navy` |
| Mock data IDs | category prefix + number | `f001`, `e012`, `l004`, `h007` |
| Order numbers | `CLQ-YYYYMMDD-XXXXXXXX` | `CLQ-20260501-A3F2B1C9` |
| Git branches | `feat/phase-N-description` | `feat/phase-2-homepage` |
| Commit messages | Conventional Commits | `feat:`, `chore:`, `fix:`, `docs:` |

---

## 11. Module Boundaries & Dependency Rules

The dependency graph must be a **directed acyclic graph (DAG)** — no circular imports.

```
docs/          ← no imports (human-read only)
src/types/     ← no imports from src/ (pure types)
src/lib/       ← imports: none from src/
src/data/      ← imports: src/types/
src/store/     ← imports: src/types/
src/hooks/     ← imports: src/data/, src/store/, src/types/
src/components/← imports: src/hooks/, src/store/, src/lib/, src/types/
src/app/       ← imports: src/components/, src/data/ (Server Components only), src/types/
```

**Forbidden imports:**
- `src/types/` must never import from anywhere in `src/`.
- `src/lib/` must never import stores or hooks.
- `src/data/` must never import stores or components.
- A component must never import another component from a different feature group
  (e.g. a `catalog/` component must not import from `pdp/`).
- `src/store/` files must never import from each other.

---

## 12. V2 Extension Points

The V1 architecture is designed so that V2 slots in cleanly at three defined points.
**No component code changes are needed for V1→V2 migration.**

| Extension Point | V1 (current) | V2 replacement |
|-----------------|--------------|----------------|
| `src/hooks/useProducts.ts` | `useMemo` over mock array | `useQuery(catalogApi.getProducts(filters))` |
| `src/hooks/useOrders.ts` | Mock order array | `useQuery(orderApi.getOrders(userId))` |
| `src/store/useAuthStore.ts` — `login()` | Accepts mock user object directly | Calls `authApi.loginWithOTP()`, receives real JWT |
| `src/app/layout.tsx` | No providers | Wraps with `QueryClientProvider`, `SessionProvider` |
| `src/services/api.ts` _(not yet created)_ | — | Axios instance with JWT interceptor, base URL from env |

**When adding V2 services:**
1. Create `src/services/api.ts` — Axios instance with `NEXT_PUBLIC_API_URL`.
2. Create domain service files (`catalogService.ts`, `orderService.ts`, etc.).
3. Update hooks to use `useQuery` from TanStack Query.
4. Never modify a component to make V2 work.

---

## 13. Architectural Decision Log

Each record documents what was decided, the alternatives considered, and why this choice was made.
Update this log whenever a significant architectural change is introduced.

---

### ADR-001: Next.js 14 App Router over Pages Router

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: Use Next.js 14 App Router with React Server Components.

**Alternatives considered**:
- Pages Router (Next.js legacy) — rejected: no RSC support, worse DX for layouts.
- Vite + React Router — rejected: no SSR/ISR without additional tooling; weaker SEO for PLP/PDP.
- Remix — rejected: smaller ecosystem, less Claude Code training familiarity.

**Rationale**:
- RSC allows PLP/PDP to be rendered on the server with zero client JS for the data-fetch path.
- ISR (`revalidate`) will allow PDP pages to be statically generated and refreshed on demand in V2.
- App Router's nested layouts eliminate repeated header/footer renders.
- Vercel deploys Next.js with one command — ideal for V1 showcase demo.

---

### ADR-002: TypeScript Strict Mode with Central Types File

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: Enable `"strict": true` in `tsconfig.json`. All shared types live exclusively in
`src/types/index.ts`.

**Alternatives considered**:
- Per-module type files — rejected: creates import confusion and type duplication.
- Relaxed TypeScript (`"strict": false`) — rejected: AI-generated code without strict mode
  produces silent type errors that compound across phases.

**Rationale**:
- A single types file means every developer and every Claude Code session has one place to look
  up the shape of any domain object.
- Strict mode catches shape mismatches at compile time, preventing runtime errors in mock-to-API swap.
- `noEmit: true` in tsconfig means `tsc` is a pure type-checker — the build is handled by Next.js webpack.

---

### ADR-003: Tailwind CSS with Design Tokens over CSS Modules

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: Tailwind CSS only, with all brand values registered as custom tokens in
`tailwind.config.ts`. No CSS Modules, no inline styles.

**Alternatives considered**:
- CSS Modules — rejected: verbose, file-per-component overhead, no design token enforcement.
- Styled Components / Emotion — rejected: runtime CSS-in-JS adds bundle weight; SSR hydration complexity.
- Plain Tailwind (no custom tokens) — rejected: arbitrary values like `bg-[#E31837]` cannot be
  audited and drift from @docs/DESIGN.md without detection.

**Rationale**:
- Custom tokens (`bg-accent-red`, `text-primary-navy`) make it impossible to use an off-brand
  colour by accident — the class simply doesn't exist.
- Tailwind's JIT purges unused classes, keeping the final CSS bundle minimal.
- Claude Code generates Tailwind natively and accurately; it struggles with CSS Module file naming.
- Tokens are the bridge between @docs/DESIGN.md and the codebase — changing a token in one place
  (tailwind.config.ts + DESIGN.md) propagates everywhere.

---

### ADR-004: Zustand over Redux or React Context

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: Zustand for all client state (cart, filters, auth).

**Alternatives considered**:
- Redux Toolkit — rejected: significant boilerplate (slices, reducers, selectors) for a V1 build;
  overkill for three stores with simple shapes.
- React Context + useReducer — rejected: Context triggers all consumers on every change (no
  slice-level subscriptions), causing unnecessary re-renders in the product grid.
- Jotai/Recoil — rejected: atom-per-field model adds overhead; Zustand's slice model maps
  more naturally to the domain objects in `src/types/`.

**Rationale**:
- Zustand stores are a single `create()` call — state and actions are collocated, making them
  easy to read and easy for Claude Code to generate accurately.
- Subscriptions are selector-based — a `ProductCard` subscribed to `useCartStore(s => s.totalItems)`
  only re-renders when the item count changes, not on every cart mutation.
- Zustand's devtools middleware drops in with one line when debugging is needed.
- The small bundle footprint (~3KB) aligns with the performance targets.

---

### ADR-005: Mock-First Data Layer with Hook Abstraction

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: All product and order data in V1 comes from TypeScript constants in `src/data/`.
The data layer is always accessed via hooks (`useProducts`, `useOrders`), never imported
directly inside components.

**Alternatives considered**:
- MSW (Mock Service Worker) — rejected: adds a service worker dependency and CORS configuration
  for a V1 demo that doesn't need network fidelity.
- Direct component imports of mock data — rejected: tightly couples components to the data source,
  requiring component edits for the V1→V2 swap.
- JSON files — rejected: not type-checked; lose the benefit of TypeScript strict mode.

**Rationale**:
- The hook interface (`{ products, total }`) is stable. Swapping the hook's internal from `useMemo`
  to `useQuery` in V2 requires zero component changes — this is the primary goal.
- TypeScript constants give full type safety on mock data and compile-time detection of shape mismatches.
- Helper functions (`getProductBySlug`, `getFeaturedProducts`) provide a queryable API over the
  array that mirrors the V2 API contract.

---

### ADR-006: Access Tokens in Memory Only (XSS Protection)

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: JWT access tokens are stored in Zustand memory only — never in `localStorage`,
`sessionStorage`, or cookies accessible to JavaScript.

**Alternatives considered**:
- `localStorage` — rejected: readable by any JavaScript on the page; XSS attack exposes token.
- `sessionStorage` — rejected: same XSS risk as localStorage; lost on tab close.
- `httpOnly` cookie (access token) — rejected for V1: requires a backend; adds complexity.

**Rationale**:
- Storing tokens in memory means an XSS script cannot read them via `document.cookie` or
  `window.localStorage` — the attack surface is limited to the running JS execution context.
- V1 is a demo build with no real auth — the risk is zero, but the pattern must be established
  now so it is never accidentally changed when V2 auth is added.
- In V2: the short-lived access token stays in Zustand memory; a `httpOnly` refresh token cookie
  (set by the auth-service) silently renews it on expiry. See ADR-006 V2 addendum.

---

### ADR-007: `@/*` Path Alias over Relative Imports

**Date**: 2026-05-01 | **Status**: Accepted

**Decision**: All imports across `src/` use the `@/*` alias (e.g. `import { cn } from "@/lib/utils"`).
Relative paths (`../../`) are forbidden.

**Rationale**:
- Refactoring a file's location does not break imports elsewhere — only the alias mapping in
  `tsconfig.json` needs updating.
- Imports are self-documenting — `@/store/useCartStore` is unambiguous regardless of which file
  is reading it.
- Consistent with Next.js community convention; Claude Code generates `@/` imports naturally.

---

_Last updated: 2026-05-02 — Phase 5 complete._
_Next update due: V2 backend integration (add API service layer, TanStack Query wiring)._
