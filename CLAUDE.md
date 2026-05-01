# CLAUDE.md — Tata CLiQ E-Commerce Clone
_Read this file at the start of every Claude Code session._
_For any UI work, also read @docs/DESIGN.md before writing a single line of code._

---

## Project
Multi-category retail marketplace clone of Tata CLiQ (Fashion, Electronics, Luxury, Home).
Next.js 14 App Router · React 18 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui · Zustand · TanStack Query.

---

## Design Reference — Single Source of Truth

> **@docs/DESIGN.md is the authoritative design specification for this project.**
> Every colour, font, spacing value, component spec, motion rule, and accessibility
> requirement lives there. Do not hardcode design values anywhere else.

### When to read @docs/DESIGN.md
| Situation | Action |
|---|---|
| Starting any UI component or page | Read @docs/DESIGN.md first — no exceptions |
| Choosing a colour, font size, or spacing value | Look it up in @docs/DESIGN.md §2–§3 |
| Building a new component | Match the spec in @docs/DESIGN.md §4 exactly |
| Adding animation or hover state | Follow @docs/DESIGN.md §6 motion rules |
| Testing responsiveness | Use breakpoints defined in @docs/DESIGN.md §7 |
| Adding any interactive element | Check @docs/DESIGN.md §10 accessibility guidelines |

### When to update @docs/DESIGN.md
| Change trigger | Required action |
|---|---|
| New colour or token added to `tailwind.config.ts` | Add to @docs/DESIGN.md §2.1 colour palette |
| New font or type scale change | Update @docs/DESIGN.md §2.2 typography |
| New component designed or spec'd | Add a new subsection under @docs/DESIGN.md §4 |
| Responsive behaviour changes | Update @docs/DESIGN.md §7 |
| New animation pattern agreed | Add to @docs/DESIGN.md §6 |
| Accessibility rule added | Update @docs/DESIGN.md §10 |
| **@docs/DESIGN.md must always be updated before the code change is committed.** | |

---

## Approved Stack

### V1 — Frontend (Active)
- `next@14` — App Router, SSR/ISR, React Server Components
- `react@18`, `react-dom@18`
- `typescript@5` — strict mode, no `any`
- `tailwindcss@3` — design tokens registered from @docs/DESIGN.md §2
- `shadcn/ui` — headless, accessible components (see @docs/DESIGN.md §12)
- `zustand@4` — cart, filter, auth client state
- `@tanstack/react-query@5` — server state, caching
- `lucide-react` — icon set (see @docs/DESIGN.md §9 for required icons)
- `clsx`, `tailwind-merge` — class utilities

### V2 — Backend (Phase 3+ · DO NOT install before Phase 3)
- `fastify`, `prisma`, `@prisma/client`, `mongodb`, `ioredis`
- `@elastic/elasticsearch`, `razorpay`, `aws-sdk`

---

## Design Tokens (summary — full spec in @docs/DESIGN.md §2.1)

The values below are registered in `tailwind.config.ts`. If a token changes,
update `tailwind.config.ts` **and** @docs/DESIGN.md §2.1 in the same commit.

```
primary-navy  : #1A1A6B   → bg-primary-navy   (header, nav, CTAs)
accent-red    : #E31837   → bg-accent-red     (sale labels, badges, CTAs) ← from @docs/DESIGN.md
cta-blue      : #0071C2   → bg-cta-blue       (secondary buttons)
surface       : #F5F5F5   → bg-surface        (page background, sidebar)
card          : #FFFFFF   → bg-card           (cards, modals, drawers)
primary-text  : #1A1A1A   → text-primary-text (body, headings)           ← from @docs/DESIGN.md
muted         : #9E9E9E   → text-muted        (labels, captions)          ← from @docs/DESIGN.md
border-default: #E0E0E0   → border-default    (card borders, inputs)
cliq-gold     : #C9A84C   → bg-cliq-gold      (luxury accents, NeuCoins)  ← from @docs/DESIGN.md
success       : #2E7D32   → text-success      (delivered, in-stock)
```

> See @docs/DESIGN.md §2.1 for the complete palette including functional and gradient tokens.

---

## Typography (summary — full spec in @docs/DESIGN.md §2.2)

Fonts: **Playfair Display** (display/headings) + **DM Sans** (body/UI) — see @docs/DESIGN.md §2.2.
Load both via `next/font/google` in `src/app/layout.tsx`.

