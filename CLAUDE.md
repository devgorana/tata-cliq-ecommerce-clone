# CLAUDE.md — Tata CLiQ E-Commerce Clone
_Read this file at the start of every Claude Code session._

## Project
Multi-category retail marketplace clone of Tata CLiQ (Fashion, Electronics, Luxury, Home).
Next.js 14 App Router · React 18 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui · Zustand · TanStack Query.

---

## Approved Stack

### V1 — Frontend (Active)
- `next@14` — App Router, SSR/ISR, React Server Components
- `react@18`, `react-dom@18`
- `typescript@5` — strict mode, no `any`
- `tailwindcss@3` — design tokens in tailwind.config.ts
- `shadcn/ui` — headless, accessible components
- `zustand@4` — cart, filter, auth client state
- `@tanstack/react-query@5` — server state, caching
- `lucide-react` — icon set
- `clsx`, `tailwind-merge` — class utilities

### V2 — Backend (Phase 3+ · DO NOT install before Phase 3)
- `fastify`, `prisma`, `@prisma/client`, `mongodb`, `ioredis`
- `@elastic/elasticsearch`, `razorpay`, `aws-sdk`

---

## Design Tokens
```
primary-navy : #1A1A6B   → bg-primary-navy  (header, nav, CTAs)
accent-red   : #E4002B   → bg-accent-red    (sale labels, badges, timers)
cta-blue     : #0071C2   → bg-cta-blue      (Add to Cart, Buy Now)
bg-surface   : #F5F5F5   → bg-surface       (page background, sidebar)
bg-card      : #FFFFFF   → bg-card          (cards, modals, drawers)
primary-text : #212121   → text-primary-text (body, headings)
muted        : #757575   → text-muted        (labels, captions)
border-default: #E0E0E0  → border-default   (card borders, inputs)
cliq-cash    : #F9A825   → bg-cliq-cash     (loyalty wallet)
success      : #2E7D32   → text-success     (delivered, in-stock)
```

---

## Typography Scale
| Level      | Size  | Weight | Usage                        |
|------------|-------|--------|------------------------------|
| Display    | 36px  | 700    | Hero banners                 |
| H1         | 28px  | 600    | PLP/PDP page headings        |
| H2         | 22px  | 600    | Card titles, filter headers  |
| H3         | 18px  | 500    | Spec tables, modal titles    |
| Body       | 14px  | 400    | All body text                |
| Caption    | 12px  | 400    | Labels, meta text            |
| Micro/Badge| 10px  | 500    | Status chips, discount badges|

---

## Responsive Breakpoints
| Prefix | Range        | Layout Behaviour                         |
|--------|--------------|------------------------------------------|
| (base) | 320–479px    | Single column, bottom nav, stacked cards |
| sm:    | 480–767px    | 2-column product grid option             |
| md:    | 768–1023px   | Top nav, 3-column grid, filter drawer    |
| lg:    | 1024–1279px  | Full mega-menu, 4-column grid, sticky sidebar |
| xl:    | 1280–1439px  | Extended hero, 4–5 column grid           |
| 2xl:   | 1440px+      | Max-width 1440px centred                 |

---

## Code Rules
- TypeScript strict mode — **no `any` anywhere**
- React Server Components for PLP/PDP pages (SSR)
- **No `useEffect` for data fetching** — TanStack Query only
- **Tailwind only** — no CSS Modules, no inline styles
- One component per file, one responsibility per component
- Access tokens in Zustand memory **only** — never `localStorage`
- All layout prompts must include `sm:/md:/lg:` breakpoints
- Append `"do not modify anything else"` to every generation prompt

---

## Folder Structure
```
src/
  types/index.ts          ← Product, Order, FilterState, CartItem…
  data/mock-catalog.ts    ← 50 typed products (Fashion/Electronics/Luxury/Home)
  store/
    useCartStore.ts       ← add, remove, qty, totals
    useFilterStore.ts     ← FilterState, setFilter, resetFilters
    useAuthStore.ts       ← token + user (memory only)
  lib/utils.ts            ← cn(), formatCurrency(INR), formatDate(IST)
  hooks/
    useProducts.ts        ← wraps mock data (swapped for API in V2)
    useOrders.ts          ← order history (V2)
  components/
    layout/               ← Header, Footer, MegaMenu, BottomNav
    home/                 ← HeroCarousel, CategoryBanners, FlashSale, PromoBanners
    catalog/              ← ProductCard, FilterSidebar, SortDropdown, ResultsGrid, AppliedFilters
    pdp/                  ← ImageGallery, VariantSelector, DeliveryEstimate, EMICalculator,
                             StickyAddToCart, ReviewsSection
    cart/                 ← CartDrawer, CartItem, PriceSummary
    checkout/             ← AddressStep, PaymentStep, OrderSummary
    auth/                 ← OTPInput, SocialLogin, ProtectedRoute
  app/
    page.tsx              ← Homepage
    search/page.tsx       ← PLP
    product/[slug]/page.tsx ← PDP
    cart/page.tsx
    checkout/page.tsx
    orders/page.tsx
    auth/                 ← login, register, otp pages
```

---

## Phase Plan (5-Phase V1 Build)

| Phase | Focus                              | Status      |
|-------|------------------------------------|-------------|
| 1     | Architecture & Setup               | ✅ COMPLETE  |
| 2     | Layout & Homepage                  | ⬜ PENDING   |
| 3     | Product Catalog & Discovery (PLP/PDP) | ⬜ PENDING |
| 4     | Cart, Checkout & Auth              | ⬜ PENDING   |
| 5     | Orders, Wishlist & Polish          | ⬜ PENDING   |

---

## Current Phase: Phase 1 — Architecture & Setup ✅

### Progress Log
- [2026-05-01] Phase 1 complete: CLAUDE.md, TODO.md authored; Next.js 14 scaffolded; design tokens
  registered; TypeScript strict config; base types, mock catalog (50 products), Zustand stores
  (cart/filter/auth), lib/utils created; folder skeleton in place.
