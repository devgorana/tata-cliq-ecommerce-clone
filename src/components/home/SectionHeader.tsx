import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  viewAllHref,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between mb-5 md:mb-6", className)}>
      <div>
        {eyebrow && (
          <p className="text-[11px] font-medium text-accent-red uppercase tracking-widest mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display font-semibold text-h2 text-primary-text leading-tight">
          {title}
        </h2>
        <div className="mt-1.5 h-0.5 w-10 bg-accent-red rounded-full" />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-[13px] font-medium text-accent-red hover:underline flex-shrink-0 ml-4"
        >
          View All
        </Link>
      )}
    </div>
  );
}
