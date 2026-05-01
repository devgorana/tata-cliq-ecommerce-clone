"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SubLink = { label: string; href: string };
type SubCategory = { heading: string; links: SubLink[] };

type MegaMenuEntry = {
  subcategories: SubCategory[];
  brands: string[];
  promo: { image: string; title: string; cta: string; href: string };
};

const MENU_DATA: Record<string, MegaMenuEntry> = {
  women: {
    subcategories: [
      {
        heading: "Clothing",
        links: [
          { label: "Dresses", href: "/search?category=fashion" },
          { label: "Tops & Tees", href: "/search?category=fashion" },
          { label: "Jeans & Trousers", href: "/search?category=fashion" },
          { label: "Kurtas & Sets", href: "/search?category=fashion" },
          { label: "Co-Ord Sets", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Footwear",
        links: [
          { label: "Heels", href: "/search?category=fashion" },
          { label: "Flats & Sandals", href: "/search?category=fashion" },
          { label: "Sports Shoes", href: "/search?category=fashion" },
          { label: "Boots", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "Handbags", href: "/search?category=luxury" },
          { label: "Sunglasses", href: "/search?category=luxury" },
          { label: "Watches", href: "/search?category=luxury" },
          { label: "Jewellery", href: "/search?category=fashion" },
        ],
      },
    ],
    brands: ["H&M", "Mango", "Vero Moda", "Global Desi", "Only", "Zara"],
    promo: {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
      title: "Summer Edit — Up to 40% Off",
      cta: "Shop Women",
      href: "/search?category=fashion",
    },
  },
  men: {
    subcategories: [
      {
        heading: "Clothing",
        links: [
          { label: "Shirts", href: "/search?category=fashion" },
          { label: "T-Shirts & Polos", href: "/search?category=fashion" },
          { label: "Jeans", href: "/search?category=fashion" },
          { label: "Jackets & Blazers", href: "/search?category=fashion" },
          { label: "Track Suits", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Footwear",
        links: [
          { label: "Sneakers", href: "/search?category=fashion" },
          { label: "Formal Shoes", href: "/search?category=fashion" },
          { label: "Sports Shoes", href: "/search?category=fashion" },
          { label: "Sandals", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "Watches", href: "/search?category=luxury" },
          { label: "Belts", href: "/search?category=luxury" },
          { label: "Wallets", href: "/search?category=luxury" },
          { label: "Sunglasses", href: "/search?category=luxury" },
        ],
      },
    ],
    brands: ["Levi's", "Tommy Hilfiger", "Zara", "Allen Solly", "Puma", "Adidas"],
    promo: {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      title: "Men's New Arrivals",
      cta: "Shop Men",
      href: "/search?category=fashion",
    },
  },
  kids: {
    subcategories: [
      {
        heading: "Boys",
        links: [
          { label: "T-Shirts", href: "/search?category=fashion" },
          { label: "Jeans", href: "/search?category=fashion" },
          { label: "Shorts", href: "/search?category=fashion" },
          { label: "Sports Wear", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Girls",
        links: [
          { label: "Dresses", href: "/search?category=fashion" },
          { label: "Tops", href: "/search?category=fashion" },
          { label: "Leggings", href: "/search?category=fashion" },
          { label: "Ethnic Wear", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Footwear",
        links: [
          { label: "Casual Shoes", href: "/search?category=fashion" },
          { label: "Sports Shoes", href: "/search?category=fashion" },
          { label: "Sandals", href: "/search?category=fashion" },
        ],
      },
    ],
    brands: ["H&M", "Puma", "Nike", "Adidas", "UCB"],
    promo: {
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80",
      title: "Kids' Favourites",
      cta: "Shop Kids",
      href: "/search?category=fashion",
    },
  },
  beauty: {
    subcategories: [
      {
        heading: "Skincare",
        links: [
          { label: "Moisturisers", href: "/search?category=fashion" },
          { label: "Serums", href: "/search?category=fashion" },
          { label: "Sunscreen", href: "/search?category=fashion" },
          { label: "Face Wash", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Makeup",
        links: [
          { label: "Foundation", href: "/search?category=fashion" },
          { label: "Lipstick", href: "/search?category=fashion" },
          { label: "Mascara", href: "/search?category=fashion" },
          { label: "Eyeshadow", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Haircare",
        links: [
          { label: "Shampoo", href: "/search?category=fashion" },
          { label: "Conditioner", href: "/search?category=fashion" },
          { label: "Hair Oils", href: "/search?category=fashion" },
        ],
      },
    ],
    brands: ["Maybelline", "L'Oréal", "Lakme", "MAC", "Clinique"],
    promo: {
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
      title: "Beauty Bestsellers",
      cta: "Shop Beauty",
      href: "/search?category=fashion",
    },
  },
  home: {
    subcategories: [
      {
        heading: "Furniture",
        links: [
          { label: "Sofas", href: "/search?category=home" },
          { label: "Beds & Mattresses", href: "/search?category=home" },
          { label: "Tables & Chairs", href: "/search?category=home" },
          { label: "Storage", href: "/search?category=home" },
        ],
      },
      {
        heading: "Kitchen",
        links: [
          { label: "Cookware", href: "/search?category=home" },
          { label: "Air Fryers", href: "/search?category=home" },
          { label: "Pressure Cookers", href: "/search?category=home" },
          { label: "Small Appliances", href: "/search?category=home" },
        ],
      },
      {
        heading: "Décor & Lighting",
        links: [
          { label: "Smart Bulbs", href: "/search?category=home" },
          { label: "Vacuum Cleaners", href: "/search?category=home" },
          { label: "Bathroom", href: "/search?category=home" },
        ],
      },
    ],
    brands: ["Dyson", "Philips", "IKEA", "Urban Ladder", "Prestige"],
    promo: {
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
      title: "Upgrade Your Home",
      cta: "Shop Home",
      href: "/search?category=home",
    },
  },
  brands: {
    subcategories: [
      {
        heading: "Fashion Brands",
        links: [
          { label: "Zara", href: "/search?category=fashion" },
          { label: "H&M", href: "/search?category=fashion" },
          { label: "Levi's", href: "/search?category=fashion" },
          { label: "Tommy Hilfiger", href: "/search?category=fashion" },
          { label: "Mango", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Luxury Brands",
        links: [
          { label: "Coach", href: "/search?category=luxury" },
          { label: "Michael Kors", href: "/search?category=luxury" },
          { label: "Ray-Ban", href: "/search?category=luxury" },
          { label: "Longines", href: "/search?category=luxury" },
          { label: "Prada", href: "/search?category=luxury" },
        ],
      },
      {
        heading: "Tech Brands",
        links: [
          { label: "Apple", href: "/search?category=electronics" },
          { label: "Samsung", href: "/search?category=electronics" },
          { label: "Sony", href: "/search?category=electronics" },
          { label: "Bose", href: "/search?category=electronics" },
        ],
      },
    ],
    brands: ["Apple", "Samsung", "Sony", "Zara", "Coach", "Ray-Ban"],
    promo: {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
      title: "Top Brands, All Authentic",
      cta: "Explore Brands",
      href: "/search",
    },
  },
  sale: {
    subcategories: [
      {
        heading: "Fashion Sale",
        links: [
          { label: "Women's Fashion", href: "/search?category=fashion" },
          { label: "Men's Fashion", href: "/search?category=fashion" },
          { label: "Footwear", href: "/search?category=fashion" },
          { label: "Accessories", href: "/search?category=fashion" },
        ],
      },
      {
        heading: "Electronics Sale",
        links: [
          { label: "Smartphones", href: "/search?category=electronics" },
          { label: "Laptops", href: "/search?category=electronics" },
          { label: "Audio", href: "/search?category=electronics" },
          { label: "Wearables", href: "/search?category=electronics" },
        ],
      },
      {
        heading: "Home Sale",
        links: [
          { label: "Kitchen Appliances", href: "/search?category=home" },
          { label: "Furniture", href: "/search?category=home" },
          { label: "Lighting", href: "/search?category=home" },
        ],
      },
    ],
    brands: ["Nike", "Adidas", "Apple", "Samsung", "Dyson", "Philips"],
    promo: {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
      title: "Mega Sale — Up to 60% Off",
      cta: "Shop Sale",
      href: "/search",
    },
  },
};

interface MegaMenuProps {
  category: string;
  onClose: () => void;
}

export default function MegaMenu({ category, onClose }: MegaMenuProps) {
  const data = MENU_DATA[category];
  if (!data) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 bg-card shadow-lg border-t border-border-default"
      onMouseLeave={onClose}
      role="navigation"
      aria-label={`${category} submenu`}
    >
      <div className="max-w-site mx-auto px-6 py-8 grid grid-cols-[1fr_auto_280px] gap-8">
        {/* Left — subcategories */}
        <div className="grid grid-cols-3 gap-6">
          {data.subcategories.map((sub) => (
            <div key={sub.heading}>
              <p className="text-[11px] font-semibold text-primary-text uppercase tracking-widest mb-3">
                {sub.heading}
              </p>
              <ul className="space-y-2">
                {sub.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-sm text-muted hover:text-accent-red transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Centre — top brands */}
        <div className="w-48">
          <p className="text-[11px] font-semibold text-primary-text uppercase tracking-widest mb-3">
            Top Brands
          </p>
          <div className="grid grid-cols-2 gap-2">
            {data.brands.map((brand) => (
              <Link
                key={brand}
                href={`/search?brand=${encodeURIComponent(brand)}`}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-center h-10 px-2 text-xs font-medium text-primary-text",
                  "border border-border-default rounded-md hover:border-accent-red hover:text-accent-red",
                  "transition-colors duration-150 text-center leading-tight"
                )}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — promo image */}
        <div className="relative overflow-hidden rounded-lg group">
          <div className="relative h-full min-h-[200px]">
            <Image
              src={data.promo.image}
              alt={data.promo.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-display font-semibold text-sm mb-2 leading-tight">
                {data.promo.title}
              </p>
              <Link
                href={data.promo.href}
                onClick={onClose}
                className="inline-block bg-accent-red text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-opacity-90 transition-all duration-200"
              >
                {data.promo.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
