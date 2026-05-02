"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/ui/Toast";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Address, PaymentMethod } from "@/types";

type Step = "address" | "payment" | "confirmation";

const STEPS: { id: Step; label: string }[] = [
  { id: "address", label: "Address" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

export default function CheckoutClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [orderNumber] = useState(
    () => "CLQ" + Date.now().toString().slice(-8)
  );

  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const netPayable = subtotal + deliveryCharge;

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  const handleAddressNext = (addr: Address) => {
    setAddress(addr);
    setStep("payment");
  };

  const handlePaymentNext = (method: PaymentMethod) => {
    setPaymentMethod(method);
    clearCart();
    setStep("confirmation");
    showToast("Order placed successfully!", "success");
  };

  // Redirect to cart if empty (and not on confirmation)
  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold text-primary-text">Your cart is empty</p>
        <Link
          href="/search"
          className="px-6 py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-site mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-accent-red transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-accent-red transition-colors">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary-text font-medium">Checkout</span>
        </nav>

        {/* Step indicator */}
        {step !== "confirmation" && (
          <div className="flex items-center gap-2 mb-8">
            {STEPS.filter((s) => s.id !== "confirmation").map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    currentStepIndex > i
                      ? "bg-success text-white"
                      : currentStepIndex === i
                      ? "bg-accent-red text-white"
                      : "bg-border-default text-muted"
                  )}
                  aria-current={currentStepIndex === i ? "step" : undefined}
                >
                  {currentStepIndex > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStepIndex === i ? "text-primary-text" : "text-muted"
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.filter((s) => s.id !== "confirmation").length - 1 && (
                  <div className="w-8 h-px bg-border-default mx-1" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Confirmation screen */}
        {step === "confirmation" ? (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-display text-h1 text-primary-text mb-2">Order Placed!</h1>
            <p className="text-muted mb-1">
              Thank you for shopping with CLiQ.
            </p>
            <p className="text-sm text-muted mb-6">
              Order number:{" "}
              <span className="font-semibold text-primary-text">{orderNumber}</span>
            </p>

            {address && (
              <div className="bg-card border border-border-default rounded-lg p-4 text-left mb-6">
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">
                  Delivering to
                </p>
                <p className="text-sm font-medium text-primary-text">{address.fullName}</p>
                <p className="text-xs text-muted leading-relaxed">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                  {address.state} — {address.pincode}
                </p>
                <p className="text-xs text-muted mt-1">
                  Payment: {paymentMethod}
                </p>
                <p className="text-xs font-semibold text-primary-text mt-2">
                  Total paid: {formatCurrency(netPayable)}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/orders"
                className="px-6 py-3 border border-accent-red text-accent-red text-sm font-semibold rounded-md hover:bg-accent-red hover:text-white transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Step content */}
            <div className="bg-card rounded-lg border border-border-default p-6">
              {step === "address" && (
                <AddressStep onNext={handleAddressNext} />
              )}
              {step === "payment" && (
                <PaymentStep
                  netPayable={netPayable}
                  onBack={() => setStep("address")}
                  onNext={handlePaymentNext}
                />
              )}
            </div>

            {/* Order summary — sticky */}
            <div className="lg:sticky lg:top-24">
              <OrderSummary address={address ?? undefined} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
