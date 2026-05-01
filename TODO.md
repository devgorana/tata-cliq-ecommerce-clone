# TODO.md — Tata CLiQ E-Commerce Clone
_Task-level checklist. Mark [~] = in-progress, [x] = done, [ ] = pending._

---

## ⚠ Design Maintenance — Standing Rules (apply to every phase)

These tasks apply whenever **any** design decision is made or changed.
They are not phase-specific — they are permanent project habits.

- [ ] Before writing any UI component → read @docs/DESIGN.md in full
- [ ] When a new colour or token is added → update @docs/DESIGN.md §2.1 AND `tailwind.config.ts` in the same commit
- [ ] When a font or type scale changes → update @docs/DESIGN.md §2.2
- [ ] When a new component is designed → add its spec to @docs/DESIGN.md §4 before coding it
- [ ] When a new animation or hover state is introduced → add to @docs/DESIGN.md §6
- [ ] When responsive behaviour changes → update @docs/DESIGN.md §7
- [ ] When an accessibility rule is added or changed → update @docs/DESIGN.md §10
- [ ] When a new page layout is agreed → add its template to @docs/DESIGN.md §5
- [ ] @docs/DESIGN.md must be updated **before** the related code change is committed
- [ ] Implementation checklist in @docs/DESIGN.md §11 must be ticked off as components are built

## ⚠ Architecture Maintenance — Standing Rules (apply to every phase)

These tasks apply whenever **any** structural or technical decision is made or changed.

- [ ] Before adding a new module or folder → check @docs/ARCHITECTURE.md §4 to confirm it fits the module map
- [ ] When a new hook is created → verify it follows the data-flow rules in @docs/ARCHITECTURE.md §7
- [ ] When a new Zustand store is introduced → add it to @docs/ARCHITECTURE.md §6 store diagram
- [ ] When a new page route is added → add it to the routing table in @docs/ARCHITECTURE.md §8
- [ ] When a module's import dependencies change → verify no rules in @docs/ARCHITECTURE.md §11 are broken
- [ ] When a significant technical decision is made → add an ADR entry to @docs/ARCHITECTURE.md §13
- [ ] When a V2 extension point is used or changed → update @docs/ARCHITECTURE.md §12
- [ ] @docs/ARCHITECTURE.md must be updated in the same commit as the structural change

---

## Phase 1 — Architecture & Setup
- [x] Author CLAUDE.md (design tokens, rules, stack, phase plan)
- [x] Author TODO.md (this file)
- [x] Scaffold Next.js 14 project
- [x] Configure `tailwind.config.ts` with all design tokens from @docs/DESIGN.md §2.1
- [x] Configure `tsconfig.json` strict mode
- [x] Install shadcn/ui
- [x] Install Zustand, TanStack Query, lucide-react (see @docs/DESIGN.md §9), clsx, tailwind-merge
- [x] Create `src/types/index.ts` — Product, ProductVariant, CartItem, Order, FilterState, User
- [x] Create `src/data/mock-catalog.ts` — 50 typed products (Fashion × 15, Electronics × 15, Luxury × 10, Home × 10)
- [x] Create `src/store/useCartStore.ts`
- [x] Create `src/store/useFilterStore.ts`
- [x] Create `src/store/useAuthStore.ts`
- [x] Create `src/lib/utils.ts` — cn(), formatCurrency(), formatDate()
- [x] Create `src/hooks/useProducts.ts`
- [x] Create `.env.example`
- [x] Add @docs/DESIGN.md (brand spec — colours, fonts, components, motion, a11y)
- [x] Update CLAUDE.md and TODO.md to reference @docs/DESIGN.md as design source of truth
- [x] Verify `npm run build` passes with zero errors
- [x] git commit: `feat: phase-1-scaffold`
- [x] git commit: `chore: add docs/DESIGN.md and reference in CLAUDE.md`

---

## Phase 2 — Layout & Homepage ✅ COMPLETE
> Read @docs/DESIGN.md §4.1–§4.4, §5.1, §6, §7, §10 before starting this phase.

