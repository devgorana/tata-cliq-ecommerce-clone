"use client";

import { useState } from "react";
import { MapPin, Truck, Check } from "lucide-react";
import { getDeliveryDate } from "@/lib/utils";

interface DeliveryEstimateProps {
  baseDeliveryDays?: number;
}

export default function DeliveryEstimate({
  baseDeliveryDays = 5,
}: DeliveryEstimateProps) {
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      setChecked(false);
      return;
    }
    setError("");
    setChecked(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  const isFreeDelivery = checked && parseInt(pincode) % 2 === 0;

  return (
    <div className="border border-border-default rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-muted" />
        <span className="text-[13px] font-semibold font-body text-primary-text">
          Delivery Options
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setChecked(false);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter pincode"
          maxLength={6}
          className="flex-1 h-11 px-3 border border-border-default rounded text-[13px] font-body text-primary-text placeholder:text-muted focus:outline-none focus:border-accent-red"
          aria-label="Enter delivery pincode"
        />
        <button
          onClick={handleCheck}
          className="h-11 px-4 bg-accent-red text-white text-[13px] font-semibold font-body rounded hover:bg-red-700 transition-colors min-w-[64px]"
        >
          Check
        </button>
      </div>

      {error && (
        <p className="text-[12px] text-accent-red font-body mt-1.5" role="alert">
          {error}
        </p>
      )}

      {checked && !error && (
        <div className="mt-3 space-y-2.5" aria-live="polite">
          <div className="flex items-start gap-2">
            <Check
              size={14}
              className="text-success mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[13px] font-medium font-body text-primary-text">
                Standard Delivery by{" "}
                <span className="text-success">
                  {getDeliveryDate(baseDeliveryDays)}
                </span>
              </p>
              <p className="text-[12px] text-muted font-body">
                {isFreeDelivery ? "Free delivery" : "₹49 delivery charge"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Truck
              size={14}
              className="text-cta-blue mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-[13px] font-medium font-body text-primary-text">
                Express Delivery by{" "}
                <span className="text-cta-blue">{getDeliveryDate(2)}</span>
              </p>
              <p className="text-[12px] text-muted font-body">
                ₹99 express charge
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
