import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function FAQSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="w-3/4 h-10 sm:h-12" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-12 rounded-full" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="w-24 h-9 rounded-full" />
              ))}
            </div>
            <Skeleton className="w-full h-44 rounded-2xl hidden lg:block" />
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="py-5 border-b border-border flex items-center justify-between gap-4"
              >
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
