"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, MapPin, CreditCard, Coins } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  Placed: {
    label: "Order Placed",
    color: "text-cta-blue",
    bg: "bg-blue-50",
    dot: "bg-cta-blue",
  },
  Confirmed: {
    label: "Confirmed",
    color: "text-cta-blue",
    bg: "bg-blue-50",
    dot: "bg-cta-blue",
  },
  Packed: {
    label: "Packed",
    color: "text-cliq-gold",
    bg: "bg-yellow-50",
    dot: "bg-cliq-gold",
  },
  Shipped: {
    label: "Shipped",
    color: "text-cliq-gold",
    bg: "bg-yellow-50",
    dot: "bg-cliq-gold",
  },
  OutForDelivery: {
    label: "Out for Delivery",
    color: "text-cliq-gold",
    bg: "bg-orange-50",
    dot: "bg-orange-400",
  },
  Delivered: {
    label: "Delivered",
    color: "text-success",
    bg: "bg-green-50",
    dot: "bg-success",
  },
  Cancelled: {
    label: "Cancelled",
    color: "text-accent-red",
    bg: "bg-red-50",
    dot: "bg-accent-red",
  },
};

// ─── 7-state timeline ─────────────────────────────────────────────────────────

const TIMELINE_STEPS: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "OutForDelivery",
  "Delivered",
];

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 py-3">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-red flex-shrink-0" />
        <span className="text-sm text-accent-red font-medium">
          This order was cancelled
        </span>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-3 scrollbar-hide">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const cfg = STATUS_CONFIG[step];

        return (
          <div key={step} className="flex items-center flex-shrink-0">
            {/* Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-colors",
                  isDone
                    ? `${cfg.dot} border-transparent`
                    : "bg-white border-border-default"
                )}
                aria-label={step}
              />
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  isCurrent
                    ? cfg.color
                    : isDone
                    ? "text-muted"
                    : "text-border-default"
                )}
              >
                {cfg.label}
              </span>
            </div>
            {/* Connector */}
            {i < TIMELINE_STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-1 flex-shrink-0 transition-colors",
                  i < currentIndex ? "bg-success" : "bg-border-default"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: ReturnType<typeof useOrders>["orders"][0] }) {
  const cfg = STATUS_CONFIG[order.status];
  const firstItem = order.items[0];
  const mainImage =
    firstItem.product.images.find((img) => img.isMain) ??
    firstItem.product.images[0];

  return (
    <article className="bg-card border border-border-default rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-border-default bg-surface">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-xs text-muted">
            Order{" "}
            <span className="font-semibold text-primary-text">
              {order.orderNumber}
            </span>
          </span>
          <span className="hidden sm:block text-border-default">|</span>
          <span className="text-xs text-muted">
            Placed on{" "}
            <span className="font-medium text-primary-text">
              {formatDate(order.placedAt)}
            </span>
          </span>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium self-start sm:self-auto",
            cfg.bg,
            cfg.color
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="px-4 py-4">
        <div className="flex gap-3">
          {/* Product image */}
          <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden bg-surface">
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              sizes="64px"
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0Y1RjVGNSIvPjwvc3ZnPg=="
            />
          </div>

          {/* Item details */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-muted uppercase tracking-widest mb-0.5">
              {firstItem.product.brand}
            </p>
            <p className="text-sm font-medium text-primary-text line-clamp-2 mb-1">
              {firstItem.product.name}
            </p>
            {order.items.length > 1 && (
              <p className="text-xs text-muted">
                +{order.items.length - 1} more item
                {order.items.length - 1 > 1 ? "s" : ""}
              </p>
            )}
            <p className="text-sm font-semibold text-primary-text mt-1">
              {formatCurrency(order.netPayable)}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 border-t border-border-default pt-3">
          <OrderTimeline status={order.status} />
        </div>

        {/* Footer meta */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {order.deliveryAddress.city}, {order.deliveryAddress.state}
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            {order.paymentMethod}
          </span>
          {order.cliqCashEarned > 0 && (
            <span className="flex items-center gap-1 text-cliq-gold font-medium">
              <Coins className="w-3 h-3" />
              +{order.cliqCashEarned} NeuCoins earned
            </span>
          )}
          {order.trackingId && (
            <span className="text-cta-blue font-medium">
              Tracking: {order.trackingId}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center">
        <Package className="w-10 h-10 text-muted" />
      </div>
      <h2 className="font-display text-h2 text-primary-text">No orders yet</h2>
      <p className="text-muted text-sm max-w-xs">
        Looks like you haven&apos;t placed any orders. Start shopping to see your
        orders here.
      </p>
      <Link
        href="/search"
        className="mt-2 px-6 py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersClient() {
  const { orders } = useOrders();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Guest state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 bg-card border border-border-default rounded-full flex items-center justify-center">
          <Package className="w-10 h-10 text-muted" />
        </div>
        <h2 className="font-display text-h2 text-primary-text">
          Sign in to view orders
        </h2>
        <p className="text-muted text-sm max-w-xs">
          Please sign in to your CLiQ account to see your order history.
        </p>
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-site mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-muted mb-6"
        >
          <Link href="/" className="hover:text-accent-red transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-text font-medium">My Orders</span>
        </nav>

        {/* Page heading */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-h1 text-primary-text">My Orders</h1>
          {orders.length > 0 && (
            <span className="text-sm text-muted">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Order list */}
        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
