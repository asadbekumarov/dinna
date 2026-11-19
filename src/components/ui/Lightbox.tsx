"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useLockScroll } from "@/hooks/useLockScroll";

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
}

export function Lightbox({ isOpen, onClose, media }: LightboxProps) {
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
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/80 md:backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative max-w-3xl w-full border border-border bg-cream p-5 sm:p-7 rounded-2xl shadow-modal text-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <div className="pr-4">
            <h3 id="lightbox-title" className="font-serif text-lg sm:text-2xl text-charcoal font-normal">
              {media.title}
            </h3>
            {media.issuer && (
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-charcoal-muted block mt-1">
                {media.issuer} {media.year && `• ${media.year}`}
              </span>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-cream-200 hover:bg-cream-300 text-charcoal flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            ✕
          </button>
        </div>

        {/* Enlarged Image Display */}
        <div className="relative h-[55vh] sm:h-[70vh] max-h-[750px] w-full border border-border bg-cream-50 p-2 rounded-xl overflow-hidden flex items-center justify-center">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
