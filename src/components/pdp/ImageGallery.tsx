"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[activeIdx];

  const prev = () =>
    setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[560px] pb-1 md:pb-0 md:pr-1 flex-shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              className={cn(
                "flex-shrink-0 w-16 h-20 md:w-14 md:h-16 rounded overflow-hidden border-2 transition-all duration-200",
                i === activeIdx
                  ? "border-accent-red"
                  : "border-border-default hover:border-muted"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={72}
                height={96}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 relative">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-lg bg-surface",
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          aria-label={`${productName} — ${activeImage.alt}`}
        >
          <Image
            src={activeImage.url}
            alt={`${productName} — ${activeImage.alt}`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className={cn(
              "object-cover transition-transform duration-200",
              zoomed && "scale-150"
            )}
            style={
              zoomed
                ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                : undefined
            }
            priority
          />

          {!zoomed && (
            <div className="absolute bottom-3 right-3 bg-white/80 rounded-full p-2 pointer-events-none">
              <ZoomIn size={14} className="text-primary-text" />
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === activeIdx
                    ? "w-4 h-2 bg-accent-red"
                    : "w-2 h-2 bg-border-default hover:bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
