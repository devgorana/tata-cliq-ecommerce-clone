"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types";

interface AddressStepProps {
  onNext: (address: Address) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

type FormData = Omit<Address, "line2"> & { line2: string };

const EMPTY: FormData = {
  fullName: "", line1: "", line2: "", city: "", state: "", pincode: "", phone: "",
};

export default function AddressStep({ onNext }: AddressStepProps) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): Partial<FormData> => {
    const errs: Partial<FormData> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.line1.trim()) errs.line1 = "Address line 1 is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state) errs.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Enter a valid 6-digit pincode";
    if (!/^\+?[\d\s\-]{10,}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const address: Address = {
      fullName: form.fullName,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      phone: form.phone,
    };
    onNext(address);
  };

  const inputClass = (field: keyof FormData) =>
    cn(
      "w-full h-11 px-4 text-sm text-primary-text bg-card border rounded-md",
      "placeholder:text-muted transition-colors duration-150",
      "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2",
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-border-default hover:border-muted focus:border-accent-red"
    );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-base font-semibold text-primary-text mb-5">Delivery Address</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full name */}
        <div className="sm:col-span-2">
          <label htmlFor="addr-name" className="block text-sm font-medium text-primary-text mb-1.5">
            Full name
          </label>
          <input
            id="addr-name"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="Priya Sharma"
            aria-invalid={!!errors.fullName}
            className={inputClass("fullName")}
          />
          {errors.fullName && <p role="alert" className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label htmlFor="addr-phone" className="block text-sm font-medium text-primary-text mb-1.5">
            Mobile number
          </label>
          <input
            id="addr-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 98765 43210"
            aria-invalid={!!errors.phone}
            className={inputClass("phone")}
          />
          {errors.phone && <p role="alert" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Address line 1 */}
        <div className="sm:col-span-2">
          <label htmlFor="addr-line1" className="block text-sm font-medium text-primary-text mb-1.5">
            Address line 1
          </label>
          <input
            id="addr-line1"
            type="text"
            autoComplete="address-line1"
            value={form.line1}
            onChange={set("line1")}
            placeholder="House / Flat no., Building name"
            aria-invalid={!!errors.line1}
            className={inputClass("line1")}
          />
          {errors.line1 && <p role="alert" className="mt-1 text-xs text-red-600">{errors.line1}</p>}
        </div>

        {/* Address line 2 */}
        <div className="sm:col-span-2">
          <label htmlFor="addr-line2" className="block text-sm font-medium text-primary-text mb-1.5">
            Address line 2 <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            id="addr-line2"
            type="text"
            autoComplete="address-line2"
            value={form.line2}
            onChange={set("line2")}
            placeholder="Street, Area, Landmark"
            className={inputClass("line2")}
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="addr-city" className="block text-sm font-medium text-primary-text mb-1.5">
            City
          </label>
          <input
            id="addr-city"
            type="text"
            autoComplete="address-level2"
            value={form.city}
            onChange={set("city")}
            placeholder="Mumbai"
            aria-invalid={!!errors.city}
            className={inputClass("city")}
          />
          {errors.city && <p role="alert" className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label htmlFor="addr-pincode" className="block text-sm font-medium text-primary-text mb-1.5">
            Pincode
          </label>
          <input
            id="addr-pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            value={form.pincode}
            onChange={set("pincode")}
            placeholder="400001"
            maxLength={6}
            aria-invalid={!!errors.pincode}
            className={inputClass("pincode")}
          />
          {errors.pincode && <p role="alert" className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
        </div>

        {/* State */}
        <div className="sm:col-span-2">
          <label htmlFor="addr-state" className="block text-sm font-medium text-primary-text mb-1.5">
            State
          </label>
          <select
            id="addr-state"
            value={form.state}
            onChange={set("state")}
            aria-invalid={!!errors.state}
            className={cn(
              inputClass("state"),
              "appearance-none cursor-pointer",
              !form.state && "text-muted"
            )}
          >
            <option value="" disabled>Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p role="alert" className="mt-1 text-xs text-red-600">{errors.state}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full h-12 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
      >
        Continue to Payment
      </button>
    </form>
  );
}
