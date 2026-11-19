import React from "react";
import { NavbarSkeleton } from "./NavbarSkeleton";
import { HeroSkeleton } from "./HeroSkeleton";
import { ServicesSkeleton } from "./ServicesSkeleton";
import { StagesSkeleton } from "./StagesSkeleton";
import { FooterSkeleton } from "./FooterSkeleton";

export function PageSkeleton() {
  return (
    <div
      aria-hidden="true"
      aria-label="Yuklanmoqda..."
      className="min-h-screen flex flex-col bg-cream text-white overflow-hidden pointer-events-none select-none"
    >
      {/* Top Luxury Champagne Progress Bar Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-gradient-to-r from-transparent via-sage to-transparent animate-shimmer" />

      {/* Navbar Skeleton */}
      <NavbarSkeleton />

      {/* Main Content Sections Skeleton */}
      <main className="flex-1 pt-20">
        <HeroSkeleton />
        <ServicesSkeleton />
        <StagesSkeleton />
      </main>

      {/* Footer Skeleton */}
      <FooterSkeleton />
    </div>
  );
}
