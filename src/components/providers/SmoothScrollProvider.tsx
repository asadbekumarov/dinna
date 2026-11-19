"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

function AnchorHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const headerEl = document.querySelector("header");
        const headerH = headerEl ? headerEl.offsetHeight : 80;
        lenis.scrollTo(targetEl as HTMLElement, {
          offset: -headerH, // Offset for dynamic fixed header
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // Update URL hash without jumping
        if (window.history.pushState) {
          window.history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      <AnchorHandler />
      {children}
    </ReactLenis>
  );
}
