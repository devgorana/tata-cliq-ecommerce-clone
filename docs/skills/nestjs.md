# nestjs.md — Fastify Module & Entity Patterns
_Phase 3 skill reference for building the V2 backend microservices._
_Read alongside @docs/ARCHITECTURE.md §12 (V2 extension points) before writing any backend code._

> **Important**: Do not install or scaffold any backend package before Phase 3.
> The V2 stack (`fastify`, `prisma`, `mongodb`, `ioredis`) is listed in `CLAUDE.md`
> under "V2 — Backend (Phase 3+ · DO NOT install before Phase 3)".

---

## 1. Introduction

The V2 backend is a set of **Fastify microservices** — not NestJS. The title of this file
uses "nestjs.md" as the skill identifier per the project requirement, but all patterns
here target Fastify with TypeScript, Prisma, and MongoDB, matching the stack declared
in `CLAUDE.md §Approved Stack`.

Each service follows the same module structure so that any team member (or Claude Code
session) can navigate any service without a learning curve. Entities are defined once in
Prisma schema and exposed via typed repository classes — no raw query strings in route handlers.

---

## 2. Fastify Overview

### Why Fastify over Express or NestJS

| Concern | Fastify | NestJS |
|---------|---------|--------|
| Performance | Fastest Node HTTP framework (benchmarks) | Moderate (Express under the hood by default) |
| TypeScript | First-class, no decorators required | Decorator-heavy (ts-experimental features) |
| Plugin system | Built-in, composable | Module system (heavier DI container) |
| Bundle size | Lightweight | Large (includes full DI framework) |
| Learning curve | Low — close to plain Node | High — Angular-like abstractions |

Fastify's plugin encapsulation model maps directly to the microservice boundary pattern
used in this project — each service is a self-contained Fastify application.

### Request Lifecycle

```
Client Request
     │
     ▼
Fastify onRequest hooks  ←── JWT verification, rate limiting
     │
     ▼
Route Handler            ←── Validates input (JSON Schema / Zod)
     │
     ▼
Service Layer            ←── Business logic, calls Repository
     │
     ▼
Repository Layer         ←── Prisma ORM queries
     │
     ▼
MongoDB / PostgreSQL
     │
     ▼
Serialized Response      ←── Fastify JSON serialization (fast-json-stringify)
```

---

## 3. Module Structure

Every V2 microservice follows this identical directory layout:

```
src/
  services/
    catalog-service/
      ├── index.ts            ← Fastify app entry point (buildApp factory)
      ├── routes/
      │   ├── products.ts     ← Route definitions (GET /products, GET /products/:slug)
      │   └── categories.ts
      ├── handlers/
      │   ├── getProducts.ts  ← One handler per route — thin, delegates to service
      │   └── getProduct.ts
      ├── services/
      │   └── ProductService.ts ← Business logic layer
      ├── repositories/
      │   └── ProductRepository.ts ← Prisma queries only
      ├── schemas/
      │   ├── product.schema.ts   ← JSON Schema for request validation + response serialization
      │   └── filter.schema.ts
      ├── plugins/
      │   ├── prisma.plugin.ts    ← Decorates app with prisma client
      │   └── auth.plugin.ts      ← JWT verification hook
      └── types/
          └── index.ts            ← Service-local types (re-exports shared types if needed)
```

**Rule**: A handler never touches Prisma directly. A repository never contains business logic.
A service never imports from `routes/` or `handlers/`.

---

## 4. Fastify App Entry Point

```ts
// src/services/catalog-service/index.ts
import Fastify from "fastify";
import { prismaPlugin } from "./plugins/prisma.plugin";
import { authPlugin } from "./plugins/auth.plugin";
import { productRoutes } from "./routes/products";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(prismaPlugin);
  await app.register(authPlugin);
  await app.register(productRoutes, { prefix: "/api/v1" });

  return app;
}

// src/services/catalog-service/server.ts (entry for production)
import { buildApp } from "./index";

const app = await buildApp();
await app.listen({ port: 3001, host: "0.0.0.0" });
```

---

## 5. Route Definitions

Routes are thin — they declare the URL, HTTP method, schema, and delegate to a handler.
No business logic lives here.

```ts
// src/services/catalog-service/routes/products.ts
import { FastifyPluginAsync } from "fastify";
import { getProductsHandler } from "../handlers/getProducts";
import { getProductHandler } from "../handlers/getProduct";
import { getProductsSchema, getProductSchema } from "../schemas/product.schema";

export const productRoutes: FastifyPluginAsync = async (app) => {
  app.get("/products", { schema: getProductsSchema }, getProductsHandler);
  app.get("/products/:slug", { schema: getProductSchema }, getProductHandler);
};
```

---

## 6. Request / Response Schemas

Fastify validates requests and serializes responses using JSON Schema.
Define schemas separately so they can be imported by both routes and OpenAPI docs.

```ts
// src/services/catalog-service/schemas/product.schema.ts
import { FastifySchema } from "fastify";

export const getProductsSchema: FastifySchema = {
  querystring: {
    type: "object",
    properties: {
      category: { type: "string", enum: ["fashion", "electronics", "luxury", "home"] },
      minPrice: { type: "number", minimum: 0 },
      maxPrice: { type: "number", minimum: 0 },
      sortBy: {
        type: "string",
        enum: ["relevance", "price-asc", "price-desc", "newest", "rating", "discount"],
      },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 48, default: 24 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        products: { type: "array", items: { $ref: "ProductSchema#" } },
        total: { type: "integer" },
        page: { type: "integer" },
      },
      required: ["products", "total", "page"],
    },
  },
};
```

