"use client";

import React, { useEffect, useRef } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelUrl: string | null;
  title?: string;
}

export function ReelModal({
  isOpen,
  onClose,
  reelUrl,
  title,
}: ReelModalProps) {
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

  if (!isOpen || !reelUrl) return null;

  // Extract clean reel shortcode: /reel/SHORTCODE/
  const match = reelUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
  const shortcode = match ? match[1] : null;
  const embedUrl = shortcode ? `https://www.instagram.com/reel/${shortcode}/embed/` : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Instagram Reel"}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[380px] border border-white/10 bg-charcoal text-cream rounded-2xl shadow-modal overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-charcoal/95">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sage shrink-0" />
            <h3 className="font-serif text-sm text-cream font-medium truncate">
              {title || "Instagram Reel"}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-terracotta hover:underline inline-flex items-center gap-0.5"
            >
              Instagram ↗
            </a>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Yopish"
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 9:16 Video Player Container */}
        <div className="relative w-full aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              title={title || "Instagram Reel"}
            />
          ) : (
            <div className="p-6 text-center text-white/70">
              <p className="text-sm">Videoni Instagram orqali tomosha qiling</p>
              <a
                href={reelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-4 py-2 rounded-full bg-sage text-white font-medium text-xs"
              >
                Instagramda ochish ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
