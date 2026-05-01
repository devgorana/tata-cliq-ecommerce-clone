# TODO.md — Tata CLiQ E-Commerce Clone
_Task-level checklist. Mark [~] = in-progress, [x] = done, [ ] = pending._

---

## Phase 1 — Architecture & Setup
- [x] Author CLAUDE.md (design tokens, rules, stack, phase plan)
- [x] Author TODO.md (this file)
- [x] Scaffold Next.js 14 project (`npx create-next-app`)
- [x] Configure `tailwind.config.ts` with all design tokens
- [x] Configure `tsconfig.json` strict mode
- [x] Install and init shadcn/ui
- [x] Install Zustand, TanStack Query, lucide-react, clsx, tailwind-merge
- [x] Create `src/types/index.ts` — Product, ProductVariant, CartItem, Order, FilterState, User
- [x] Create `src/data/mock-catalog.ts` — 50 typed products (Fashion × 15, Electronics × 15, Luxury × 10, Home × 10)
- [x] Create `src/store/useCartStore.ts`
- [x] Create `src/store/useFilterStore.ts`
- [x] Create `src/store/useAuthStore.ts`
- [x] Create `src/lib/utils.ts` — cn(), formatCurrency(), formatDate()
- [x] Create `src/hooks/useProducts.ts`
- [x] Create `.env.example`
- [x] Verify `npm run dev` starts clean with no errors
- [x] git commit: `feat: phase-1-scaffold`

---

## Phase 2 — Layout & Homepage
- [ ] Create `src/components/layout/Header.tsx` (sticky, navy, search, cart badge, profile)
- [ ] Create `src/components/layout/MegaMenu.tsx` (hover dropdown, keyboard nav)
- [ ] Create `src/components/layout/Footer.tsx` (4-col links, app CTAs, social, newsletter)
- [ ] Create `src/components/layout/BottomNav.tsx` (mobile only, 5 tabs)
- [ ] Create `src/components/home/HeroCarousel.tsx` (auto-play, swipe, LQIP)
- [ ] Create `src/components/home/CategoryBanners.tsx` (4 tiles, hover animation)
- [ ] Create `src/components/home/FlashSaleModule.tsx` (countdown timer, progress bar)
- [ ] Create `src/components/home/PromoBanners.tsx` (CLiQ Cash strip, deal cards)
- [ ] Wire `src/app/page.tsx` — compose homepage from above components
- [ ] Mobile test all at 375px
- [ ] git commit: `feat: phase-2-homepage`

---

## Phase 3 — Product Catalog & Discovery
- [ ] Create `src/components/catalog/ProductCard.tsx`
- [ ] Create `src/components/catalog/FilterSidebar.tsx` (sticky, Sheet on mobile)
- [ ] Create `src/components/catalog/AppliedFilters.tsx` (chips, clear all)
- [ ] Create `src/components/catalog/SortDropdown.tsx` (shadcn Select)
- [ ] Create `src/components/catalog/ResultsGrid.tsx` (grid/list, skeleton, infinite scroll)
- [ ] Create `src/app/search/page.tsx` — PLP wired to FilterStore + useProducts
- [ ] Create `src/components/pdp/ImageGallery.tsx` (60/40, pinch-zoom, thumbnails)
- [ ] Create `src/components/pdp/VariantSelector.tsx` (size pills, colour swatches, OOS states)
- [ ] Create `src/components/pdp/DeliveryEstimate.tsx` (pincode, mock delivery date)
- [ ] Create `src/components/pdp/EMICalculator.tsx` (bank tabs, tenure, monthly EMI)
- [ ] Create `src/components/pdp/StickyAddToCart.tsx` (IntersectionObserver trigger)
- [ ] Create `src/components/pdp/ReviewsSection.tsx` (star breakdown, photo reviews)
- [ ] Create `src/app/product/[slug]/page.tsx` — PDP SSR page
- [ ] Mobile test PLP + PDP at 375px
- [ ] git commit: `feat: phase-3-catalog`

---

## Phase 4 — Cart, Checkout & Auth
- [ ] Create `src/components/cart/CartDrawer.tsx` (shadcn Sheet, slide-in)
- [ ] Create `src/components/cart/CartItem.tsx` (image, name, variant, qty stepper, remove)
- [ ] Create `src/components/cart/PriceSummary.tsx` (subtotal, discount, delivery, total)
- [ ] Create `src/app/cart/page.tsx`
- [ ] Create `src/components/checkout/AddressStep.tsx` (form validation)
- [ ] Create `src/components/checkout/PaymentStep.tsx` (simulated — mock UPI/Card/COD)
- [ ] Create `src/components/checkout/OrderSummary.tsx`
- [ ] Create `src/app/checkout/page.tsx` (multi-step wizard)
- [ ] Create `src/components/auth/OTPInput.tsx` (6-digit, auto-focus advance)
- [ ] Create `src/components/auth/SocialLogin.tsx` (Google button, mock)
- [ ] Create `src/components/auth/ProtectedRoute.tsx`
- [ ] Create `src/app/auth/login/page.tsx`
- [ ] Create `src/app/auth/register/page.tsx`
- [ ] Create `src/app/auth/otp/page.tsx`
- [ ] Mobile test checkout flow at 375px
- [ ] git commit: `feat: phase-4-cart-checkout-auth`

---

## Phase 5 — Orders, Wishlist & Polish
- [ ] Create `src/hooks/useOrders.ts` (mock order history)
- [ ] Create `src/app/orders/page.tsx` (order list + status badges)
- [ ] Order detail / tracking page with 7-state timeline
- [ ] Wishlist heart toggle wired across ProductCard + PDP
- [ ] CLiQ Cash balance display in header + checkout
- [ ] Responsive audit — all pages at 320, 375, 480, 768, 1024, 1280, 1440px
- [ ] WCAG pass — keyboard nav, aria-labels, colour contrast
- [ ] `next/image` LQIP on all product images
- [ ] `vercel.json` + final `npm run build` with zero errors
- [ ] git commit: `feat: phase-5-polish`
- [ ] git commit: `feat: phase-5-vercel-deploy`

---

## Blocked / Assumptions
- V2 backend (Fastify, MongoDB, Razorpay) is out of scope for this V1 build
- All data uses TypeScript mock constants — no live API calls
- Auth is UI-only (Zustand memory session, no real JWT)
- Payments show "Order Placed" confirmation screen only
