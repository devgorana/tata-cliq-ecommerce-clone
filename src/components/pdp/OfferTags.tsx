"use client";

import { Tag } from "lucide-react";

interface Offer {
  code: string;
  description: string;
  discount: string;
}

const MOCK_OFFERS: Offer[] = [
  {
    code: "CLIQ10",
    description: "Extra 10% off on first order",
    discount: "10% off",
  },
  {
    code: "HDFC200",
    description: "Flat ₹200 off on HDFC Bank cards",
    discount: "₹200 off",
  },
];

export default function OfferTags() {
  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
  };

  return (
    <div className="space-y-2">
      <p className="text-[12px] font-semibold font-body text-primary-text uppercase tracking-wider">
        Available Offers
      </p>
      {MOCK_OFFERS.map((offer) => (
        <div
          key={offer.code}
          className="flex items-start gap-2.5 border border-dashed border-border-default rounded-lg px-3 py-2.5 bg-surface"
        >
          <Tag size={14} className="text-accent-red flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-body text-primary-text">
              <span className="font-medium text-accent-red">{offer.discount}</span>
              {" — "}
              {offer.description}
            </p>
          </div>
          <button
            onClick={() => handleCopy(offer.code)}
            aria-label={`Copy code ${offer.code}`}
            className="flex-shrink-0 text-[11px] font-semibold font-body text-cta-blue uppercase tracking-wide hover:underline min-w-[44px] text-right"
          >
            {offer.code}
          </button>
        </div>
      ))}
    </div>
  );
}
