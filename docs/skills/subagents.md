# subagents.md — Parallel Task Coordination
_Phase 3 skill reference for orchestrating multi-agent Claude Code sessions._
_Read alongside @docs/ARCHITECTURE.md before decomposing any large task into sub-agents._

---

## 1. Introduction

As the project grows into Phase 3+ (PLP/PDP, Cart, Checkout, Backend), tasks become
large enough that a single Claude Code session hits context limits before finishing.
Sub-agents solve this by isolating independent work into parallel or sequential child
sessions, each with a focused context and a clear output contract.

This document defines when to spawn sub-agents, how to write effective prompts for them,
and how to coordinate their outputs back into the main codebase.

---

## 2. When to Use Sub-Agents

### Use sub-agents when

| Signal | Example |
|--------|---------|
| Two tasks share no files | Building `FilterSidebar` while building `ImageGallery` |
| A task needs deep search without polluting main context | "Find all places that use `basePrice` across src/" |
| A task produces large output (full component) | Generating a 200-line `HeroCarousel` |
| Tasks can genuinely run in parallel | Linting + type-checking + test-running |
| A phase has 4+ independent components | Phase 2: Header, Footer, HeroCarousel, CategoryBanners |

### Do not use sub-agents when

| Signal | Reason |
|--------|--------|
| Tasks share a file | Concurrent edits cause conflicts |
| Task B depends on Task A's output | Run sequentially, not in parallel |
| The task is a single Edit | Overhead not worth it |
| You need the agent's reasoning, not just its output | Main session handles nuanced decisions |

---

## 3. Agent Types Available

| Agent type | Best for | Tools |
|------------|----------|-------|
| `Explore` | Codebase search, finding file locations, grepping symbols | Read, Glob, Grep, WebSearch |
| `general-purpose` | Multi-step research, unknown file structures | All tools |
| `Plan` | Architecture design, implementation strategy | Read, Glob, Grep (no Edit/Write) |
| (default) | Code generation, file editing, multi-step tasks | All tools including Edit/Write |

---

## 4. Parallel Coordination Pattern

The most common pattern: spawn N independent agents in one message, collect results,
then integrate.

### Step 1 — Identify independent tasks

Decompose the phase into tasks with no shared files.

```
Phase 2 — Layout & Homepage
  Task A: Header component          → src/components/layout/Header.tsx
  Task B: Footer component          → src/components/layout/Footer.tsx
  Task C: HeroCarousel component    → src/components/home/HeroCarousel.tsx
  Task D: CategoryBanners component → src/components/home/CategoryBanners.tsx
```

Tasks A–D touch no shared files → safe to parallelize.

### Step 2 — Write a self-contained prompt for each agent

Every sub-agent starts with zero context from the parent session.
The prompt must include:

1. **What to build** — exact component name, file path
2. **Design spec** — the relevant section of @docs/DESIGN.md
3. **Type contracts** — the interfaces from `src/types/index.ts` it will use
4. **Import rules** — which stores/hooks/utils are available
5. **What NOT to do** — guard rails (no inline styles, no CSS Modules, no relative imports)
6. **Output contract** — what file to write and what the export should look like

### Step 3 — Spawn all agents in a single message

```
// Conceptual — main Claude Code session sends one message with multiple Agent calls:

Agent({ task: "Build Header component", prompt: <header-prompt> })
Agent({ task: "Build Footer component", prompt: <footer-prompt> })
Agent({ task: "Build HeroCarousel component", prompt: <carousel-prompt> })
```

### Step 4 — Verify outputs before integrating

After all agents complete:
- Read each generated file to confirm it matches the spec.
- Run `tsc --noEmit` to catch type errors across all new files.
- Check that no agent introduced a forbidden import (e.g. a `catalog/` component importing from `pdp/`).

---

## 5. Sequential Coordination Pattern

Use when Task B requires Task A's output file to exist first.

```
Phase 3 — PLP
  Task A: Define FilterSidebar props interface in src/types/index.ts
  Task B (depends on A): Build FilterSidebar.tsx — reads the interface from Task A
  Task C (depends on B): Build ResultsGrid.tsx — imports FilterSidebar
```

Run tasks serially — do not spawn B until A is committed.

---

## 6. Sub-Agent Prompt Template

Use this template for every sub-agent prompt. Fill in all sections — terse prompts
produce generic, non-spec-compliant output.