| Level    | Size  | Weight | Font             | Usage                |
|----------|-------|--------|------------------|----------------------|
| Display  | 42px  | 700    | Playfair Display | Hero banners         |
| H1       | 32px  | 600    | Playfair Display | Page headings        |
| H2       | 24px  | 600    | Playfair Display | Section titles       |
| Body     | 15px  | 400    | DM Sans          | All body copy        |
| Small    | 13px  | 400    | DM Sans          | Labels, secondary    |
| Badge    | 11px  | 500    | DM Sans          | Chips, ALL CAPS tags |

> Full scale with line-heights and letter-spacing in @docs/DESIGN.md §2.2.

---

## Responsive Breakpoints (summary — full spec in @docs/DESIGN.md §7)

| Tailwind prefix | Range       | Key layout change              |
|-----------------|-------------|--------------------------------|
| (base)          | < 480px     | Single col, bottom nav bar     |
| `sm:`           | 480–767px   | 2-col product grid             |
| `md:`           | 768–1023px  | Top nav, 3-col, filter drawer  |
| `lg:`           | 1024–1279px | Full mega-menu, 4-col grid     |
| `xl:`           | 1280–1439px | 4–5 col, extended hero         |
| `2xl:`          | 1440px+     | Max-width 1440px centred       |

> Mobile behaviour details (bottom nav, sticky ATC, swipeable carousels) in @docs/DESIGN.md §7.

---

## Code Rules
- TypeScript strict mode — **no `any` anywhere**
- React Server Components for PLP/PDP pages (SSR)
- **No `useEffect` for data fetching** — TanStack Query only
- **Tailwind only** — no CSS Modules, no inline styles
- One component per file, one responsibility per component
- Access tokens in Zustand memory **only** — never `localStorage`
- All layout prompts must include `sm:/md:/lg:` breakpoints (see @docs/DESIGN.md §7)
- Every component must match its spec in @docs/DESIGN.md §4 before being considered done
- Append `"do not modify anything else"` to every generation prompt
- **If a design decision is not in @docs/DESIGN.md, add it there before coding it**

---

## Folder Structure
```
docs/
  DESIGN.md               ← @docs/DESIGN.md — THE design source of truth
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
  components/             ← all components must match @docs/DESIGN.md §4
    layout/               ← Header, Footer, MegaMenu, BottomNav
    home/                 ← HeroCarousel, CategoryBanners, FlashSale, PromoBanners
    catalog/              ← ProductCard, FilterSidebar, SortDropdown, ResultsGrid, AppliedFilters
    pdp/                  ← ImageGallery, VariantSelector, DeliveryEstimate, EMICalculator,
                             StickyAddToCart, ReviewsSection
    cart/                 ← CartDrawer, CartItem, PriceSummary
    checkout/             ← AddressStep, PaymentStep, OrderSummary
    auth/                 ← OTPInput, SocialLogin, ProtectedRoute
  app/
    page.tsx              ← Homepage (see @docs/DESIGN.md §5.1 for page order)
    search/page.tsx       ← PLP (see @docs/DESIGN.md §5.2)
    product/[slug]/page.tsx ← PDP (see @docs/DESIGN.md §5.3)
    cart/page.tsx
    checkout/page.tsx
    orders/page.tsx
    auth/                 ← login, register, otp pages
```

---

## Phase Plan (5-Phase V1 Build)

| Phase | Focus                                 | Status       |
|-------|---------------------------------------|--------------|
| 1     | Architecture & Setup                  | ✅ COMPLETE   |
| 2     | Layout & Homepage                     | ⬜ PENDING    |
| 3     | Product Catalog & Discovery (PLP/PDP) | ⬜ PENDING    |
| 4     | Cart, Checkout & Auth                 | ⬜ PENDING    |
| 5     | Orders, Wishlist & Polish             | ⬜ PENDING    |

**Before starting any phase**: read @docs/DESIGN.md in full.
**After any phase introduces a new design pattern**: update @docs/DESIGN.md before committing.

---

## Current Phase: Phase 1 — Architecture & Setup ✅

### Progress Log
- [2026-05-01] Phase 1 complete: CLAUDE.md, TODO.md authored; Next.js 14 scaffolded; design tokens
  registered from @docs/DESIGN.md; TypeScript strict config; base types, mock catalog (50 products),
  Zustand stores (cart/filter/auth), lib/utils created; folder skeleton in place.
- [2026-05-01] @docs/DESIGN.md added (brand colours, Playfair Display + DM Sans typography,
  component specs, motion rules, responsive behaviour, accessibility guidelines).
- [2026-05-01] CLAUDE.md and TODO.md updated to use @docs/DESIGN.md as design source of truth.
