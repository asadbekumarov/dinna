"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLockScroll } from "@/hooks/useLockScroll";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: (options?: { service?: string }) => void;
}

export function MobileMenu({ isOpen, onClose, onOpenApply }: MobileMenuProps) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const ctaT = useTranslations("cta");
  const dialogRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLockScroll(isOpen);

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

  if (!isOpen) return null;

  const navLinks = [
    { href: "#xizmatlar", label: t("services") },
    { href: "#bosqichlar", label: t("methodology") },
    { href: "#ekspert", label: t("expert") },
    { href: "#natijalar", label: t("media") },
    { href: "#faq", label: t("faq") },
    { href: "#aloqa", label: t("contact") },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={common("openMenu")}
      className="fixed inset-0 z-50 flex flex-col bg-cream text-charcoal lg:hidden overscroll-contain pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 sm:px-6 h-20 border-b border-border shrink-0">
        <a
          href="#hero"
          onClick={handleLinkClick}
          className="font-serif text-lg tracking-wider font-semibold text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 min-h-[44px] flex items-center"
        >
          DINNA MIRZABAYEVA
        </a>
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={common("closeMenu")}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-charcoal-muted hover:text-charcoal hover:bg-cream-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      {/* Nav List */}
      <div
        ref={menuRef}
        className="flex-1 flex flex-col justify-between px-6 py-8 overflow-y-auto"
      >
        <nav className="flex flex-col space-y-2 sm:space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="group flex items-center justify-between min-h-[48px] text-lg sm:text-2xl font-serif text-charcoal hover:text-sage transition-colors py-3.5 border-b border-[#E5DFD6] touch-manipulation"
            >
              <span>{link.label}</span>
              <span className="text-xs font-mono text-[#5C6660] tracking-widest group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          ))}
        </nav>

        <div className="pt-8 border-t border-[#E5DFD6] flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-widest text-[#5C6660]">
              {common("changeLanguage")}
            </span>
            <LanguageSwitcher direction="up" />
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              className="w-full h-12 rounded-full bg-sage hover:bg-sage-hover text-cream font-medium text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(46,90,68,0.25)] flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                onOpenApply({ service: ctaT("mentorship") });
              }}
            >
              <span>{ctaT("mentorship")}</span>
              <span>→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
