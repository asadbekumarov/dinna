"use client";

import React, { useEffect, useRef } from "react";

import { useLockScroll } from "@/hooks/useLockScroll";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
  title?: string;
}

export function YouTubeModal({
  isOpen,
  onClose,
  videoId,
  title,
}: YouTubeModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useLockScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPlaceholder = !videoId || videoId === "REPLACE_ME";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Video"}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full border border-border bg-cream p-3.5 sm:p-6 rounded-2xl shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border mb-3 sm:mb-4">
          <h3 className="font-serif text-sm sm:text-lg text-charcoal font-medium line-clamp-1 pr-3 sm:pr-4">
            {title || "Video"}
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Videoni yopish"
            className="w-11 h-11 flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-full shrink-0"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player or Neutral Placeholder */}
        <div className="relative aspect-video w-full bg-cream-50 border border-border-subtle rounded-xl overflow-hidden flex items-center justify-center">
          {isPlaceholder ? (
            <div className="p-8 text-center max-w-md space-y-4">
              <div className="w-12 h-12 border border-charcoal/20 mx-auto flex items-center justify-center text-charcoal rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                  />
                </svg>
              </div>
              <h4 className="font-serif text-lg text-white font-normal">
                Ushbu video tez orada yuklanadi
              </h4>
              <p className="text-xs text-muted font-light leading-relaxed">
                Yangi keys va amaliy mashg&apos;ulot montaj jarayonida. Rasmiy YouTube kanalimizda kuzatib boring.
              </p>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
