"use client";

import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import type { Address, PaymentMethod } from "@/types";

interface OrderSummaryProps {
  address?: Address;
  paymentMethod?: PaymentMethod;
  compact?: boolean;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  UPI: "UPI",
  Card: "Credit / Debit Card",
  NetBanking: "Net Banking",
  COD: "Cash on Delivery",
  EMI: "EMI",
  CLiQCash: "CLiQ Cash",
};

export default function OrderSummary({
  address,
  paymentMethod,
  compact = false,
}: OrderSummaryProps) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  const totalMRP = items.reduce((sum, i) => sum + i.product.mrp * i.quantity, 0);
  const totalDiscount = totalMRP - subtotal;
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const netPayable = subtotal + deliveryCharge;

  return (
    <div className="bg-card rounded-lg border border-border-default p-5">
      <h2 className="text-base font-semibold text-primary-text mb-4 pb-3 border-b border-border-default">
        Order Summary
      </h2>

      {/* Items */}
      {!compact && (
        <div className="space-y-3 mb-4 pb-4 border-b border-border-default">
          {items.map((item) => {
            const mainImg = item.product.images.find((img) => img.isMain) ?? item.product.images[0];
            const variant = item.product.variants.find((v) => v.id === item.variantId);
            const price = item.product.salePrice + (variant?.additionalPrice ?? 0);
            return (
              <div key={`${item.product.id}-${item.variantId}`} className="flex gap-3">
                <div className="relative w-14 h-16 flex-shrink-0 rounded overflow-hidden bg-surface">
                  <Image
                    src={mainImg?.url ?? "/placeholder.jpg"}
                    alt={mainImg?.alt ?? item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted uppercase tracking-widest">{item.product.brand}</p>
                  <p className="text-sm font-medium text-primary-text line-clamp-1">{item.product.name}</p>
                  {item.selectedSize && (
                    <p className="text-xs text-muted">Size: {item.selectedSize}</p>
                  )}
                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-primary-text flex-shrink-0">
                  {formatCurrency(price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-primary-text">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>{formatCurrency(totalMRP)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>− {formatCurrency(totalDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-primary-text">
          <span>Delivery</span>
          {deliveryCharge === 0 ? (
            <span className="text-success font-medium">FREE</span>
          ) : (
            <span>{formatCurrency(deliveryCharge)}</span>
          )}
        </div>
      </div>

      <div className="flex justify-between font-semibold text-base text-primary-text mt-3 pt-3 border-t border-border-default">
        <span>Total</span>
        <span>{formatCurrency(netPayable)}</span>
      </div>

      {totalDiscount > 0 && (
        <p className="text-xs text-success mt-1.5 font-medium">
          You save {formatCurrency(totalDiscount)}
        </p>
      )}

      {/* Delivery address */}
      {address && (
        <div className="mt-4 pt-4 border-t border-border-default">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1.5">
            Delivering to
          </p>
          <p className="text-sm font-medium text-primary-text">{address.fullName}</p>
          <p className="text-xs text-muted leading-relaxed">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
            {address.state} — {address.pincode}
          </p>
          <p className="text-xs text-muted">{address.phone}</p>
        </div>
      )}

      {/* Payment method */}
      {paymentMethod && (
        <div className="mt-3 pt-3 border-t border-border-default">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">
            Payment
          </p>
          <p className="text-sm text-primary-text">{PAYMENT_LABELS[paymentMethod]}</p>
        </div>
      )}
    </div>
  );
}
