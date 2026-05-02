"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

interface PriceSummaryProps {
  /** When true, shows the "Proceed to Checkout" button */
  showCheckoutButton?: boolean;
  /** When true, shows the "Place Order" button (checkout page) */
  showPlaceOrderButton?: boolean;
  onPlaceOrder?: () => void;
}

export default function PriceSummary({
  showCheckoutButton = false,
  showPlaceOrderButton = false,
  onPlaceOrder,
}: PriceSummaryProps) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  const totalMRP = items.reduce(
    (sum, i) => sum + i.product.mrp * i.quantity,
    0
  );
  const totalDiscount = totalMRP - subtotal;
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const netPayable = subtotal + deliveryCharge;

  return (
    <div className="bg-card rounded-lg border border-border-default p-5">
      <h2 className="text-base font-semibold text-primary-text mb-4 pb-3 border-b border-border-default">
        Price Details
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-primary-text">
          <span>
            Price ({items.reduce((s, i) => s + i.quantity, 0)} item
            {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
          </span>
          <span>{formatCurrency(totalMRP)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>− {formatCurrency(totalDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-primary-text">
          <span>Delivery Charges</span>
          {deliveryCharge === 0 ? (
            <span className="text-success font-medium">FREE</span>
          ) : (
            <span>{formatCurrency(deliveryCharge)}</span>
          )}
        </div>

        {deliveryCharge > 0 && (
          <p className="text-xs text-muted">
            Add {formatCurrency(499 - subtotal)} more for free delivery
          </p>
        )}
      </div>

      <div className="flex justify-between font-semibold text-base text-primary-text mt-4 pt-4 border-t border-border-default">
        <span>Total Amount</span>
        <span>{formatCurrency(netPayable)}</span>
      </div>

      {totalDiscount > 0 && (
        <p className="text-xs text-success mt-2 font-medium">
          You will save {formatCurrency(totalDiscount)} on this order
        </p>
      )}

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-5 block w-full text-center py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97]"
        >
          Proceed to Checkout
        </Link>
      )}

      {showPlaceOrderButton && (
        <button
          onClick={onPlaceOrder}
          className="mt-5 w-full py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97]"
        >
          Place Order
        </button>
      )}

      {/* Trust badge */}
      <div className="flex items-center gap-2 mt-4 text-xs text-muted">
        <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
        <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
      </div>
    </div>
  );
}
