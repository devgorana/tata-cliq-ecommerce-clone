"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Categories", href: "/search", Icon: LayoutGrid },
  { label: "Search", href: "/search", Icon: Search },
  { label: "Wishlist", href: "/wishlist", Icon: Heart },
  { label: "Profile", href: "/auth/login", Icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-card border-t border-border-default"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-stretch">
        {TABS.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 min-h-[56px] py-1",
                "transition-colors duration-150",
                active
                  ? "text-accent-red"
                  : "text-muted hover:text-primary-text"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium tracking-wide">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
