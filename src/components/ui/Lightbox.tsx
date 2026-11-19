"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useLockScroll } from "@/hooks/useLockScroll";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxMedia {
  src: string;
  title: string;
  issuer?: string;
  year?: string;
  alt: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: LightboxMedia | null;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export function Lightbox({
  isOpen,
  onClose,
  media,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useLockScroll(isOpen);

  // Return focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && onPrev) {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key === "ArrowRight" && onNext) {
        e.preventDefault();
        onNext();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !media) return null;

  const hasNavigation = Boolean(onPrev && onNext && totalCount && totalCount > 1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/90 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative max-w-4xl w-full border border-border bg-cream p-4 sm:p-6 rounded-2xl text-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border mb-4">
          <div className="pr-4 min-w-0">
            <h3 id="lightbox-title" className="font-serif text-lg sm:text-2xl text-charcoal font-normal truncate">
              {media.title}
            </h3>
            {totalCount !== undefined && currentIndex !== undefined ? (
              <span className="font-mono text-xs text-charcoal-muted block mt-0.5">
                {currentIndex + 1} / {totalCount}
              </span>
            ) : media.issuer ? (
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-charcoal-muted block mt-0.5">
                {media.issuer} {media.year && `• ${media.year}`}
              </span>
            ) : null}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-cream-200 hover:bg-cream-300 text-charcoal flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enlarged Image Display with Navigation Buttons */}
        <div className="relative h-[60vh] sm:h-[72vh] max-h-[750px] w-full border border-border bg-cream-100 p-2 rounded-xl overflow-hidden flex items-center justify-center">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain"
            priority
          />

          {hasNavigation && (
            <>
              {/* Previous Button (min 44x44px touch) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev?.();
                }}
                aria-label="Oldingi rasm"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 hover:bg-white text-charcoal border border-border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button (min 44x44px touch) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
                aria-label="Keyingi rasm"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 hover:bg-white text-charcoal border border-border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
