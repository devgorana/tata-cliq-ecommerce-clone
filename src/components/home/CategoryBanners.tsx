import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Women", short: "W", href: "/search?category=fashion", bg: "bg-pink-100", text: "text-pink-700" },
  { label: "Men", short: "M", href: "/search?category=fashion", bg: "bg-blue-100", text: "text-blue-700" },
  { label: "Kids", short: "K", href: "/search?category=fashion", bg: "bg-yellow-100", text: "text-yellow-700" },
  { label: "Beauty", short: "B", href: "/search?category=fashion", bg: "bg-rose-100", text: "text-rose-700" },
  { label: "Electronics", short: "E", href: "/search?category=electronics", bg: "bg-indigo-100", text: "text-indigo-700" },
  { label: "Luxury", short: "L", href: "/search?category=luxury", bg: "bg-amber-100", text: "text-amber-700" },
  { label: "Home", short: "H", href: "/search?category=home", bg: "bg-green-100", text: "text-green-700" },
  { label: "Sports", short: "S", href: "/search?category=fashion", bg: "bg-cyan-100", text: "text-cyan-700" },
  { label: "Brands", short: "Br", href: "/search", bg: "bg-purple-100", text: "text-purple-700" },
  { label: "Sale", short: "Sale", href: "/search", bg: "bg-red-100", text: "text-accent-red" },
] as const;

export default function CategoryBanners() {
  return (
    <section
      className="bg-card py-5 md:py-6 border-b border-border-default"
      aria-label="Shop by category"
    >
      <div className="max-w-site mx-auto px-4 md:px-6">
        {/* Horizontal scroll — no visible scrollbar */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(({ label, short, href, bg, text }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
              aria-label={`Shop ${label}`}
            >
              {/* 72px circle per DESIGN.md §4.5 */}
              <div
                className={cn(
                  "w-[72px] h-[72px] rounded-full flex items-center justify-center",
                  "transition-all duration-200",
                  "group-hover:scale-105 group-hover:shadow-sm",
                  bg
                )}
              >
                <span className={cn("text-base font-bold", text)}>{short}</span>
              </div>
              <span className="text-[12px] font-medium text-primary-text text-center whitespace-nowrap">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