- [x] Review @docs/DESIGN.md §4.2 (nav spec) and §4.3 (mega-menu spec) before Header/MegaMenu
- [x] Create `src/components/layout/Header.tsx`
  - sticky top-0, white bg + scroll shadow, announcement bar auto-rotating
  - search bar (480px desktop, collapsed on mobile — @docs/DESIGN.md §4.2)
  - cart badge, wishlist icon, account icon (lucide-react — @docs/DESIGN.md §9)
- [x] Create `src/components/layout/MegaMenu.tsx`
  - hover dropdown, full-width, 3-column layout — @docs/DESIGN.md §4.3
  - 7 categories with subcategories, brand grid, promo image
- [x] Create `src/components/layout/Footer.tsx`
  - 4-col links grid, navy bg — @docs/DESIGN.md §4.13
  - social icons (inline SVG), app download CTAs, payment method pills
- [x] Create `src/components/layout/BottomNav.tsx`
  - mobile only (`md:hidden`), 5 tabs — @docs/DESIGN.md §7
  - min tap target 44×44px — @docs/DESIGN.md §10
- [x] Review @docs/DESIGN.md §4.4 (carousel spec) before HeroCarousel
- [x] Create `src/components/home/HeroCarousel.tsx`
  - 240px mobile / 480px desktop, 5s auto-slide, pauses on hover — @docs/DESIGN.md §4.4
  - Playfair Display headline, DM Sans sub-text — @docs/DESIGN.md §2.2
  - dot indicators + chevrons, full ARIA roledescription
- [x] Create `src/components/home/CategoryBanners.tsx`
  - horizontal scroll strip, 72px circle items — @docs/DESIGN.md §4.5
  - scale(1.05) hover — @docs/DESIGN.md §6
- [x] Create `src/components/home/FlashSaleModule.tsx`
  - live countdown timer, per-product stock progress bar
  - accent-red theme from @docs/DESIGN.md §2.1
- [x] Create `src/components/home/PromoBanners.tsx`
  - 2-up and 3-up grid layouts — @docs/DESIGN.md §4.9
- [x] Create `src/components/home/SectionHeader.tsx` — eyebrow + title + View All
- [x] Wire `src/app/page.tsx` — homepage composed per @docs/DESIGN.md §5.1 order
- [x] Fonts loaded in layout.tsx: Playfair Display (400/600/700) + DM Sans (300/400/500/600)
- [x] tailwind.config.ts updated: fontFamily.display + fontFamily.body tokens
- [x] `npm run build` passes — zero errors
- [ ] Mobile test all components at 375px (bottom nav, carousel, banners)
- [ ] Verify colour contrast meets WCAG AA — @docs/DESIGN.md §10
- [ ] git commit: `feat: phase-2-homepage`

---

## Phase 3 — Product Catalog & Discovery ✅ COMPLETE
> Read @docs/DESIGN.md §4.6 (product card), §4.7 (section headers), §5.2 (PLP), §5.3 (PDP) before starting.

- [x] Review @docs/DESIGN.md §4.6 (card spec) before ProductCard
- [x] Create `src/components/catalog/ProductCard.tsx`
  - 3:4 portrait image, brand UPPERCASE 11px, DM Sans — @docs/DESIGN.md §4.6
  - wishlist heart top-right, sale/new badge top-left — @docs/DESIGN.md §4.6
  - hover scale(1.03) + shadow — @docs/DESIGN.md §4.6, §6
  - 2-col mobile, 4-col desktop — @docs/DESIGN.md §7
- [x] Create `src/components/catalog/FilterSidebar.tsx`
  - sticky desktop sidebar, drawer on mobile — @docs/DESIGN.md §5.2, §7
  - size selector chips match @docs/DESIGN.md §4.11 spec
