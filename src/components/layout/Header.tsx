"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import MegaMenu from "@/components/layout/MegaMenu";

type NavCategory = { label: string; key: string; highlight?: boolean };

const NAV_CATEGORIES: NavCategory[] = [
  { label: "Women", key: "women" },
  { label: "Men", key: "men" },
  { label: "Kids", key: "kids" },
  { label: "Beauty", key: "beauty" },
  { label: "Home", key: "home" },
  { label: "Brands", key: "brands" },
  { label: "Sale", key: "sale", highlight: true },
];

const ANNOUNCEMENTS = [
  "Free Shipping on orders above ₹499 · Use code CLIQ10 for extra 10% off",
  "Authenticity Guaranteed on every product — 100% genuine brands",
  "Easy 30-day returns on all orders · Shop with confidence",
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = useCartStore(
    (s) => s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(
      () => setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length),
      4000
    );
    return () => clearInterval(t);
  }, [dismissed]);

  const handleCategoryEnter = useCallback((key: string) => {
    setActiveCategory(key);
  }, []);

  const closeMenu = useCallback(() => setActiveCategory(null), []);

  return (
    <header className="sticky top-0 z-[1000]">
      {/* Announcement bar */}
      {!dismissed && (
        <div className="bg-accent-red h-9 flex items-center justify-center relative px-4">
          <p className="text-[13px] font-medium text-white text-center truncate max-w-[90%]">
            {ANNOUNCEMENTS[announcementIdx]}
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 p-1 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary nav */}
      <nav
        className={cn(
          "bg-card border-b border-border-default transition-shadow duration-200",
          scrolled && "shadow-sm"
        )}
        onMouseLeave={closeMenu}
      >
        <div className="max-w-site mx-auto px-4 md:px-6">
          <div className="flex items-center h-14 md:h-16 gap-4 md:gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1"
              aria-label="Tata CLiQ home"
            >
              <span className="font-display font-bold text-xl md:text-2xl leading-none">
                <span className="text-accent-red">CLiQ</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-muted tracking-wide mt-0.5">
                by TATA
              </span>
            </Link>

            {/* Category nav — desktop */}
            <div className="hidden lg:flex items-stretch flex-1">
              {NAV_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onMouseEnter={() => handleCategoryEnter(cat.key)}
                  onFocus={() => handleCategoryEnter(cat.key)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium flex items-center gap-0.5",
                    "border-b-2 border-transparent transition-colors duration-150",
                    "hover:text-accent-red hover:border-accent-red",
                    activeCategory === cat.key &&
                      "text-accent-red border-accent-red",
                    cat.highlight ? "text-accent-red" : "text-primary-text"
                  )}
                  aria-expanded={activeCategory === cat.key}
                  aria-haspopup="true"
                >
                  {cat.label}
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      activeCategory === cat.key && "rotate-180"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Search bar — tablet + desktop */}
            <div className="hidden md:flex flex-1 lg:max-w-[480px]">
              <label className="flex items-center bg-surface rounded-full w-full px-4 py-2 gap-2 border border-border-default focus-within:border-accent-red transition-colors">
                <Search className="w-4 h-4 text-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-primary-text placeholder:text-muted outline-none flex-1 min-w-0"
                  aria-label="Search"
                />
              </label>
            </div>

            {/* Right icon cluster */}
            <div className="flex items-center gap-0.5 ml-auto lg:ml-0">
              {/* Mobile: hamburger */}
              <button
                className="lg:hidden p-2 text-primary-text hover:text-accent-red transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Mobile: search icon */}
              <Link
                href="/search"
                className="md:hidden p-2 text-primary-text hover:text-accent-red transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={cn(
                  "hidden md:flex flex-col items-center p-2 min-w-[52px] min-h-[44px] justify-center",
                  "text-primary-text hover:text-accent-red transition-colors"
                )}
                aria-label="Wishlist"
              >
                <Heart className="w-6 h-6" />
                <span className="text-[10px] tracking-widest mt-0.5 font-medium">
                  WISHLIST
                </span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  "flex flex-col items-center p-2 min-w-[52px] min-h-[44px] justify-center",
                  "text-primary-text hover:text-accent-red transition-colors relative"
                )}
                aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-red text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-[10px] tracking-widest mt-0.5 font-medium">
                  CART
                </span>
              </Link>

              {/* Account */}
              <Link
                href={isAuthenticated ? "/account" : "/auth/login"}
                className={cn(
                  "hidden md:flex flex-col items-center p-2 min-w-[52px] min-h-[44px] justify-center",
                  "text-primary-text hover:text-accent-red transition-colors"
                )}
                aria-label={isAuthenticated ? "My account" : "Login"}
              >
                <User className="w-6 h-6" />
                <span className="text-[10px] tracking-widest mt-0.5 font-medium">
                  {isAuthenticated ? "ACCOUNT" : "LOGIN"}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mega menu */}
        {activeCategory && (
          <MegaMenu category={activeCategory} onClose={closeMenu} />
        )}

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border-default bg-card">
            <div className="max-w-site mx-auto px-4 py-3">
              {/* Mobile search */}
              <label className="flex items-center bg-surface rounded-full px-4 py-2 gap-2 border border-border-default mb-4">
                <Search className="w-4 h-4 text-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="bg-transparent text-sm text-primary-text placeholder:text-muted outline-none flex-1"
                  aria-label="Mobile search"
                />
              </label>

              {/* Mobile category links */}
              <nav aria-label="Mobile navigation">
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.key}
                    href={`/search?category=${cat.key}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between py-3 border-b border-border-default text-sm font-medium",
                      cat.highlight ? "text-accent-red" : "text-primary-text"
                    )}
                  >
                    {cat.label}
                    <ChevronDown className="-rotate-90 w-4 h-4 text-muted" />
                  </Link>
                ))}
              </nav>

              {/* Mobile auth links */}
              <div className="mt-4 flex gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 border border-accent-red text-accent-red text-sm font-semibold rounded-md hover:bg-accent-red hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border-default text-primary-text text-sm font-medium rounded-md"
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
