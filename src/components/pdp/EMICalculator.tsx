"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn, calculateEMI, formatCurrency } from "@/lib/utils";

interface Bank {
  name: string;
  rate: number;
}

const BANKS: Bank[] = [
  { name: "HDFC", rate: 0 },
  { name: "ICICI", rate: 13 },
  { name: "SBI", rate: 14 },
  { name: "Axis", rate: 13.5 },
  { name: "Kotak", rate: 14 },
];

const TENURES = [3, 6, 9, 12, 18, 24];

interface EMICalculatorProps {
  price: number;
}

export default function EMICalculator({ price }: EMICalculatorProps) {
  const [selectedBank, setSelectedBank] = useState<Bank>(BANKS[0]);
  const [tenure, setTenure] = useState(6);
  const [open, setOpen] = useState(false);

  const emi = calculateEMI(price, selectedBank.rate, tenure);
  const minEMI = calculateEMI(price, 0, 3);

  return (
    <div className="border border-border-default rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card text-left hover:bg-surface transition-colors"
        aria-expanded={open}
        aria-controls="emi-panel"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[20px]" role="img" aria-label="credit card">
            💳
          </span>
          <div>
            <p className="text-[13px] font-semibold font-body text-primary-text">
              EMI Available
            </p>
            <p className="text-[12px] text-muted font-body">
              From {formatCurrency(minEMI)}/month
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-cta-blue font-medium font-body">
          {open ? "Hide" : "View Plans"}
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open && (
        <div
          id="emi-panel"
          className="px-4 pb-4 bg-surface border-t border-border-default"
        >
          {/* Bank Tabs */}
          <div className="flex gap-1.5 pt-3 pb-3 overflow-x-auto">
            {BANKS.map((bank) => (
              <button
                key={bank.name}
                onClick={() => setSelectedBank(bank)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded text-[12px] font-medium font-body transition-all",
                  selectedBank.name === bank.name
                    ? "bg-accent-red text-white"
                    : "bg-card border border-border-default text-primary-text hover:border-accent-red"
                )}
              >
                {bank.name}
                {bank.rate === 0 && (
                  <span className="ml-1 text-[10px] font-bold text-success">
                    0%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tenure Selection */}
          <p className="text-[12px] text-muted font-body mb-2">Select Tenure</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TENURES.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={cn(
                  "min-w-[44px] h-9 px-3 rounded border text-[12px] font-medium font-body transition-all",
                  tenure === t
                    ? "border-accent-red bg-accent-red text-white"
                    : "border-border-default text-primary-text hover:border-accent-red"
                )}
              >
                {t} mo
              </button>
            ))}
          </div>

          {/* EMI Result */}
          <div className="bg-card rounded-lg p-3 border border-border-default">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold font-body text-primary-text">
                {formatCurrency(emi)}
              </span>
              <span className="text-[13px] text-muted font-body">/ month</span>
            </div>
            <p className="text-[12px] text-muted font-body mt-0.5">
              {tenure} months ×{" "}
              {selectedBank.rate === 0
                ? "0% interest"
                : `${selectedBank.rate}% p.a.`}{" "}
              via {selectedBank.name}
            </p>
            {selectedBank.rate > 0 && (
              <p className="text-[12px] text-muted font-body mt-0.5">
                Total payable: {formatCurrency(emi * tenure)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