- [x] Create `src/components/catalog/AppliedFilters.tsx` (chips, clear all)
- [x] Create `src/components/catalog/SortDropdown.tsx` (custom dropdown — no shadcn installed)
- [x] Create `src/components/catalog/ResultsGrid.tsx`
  - 4/3/2 col responsive — @docs/DESIGN.md §7
  - skeleton shimmer loaders — @docs/DESIGN.md §6
  - "Load More" pagination — @docs/DESIGN.md §5.2
- [x] Create `src/app/search/page.tsx` — PLP wired to FilterStore + useProducts
- [x] Review @docs/DESIGN.md §5.3 (PDP layout) before image gallery
- [x] Create `src/components/pdp/ImageGallery.tsx`
  - 55% image / 45% info desktop split — @docs/DESIGN.md §5.3
  - vertical thumbnail strip, zoom on hover — @docs/DESIGN.md §5.3
- [x] Create `src/components/pdp/VariantSelector.tsx`
  - size chips per @docs/DESIGN.md §4.11 (selected = red bg, disabled = strikethrough)
  - colour swatches
- [x] Create `src/components/pdp/DeliveryEstimate.tsx` (pincode, mock delivery date)
- [x] Create `src/components/pdp/EMICalculator.tsx` (bank tabs, tenure, monthly EMI)
- [x] Create `src/components/pdp/StickyAddToCart.tsx`
  - mobile sticky bottom — @docs/DESIGN.md §7
  - Add to Cart / Buy Now buttons per @docs/DESIGN.md §4.10
- [x] Create `src/components/pdp/ReviewsSection.tsx` (star breakdown, mock reviews)
- [x] Add CLiQ Promise trust badges (`src/components/pdp/CLiQPromise.tsx`) per @docs/DESIGN.md §8.1
- [x] Add offer/coupon tags (`src/components/pdp/OfferTags.tsx`) per @docs/DESIGN.md §8.2
- [x] Add NeuCoins display (`src/components/pdp/NeuCoins.tsx`) per @docs/DESIGN.md §8.3
- [x] Create `src/components/pdp/PDPActions.tsx` — client wrapper for variant + cart
- [x] Create `src/app/product/[slug]/page.tsx` — PDP SSG page (50 static paths)
- [x] Tick off completed items in @docs/DESIGN.md §11 implementation checklist
- [ ] Mobile test PLP + PDP at 375px
- [x] `npm run build` passes — zero errors, 55 pages generated
- [ ] git commit: `feat: phase-3-catalog`

---

## Phase 4 — Cart, Checkout & Auth
> Read @docs/DESIGN.md §4.10 (buttons), §4.12 (toast), §6 (motion), §10 (a11y) before starting.

- [ ] Create `src/components/cart/CartDrawer.tsx`
  - shadcn Sheet, slide-in — @docs/DESIGN.md §6 motion rules
  - aria-live region for cart updates — @docs/DESIGN.md §10
- [ ] Create `src/components/cart/CartItem.tsx`
  - image, name, variant, qty stepper, remove
  - Add to Cart / Buy Now button spec from @docs/DESIGN.md §4.10
- [ ] Create `src/components/cart/PriceSummary.tsx` (subtotal, discount, delivery, total)
- [ ] Create `src/app/cart/page.tsx`
- [ ] Create `src/components/checkout/AddressStep.tsx`
  - form validation, input styles from @docs/DESIGN.md §3.2 (radius) and §3.3 (shadows)
- [ ] Create `src/components/checkout/PaymentStep.tsx` (simulated — mock UPI/Card/COD)
- [ ] Create `src/components/checkout/OrderSummary.tsx`
- [ ] Create `src/app/checkout/page.tsx` (multi-step wizard)
- [ ] Add Toast/Snackbar component per @docs/DESIGN.md §4.12
  - bottom-center, slide-up animation, 3s dismiss
