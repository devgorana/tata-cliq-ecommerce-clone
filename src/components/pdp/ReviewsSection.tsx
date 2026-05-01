"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface MockReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
}

const REVIEW_NAMES = [
  "Priya S.",
  "Rahul M.",
  "Anjali K.",
  "Amit G.",
  "Sneha P.",
  "Vikram R.",
];
const REVIEW_TITLES = [
  "Great product!",
  "Worth the price",
  "Excellent quality",
  "Highly recommended",
  "Good but expected more",
  "Perfect — very happy!",
];
const REVIEW_BODIES = [
  "Really impressed with the quality. The material feels premium and the fit is perfect. Would definitely buy again.",
  "Good product overall. Delivery was fast and packaging was excellent. Matches the description well.",
  "Absolutely love it! Top-notch quality and looks exactly like the pictures. Very happy with the purchase.",
  "Good value for money. Well-made and durable. Customer service was helpful too.",
  "Decent product but the colour is slightly different from what's shown. Otherwise satisfied.",
  "Exactly what I was looking for. Fits well and looks great. Very happy customer.",
];

function buildMockReviews(product: Product): MockReview[] {
  return REVIEW_NAMES.map((author, i) => ({
    id: `r${i}`,
    author,
    rating: Math.max(
      1,
      Math.min(5, Math.round(product.avgRating + (i % 2 === 0 ? 0.4 : -0.4)))
    ),
    date: `${15 - i * 2} Apr 2026`,
    title: REVIEW_TITLES[i],
    body: REVIEW_BODIES[i],
    helpful: (i + 1) * 7,
    verified: i < 4,
  }));
}

function StarRow({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-border-default text-border-default"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

interface ReviewsSectionProps {
  product: Product;
}

export default function ReviewsSection({ product }: ReviewsSectionProps) {
  const reviews = buildMockReviews(product);
  const [visibleCount, setVisibleCount] = useState(3);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      pct: Math.round((count / reviews.length) * 100),
    };
  });

  return (
    <section
      className="mt-8 pt-8 border-t border-border-default"
      aria-labelledby="reviews-heading"
    >
      <h2
        id="reviews-heading"
        className="text-h2 font-display text-primary-text mb-6"
      >
        Customer Reviews
      </h2>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center md:items-start gap-2 md:min-w-[160px]">
          <p className="text-[48px] font-bold font-body text-primary-text leading-none">
            {product.avgRating.toFixed(1)}
          </p>
          <StarRow rating={Math.round(product.avgRating)} size={20} />
          <p className="text-[13px] text-muted font-body">
            {product.ratingsCount.toLocaleString()} ratings
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          {ratingBreakdown.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-[12px] font-body text-muted w-4 text-right shrink-0">
                {star}
              </span>
              <Star
                size={12}
                className="fill-yellow-400 text-yellow-400 shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="text-[12px] font-body text-muted w-4 shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.slice(0, visibleCount).map((review) => (
          <div
            key={review.id}
            className="border-b border-border-default pb-6 last:border-0"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <StarRow rating={review.rating} size={14} />
                <h4 className="text-[14px] font-semibold font-body text-primary-text mt-1">
                  {review.title}
                </h4>
              </div>
              {review.verified && (
                <span className="flex-shrink-0 text-[11px] font-medium font-body text-success bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-[13px] text-primary-text font-body leading-relaxed mb-3">
              {review.body}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-body text-muted">
                  {review.author}
                </span>
                <span className="text-[12px] text-muted" aria-hidden="true">
                  ·
                </span>
                <span className="text-[12px] text-muted font-body">
                  {review.date}
                </span>
              </div>
              <button
                className="flex items-center gap-1 text-[12px] text-muted font-body hover:text-primary-text transition-colors"
                aria-label={`Mark review as helpful (${review.helpful} found helpful)`}
              >
                <ThumbsUp size={12} aria-hidden="true" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < reviews.length && (
        <button
          onClick={() => setVisibleCount((c) => c + 3)}
          className="mt-4 text-[13px] text-cta-blue font-medium font-body hover:underline"
        >
          Load more reviews
        </button>
      )}
    </section>
  );
}
