"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BackToTop — appears after 400px scroll, smooth-scrolls to top on click.
 * Per @docs/DESIGN.md §6: "Back to top button appears after 400px scroll".
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        // Position: bottom-right, above bottom nav on mobile
        "fixed bottom-20 right-4 md:bottom-8 md:right-6 z-[1500]",
        // Size & shape
        "w-11 h-11 rounded-full bg-primary-navy text-white shadow-lg",
        // Flex centering
        "flex items-center justify-center",
        // Hover
        "hover:bg-cta-blue transition-all duration-200",
        // Visibility animation — per @docs/DESIGN.md §6
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ChevronUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