- [ ] Create `src/components/auth/OTPInput.tsx` (6-digit, auto-focus advance)
- [ ] Create `src/components/auth/SocialLogin.tsx` (Google button, mock)
- [ ] Create `src/components/auth/ProtectedRoute.tsx`
- [ ] Create `src/app/auth/login/page.tsx`
- [ ] Create `src/app/auth/register/page.tsx`
- [ ] Create `src/app/auth/otp/page.tsx`
- [ ] Verify all form inputs meet 44×44px tap target — @docs/DESIGN.md §10
- [ ] Verify focus rings are visible (2px red, 2px offset) — @docs/DESIGN.md §10
- [ ] Tick off completed items in @docs/DESIGN.md §11 implementation checklist
- [ ] If any new design pattern was introduced, update @docs/DESIGN.md before committing
- [ ] Mobile test checkout flow at 375px
- [ ] git commit: `feat: phase-4-cart-checkout-auth`

---

## Phase 5 — Orders, Wishlist & Polish
> Read @docs/DESIGN.md §6 (motion), §7 (responsive), §10 (a11y) for the final audit.
> Read @docs/ARCHITECTURE.md §6 (state) and §11 (module boundaries) before adding any new hooks or stores.

- [ ] Create `src/hooks/useOrders.ts` (mock order history)
- [ ] Create `src/app/orders/page.tsx` (order list + status badges using @docs/DESIGN.md colours)
- [ ] Order detail / tracking page with 7-state timeline
- [ ] Wishlist heart toggle — pop + fill animation per @docs/DESIGN.md §6
- [ ] NeuCoins/CLiQ Cash display in header + checkout — gold colour from @docs/DESIGN.md §2.1
- [ ] Add "Back to top" button (appears after 400px scroll) — @docs/DESIGN.md §6
- [ ] Skeleton loaders on all async sections — shimmer per @docs/DESIGN.md §6
- [ ] Full responsive audit at 320, 375, 480, 768, 1024, 1280, 1440px — @docs/DESIGN.md §7
- [ ] WCAG AA colour contrast audit — all pairs per @docs/DESIGN.md §10
- [ ] Keyboard navigation audit (Tab order, focus rings) — @docs/DESIGN.md §10
- [ ] ARIA labels on all icon-only buttons — @docs/DESIGN.md §10
- [ ] `next/image` LQIP on all product images — fade-in on intersection per @docs/DESIGN.md §6
- [ ] Verify all @docs/DESIGN.md §11 implementation checklist items are ticked
- [ ] Final review: confirm @docs/DESIGN.md reflects the as-built design (no drift)
- [ ] Final review: confirm @docs/ARCHITECTURE.md ADR log and module map reflect the as-built structure
- [ ] `vercel.json` + final `npm run build` with zero errors
- [ ] git commit: `feat: phase-5-polish`
- [ ] git commit: `feat: phase-5-vercel-deploy`

---

## Blocked / Assumptions
- V2 backend (Fastify, MongoDB, Razorpay) is out of scope for this V1 build
- All data uses TypeScript mock constants — no live API calls
- Auth is UI-only (Zustand memory session, no real JWT)
- Payments show "Order Placed" confirmation screen only

---

## Design Change Log
_Record every change to @docs/DESIGN.md here with a date and reason._

| Date       | Section changed         | What changed                                 | Reason |
|------------|-------------------------|----------------------------------------------|--------|
| 2026-05-01 | Created @docs/DESIGN.md | Full brand spec added                        | Phase 0b design system authoring |
| 2026-05-01 | CLAUDE.md + TODO.md     | All design refs now point to @docs/DESIGN.md | Single source of truth rule |
| 2026-05-01 | @docs/DESIGN.md §11     | Ticked off Phase 2 + Phase 3 built components | Phase 3 completion |

---

## Architecture Change Log
_Record every change to @docs/ARCHITECTURE.md here with a date and reason._

| Date       | Section changed              | What changed                                         | Reason |
|------------|------------------------------|------------------------------------------------------|--------|
| 2026-05-01 | Created @docs/ARCHITECTURE.md | Full module map, data flow, naming conventions, module boundary rules, V2 extension points, ADR-001 through ADR-007 | Phase 1 architecture documentation |
| 2026-05-01 | CLAUDE.md + TODO.md          | References to @docs/ARCHITECTURE.md added            | Architecture as living document |