---

## 7. Handlers

Handlers extract request data, call the service layer, and return the response.
They contain no database code and no business logic.

```ts
// src/services/catalog-service/handlers/getProducts.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/ProductService";

interface GetProductsQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page: number;
  limit: number;
}

export async function getProductsHandler(
  request: FastifyRequest<{ Querystring: GetProductsQuery }>,
  reply: FastifyReply
) {
  const service = new ProductService(request.server.prisma);
  const result = await service.getProducts(request.query);
  reply.send(result);
}
```

---

## 8. Service Layer

Business logic lives here: filtering rules, pagination, discount calculations,
stock checks, and any domain invariants.

```ts
// src/services/catalog-service/services/ProductService.ts
import { PrismaClient } from "@prisma/client";
import { ProductRepository } from "../repositories/ProductRepository";

interface GetProductsInput {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page: number;
  limit: number;
}

export class ProductService {
  private repo: ProductRepository;

  constructor(prisma: PrismaClient) {
    this.repo = new ProductRepository(prisma);
  }

  async getProducts(input: GetProductsInput) {
    const skip = (input.page - 1) * input.limit;

    const [products, total] = await Promise.all([
      this.repo.findMany({
        category: input.category,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        sortBy: input.sortBy,
        skip,
        take: input.limit,
      }),
      this.repo.count({ category: input.category }),
    ]);

    return { products, total, page: input.page };
  }
}
```

---

## 9. Repository Layer

The repository is the only place Prisma queries are written.
All methods are typed; no raw SQL or `$queryRaw` unless documented with a comment explaining why.

```ts
// src/services/catalog-service/repositories/ProductRepository.ts
import { PrismaClient, Prisma } from "@prisma/client";

interface FindManyOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  skip: number;
  take: number;
}

export class ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(opts: FindManyOptions) {
    const where: Prisma.ProductWhereInput = {};

    if (opts.category) where.category = opts.category;
    if (opts.minPrice !== undefined) where.basePrice = { gte: opts.minPrice };
    if (opts.maxPrice !== undefined) {
      where.basePrice = { ...((where.basePrice as object) ?? {}), lte: opts.maxPrice };
    }

    const orderBy = this.resolveOrderBy(opts.sortBy);

    return this.prisma.product.findMany({ where, orderBy, skip: opts.skip, take: opts.take });
  }

  async count(opts: Pick<FindManyOptions, "category">) {
    return this.prisma.product.count({
      where: opts.category ? { category: opts.category } : undefined,
    });
  }

  private resolveOrderBy(sortBy?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case "price-asc":  return { basePrice: "asc" };
      case "price-desc": return { basePrice: "desc" };
      case "rating":     return { rating: "desc" };
      case "newest":     return { createdAt: "desc" };
      default:           return { createdAt: "desc" };
    }
  }
}
```

---

## 10. Entity Management with Prisma

### 10.1 Schema Design Principles

- One Prisma model per domain entity — mirrors `src/types/index.ts` shapes exactly.
- Use `@@map` to align MongoDB collection names with the naming convention.
- Relations are explicit — no implicit magic.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  slug        String   @unique
  name        String
  brand       String
  category    String
  basePrice   Float
  rating      Float?
  variants    Variant[]
  images      Image[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

model Variant {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  productId       String   @db.ObjectId
  product         Product  @relation(fields: [productId], references: [id])
  size            String?
  color           String?
  stock           Int      @default(0)
  salePrice       Float
  additionalPrice Float    @default(0)

  @@map("variants")
}

model Image {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  productId String  @db.ObjectId
  product   Product @relation(fields: [productId], references: [id])
  url       String
  alt       String
  isMain    Boolean @default(false)

  @@map("product_images")
}
```

### 10.2 Migration Strategy

```bash
# Generate client after schema changes
npx prisma generate

# Push schema to MongoDB (no migration files — Mongo is schema-less)
npx prisma db push

# Seed initial data from mock-catalog.ts
npx prisma db seed
```

---

## 11. Prisma Plugin (Fastify Decorator)

The Prisma client is registered as a Fastify plugin so it is available across all routes
via `request.server.prisma` — no singleton imports needed.

```ts
// src/services/catalog-service/plugins/prisma.plugin.ts
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const prismaPlugin = fp(async (app) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
```

---

## 12. Error Handling

Use Fastify's built-in error reply with consistent shapes across all services.

```ts
// Throw from service or handler — Fastify catches and serializes
import { createError } from "@fastify/error";

const ProductNotFound = createError("PRODUCT_NOT_FOUND", "Product not found: %s", 404);

// In handler:
if (!product) throw new ProductNotFound(slug);
```

Response shape:
```json
{
  "statusCode": 404,
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product not found: navy-blazer"
}
```

---

## 13. Environment Variables

All service config comes from environment variables — never hardcoded.

```env
# .env (never committed — use .env.example as template)
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/tatacliq"
JWT_SECRET="your-rs256-private-key"
PORT=3001
REDIS_URL="redis://localhost:6379"
```

---

_Last updated: 2026-05-01 — Phase 3 reference established (pre-implementation)._
_Update this file when the first Fastify service is scaffolded in Phase 3._
