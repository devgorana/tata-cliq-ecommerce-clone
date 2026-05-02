"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Banknote, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

interface PaymentStepProps {
  netPayable: number;
  onBack: () => void;
  onNext: (method: PaymentMethod) => void;
}

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "UPI",
    label: "UPI",
    description: "Pay via Google Pay, PhonePe, Paytm or any UPI app",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    id: "Card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay and more",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "NetBanking",
    label: "Net Banking",
    description: "All major Indian banks supported",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: <Banknote className="w-5 h-5" />,
  },
];

export default function PaymentStep({ netPayable, onBack, onNext }: PaymentStepProps) {
  const [selected, setSelected] = useState<PaymentMethod>("UPI");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  const handlePay = () => {
    if (selected === "UPI" && !upiId.trim()) {
      setUpiError("Enter your UPI ID");
      return;
    }
    setUpiError("");
    onNext(selected);
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-primary-text mb-5">Payment Method</h2>

      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              "flex items-start gap-3 p-4 border rounded-md cursor-pointer transition-colors",
              selected === opt.id
                ? "border-accent-red bg-red-50"
                : "border-border-default hover:border-muted bg-card"
            )}
          >
            <input
              type="radio"
              name="payment"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              className="mt-0.5 accent-accent-red w-4 h-4 flex-shrink-0"
            />
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span
                className={cn(
                  "mt-0.5 flex-shrink-0",
                  selected === opt.id ? "text-accent-red" : "text-muted"
                )}
              >
                {opt.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-primary-text">{opt.label}</p>
                <p className="text-xs text-muted mt-0.5">{opt.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* UPI ID input */}
      {selected === "UPI" && (
        <div className="mt-4">
          <label htmlFor="upi-id" className="block text-sm font-medium text-primary-text mb-1.5">
            UPI ID
          </label>
          <input
            id="upi-id"
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            aria-invalid={!!upiError}
            className={cn(
              "w-full h-11 px-4 text-sm text-primary-text bg-card border rounded-md",
              "placeholder:text-muted transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2",
              upiError
                ? "border-red-500"
                : "border-border-default hover:border-muted focus:border-accent-red"
            )}
          />
          {upiError && <p role="alert" className="mt-1 text-xs text-red-600">{upiError}</p>}
        </div>
      )}

      {/* Card mock */}
      {selected === "Card" && (
        <div className="mt-4 p-4 bg-surface rounded-md border border-border-default">
          <p className="text-sm text-muted text-center">
            Card payment is simulated — no real card details needed.
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 h-12 border border-border-default text-primary-text text-sm font-medium rounded-md hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          className="flex-1 h-12 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
        >
          Pay {formatCurrency(netPayable)}
        </button>
      </div>
    </div>
  );
}