```
## Task
Build the [ComponentName] React component and write it to:
  src/components/[folder]/[ComponentName].tsx

## Design Spec
This component corresponds to @docs/DESIGN.md §[X.Y]. Key requirements:
  - [List the 3–5 most important spec points verbatim from DESIGN.md]
  - All Tailwind classes must use registered tokens (e.g. bg-accent-red, not bg-[#E31837])
  - Responsive: include sm: / md: / lg: variants on all layout classes
  - Breakpoints: < 480px mobile | 480-767px sm | 768-1023px md | ≥1024px lg

## Type Contracts
The component uses these interfaces from src/types/index.ts:
  [Paste the exact interface definitions]

## Available Imports
  - @/lib/utils → cn(), formatCurrency(), formatDate()
  - @/store/useCartStore → only if this is a "use client" component that manages cart state
  - lucide-react → icon library (see @docs/DESIGN.md §9 for required icon names)
  - No other store imports unless specified

## Rules
  - TypeScript strict — no `any`
  - "use client" directive only if the component uses hooks or event handlers
  - No CSS Modules, no inline styles — Tailwind only
  - One component, one file, one export (named export, not default)
  - All interactive elements: aria-label if icon-only, min 44×44px touch target
  - Do not modify any other file

## Output Contract
Export: export function [ComponentName]({ ... }: [ComponentName]Props)
File:   src/components/[folder]/[ComponentName].tsx
```

---

## 7. Use Cases — Phase-by-Phase Examples

### Phase 2 — Layout & Homepage

**Parallel batch 1** (no shared files):
- Header component
- Footer component

**Parallel batch 2** (after batch 1 — HeroCarousel needs Header to exist for layout testing):
- HeroCarousel component
- CategoryBanners component
- PromoBanners component (2-up and 3-up variants)

**Sequential**:
1. Homepage `page.tsx` — composes all batch 1+2 components (runs after both batches)

---

### Phase 3 — PLP & PDP

**Parallel batch 1**:
- `FilterSidebar` component
- `SortDropdown` component
- `AppliedFilters` component

**Parallel batch 2** (after batch 1):
- `ResultsGrid` — imports FilterSidebar layout
- `ProductCard` — standalone

**Sequential**:
1. `search/page.tsx` — composes ResultsGrid + FilterSidebar
2. `product/[slug]/page.tsx` — PDP page (SSR, calls `getProductBySlug` directly)

---

### Phase 3 — Backend Fastify Services

**Parallel batch** (each service is a fully isolated directory):
- `catalog-service` — GET /products, GET /products/:slug
- `auth-service` — POST /auth/otp/send, POST /auth/otp/verify
- `cart-service` — CRUD /cart (Redis-backed)

Each service agent receives the full Fastify module structure from §3 of this file
and the relevant Prisma schema excerpt.

---

## 8. Output Integration Checklist

After all sub-agents complete, run this checklist before committing:

- [ ] All new files exist at their declared paths
- [ ] `tsc --noEmit` passes with zero errors
- [ ] No forbidden cross-module imports (see @docs/ARCHITECTURE.md §11)
- [ ] All components use registered Tailwind tokens only
- [ ] All interactive elements have correct ARIA attributes
- [ ] `sm:` / `md:` / `lg:` responsive variants present on layout classes
- [ ] No component uses relative imports (`../../`) — `@/` alias only
- [ ] No `any` type in any generated file
- [ ] Design spec checklist in @docs/DESIGN.md §11 updated for newly completed components

---

## 9. Context Budget Guidelines

| Task size | Strategy |
|-----------|----------|
| Single component < 150 lines | Main session — no sub-agent needed |
| 2–4 independent components | Parallel sub-agents, one per component |
| Full phase (5+ components + page) | Parallel batches + sequential assembly |
| Large codebase search (grep across all src/) | `Explore` sub-agent — prevents search noise in main context |
| Architecture decisions | `Plan` sub-agent — returns a plan, human approves before coding starts |

---

## 10. Anti-Patterns to Avoid

| Anti-pattern | Why it fails | Correct approach |
|--------------|--------------|------------------|
| Spawning an agent for every tiny edit | Overhead exceeds benefit | Use Edit tool directly |
| Parallel agents that both write to `src/types/index.ts` | Write conflict | Do types in main session first, then parallelize components |
| Vague prompt ("build a product card") | Agent invents its own spec | Reference @docs/DESIGN.md §4.6 verbatim in the prompt |
| Assuming agent has conversation context | It doesn't — blank slate | Make every prompt self-contained |
| Integrating agent output without reading it | May not match spec | Always read + verify before committing |

---

_Last updated: 2026-05-01 — Phase 3 reference established (pre-implementation)._
_Update use-cases section as each phase's parallel strategy is validated._
