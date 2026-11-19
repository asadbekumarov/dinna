"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "uz", label: "UZ", nativeName: "O'zbek" },
  { code: "ru", label: "RU", nativeName: "Русский" },
  { code: "en", label: "EN", nativeName: "English" },
];

interface LanguageSwitcherProps {
  className?: string;
  direction?: "down" | "up";
}

export function LanguageSwitcher({
  className = "",
  direction = "down",
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang =
    LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (nextLocale: string) => {
    if (nextLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setIsOpen(false);
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block font-mono text-xs ${className}`}
    >
      {/* Trigger Button: min 44x44px touch target */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="h-11 min-h-[44px] min-w-[44px] px-3.5 flex items-center justify-center gap-2 bg-cream-200 hover:bg-cream-300 border border-border hover:border-sage/40 transition-all rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      >
        <span className="font-mono text-xs font-semibold text-charcoal tracking-[0.12em] uppercase">
          {activeLang.code.toUpperCase()}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-sage transition-transform duration-300 ${
            isOpen
              ? direction === "up"
                ? "rotate-0"
                : "rotate-180"
              : direction === "up"
              ? "rotate-180"
              : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className={`absolute right-0 z-50 min-w-[160px] py-1.5 bg-white border border-border shadow-modal rounded-2xl overflow-hidden ${
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                disabled={isPending}
                onClick={() => handleSelect(lang.code)}
                className={`w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 text-left text-xs transition-colors cursor-pointer group ${
                  isSelected
                    ? "bg-sage/10 text-sage font-medium"
                    : "text-charcoal-muted hover:text-charcoal hover:bg-cream-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs uppercase font-mono tracking-wider ${
                      isSelected
                        ? "text-sage font-bold"
                        : "text-charcoal-muted group-hover:text-charcoal"
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </span>
                  <span className="font-sans text-xs">{lang.nativeName}</span>
                </div>
                {isSelected && (
                  <span className="text-sage font-mono text-xs font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
