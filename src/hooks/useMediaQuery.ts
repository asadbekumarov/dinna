"use client";

import { useSyncExternalStore } from "react";

/**
 * Custom hook for responsive CSS media queries using useSyncExternalStore.
 * Eliminates SSR flash/hydration mismatch by providing a stable mobile-first initial snapshot (false).
 *
 * Example: const isDesktop = useMediaQuery("(min-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener("change", callback);
    return () => mediaQueryList.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false; // Mobile-first default snapshot
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
