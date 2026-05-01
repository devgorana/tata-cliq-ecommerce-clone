import { Shield, Truck, RotateCcw, Star } from "lucide-react";

const BADGES = [
  {
    icon: Shield,
    label: "100% Genuine",
    sub: "Authenticity guaranteed",
  },
  {
    icon: Truck,
    label: "Free Delivery",
    sub: "On orders above ₹499",
  },
  {
    icon: RotateCcw,
    label: "Easy Returns",
    sub: "30-day return policy",
  },
  {
    icon: Star,
    label: "Top Rated",
    sub: "Certified quality",
  },
] as const;

export default function CLiQPromise() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4 border-y border-border-default">
      {BADGES.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex items-center gap-2 bg-surface rounded-lg px-2.5 py-2.5"
        >
          <Icon size={18} className="text-cta-blue flex-shrink-0" />
          <div>
            <p className="text-[11px] font-semibold font-body text-primary-text leading-tight">
              {label}
            </p>
            <p className="text-[10px] text-muted font-body leading-tight">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
