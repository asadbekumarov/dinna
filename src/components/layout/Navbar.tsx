"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { Button } from "@/components/ui/button";

export interface NavbarProps {
  onOpenApply?: () => void;
}

export function Navbar({ onOpenApply }: NavbarProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const ctaT = useTranslations("cta");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { href: "#xizmatlar", label: t("services") },
    { href: "#bosqichlar", label: t("methodology") },
    { href: "#ekspert", label: t("expert") },
    { href: "#natijalar", label: t("media") },
    { href: "#faq", label: t("faq") },
    { href: "#aloqa", label: t("contact") },
  ];

  const locale = useLocale();

  // Smooth scroll handler with dynamic header height offset from CSS --header-h
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);

      if (element) {
        const headerEl = document.querySelector("header");
        const headerOffset = headerEl
          ? headerEl.offsetHeight
          : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80);
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Set active section immediately for instantaneous UI feedback
        setActiveSection(targetId);

        // Update URL hash without forcing jump
        if (window.history.pushState) {
          window.history.pushState(null, "", href);
        }
      } else {
        const homePrefix = locale === "uz" ? "" : `/${locale}`;
        window.location.href = `${homePrefix}/${targetId === "hero" ? "" : href}`;
      }
    },
    [locale]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const sectionIds = ["xizmatlar", "bosqichlar", "ekspert", "natijalar", "faq", "aloqa"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!("IntersectionObserver" in window) || elements.length === 0) {
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Aktiv bo'lim hozirgi scroll bo'yicha IntersectionObserver orqali ajratiladi
    const observer = new IntersectionObserver(
      (entries) => {
        // Sahifa eng pastiga yetganda aloqa bo'limini faollashtirish
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 80
        ) {
          setActiveSection("aloqa");
          return;
        }

        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(intersecting[0].target.id);
        } else if (window.scrollY < 150) {
          setActiveSection("");
        }
      },
      {
        root: null,
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <header
        style={{ "--header-h": isScrolled ? "4.5rem" : "5rem" } as React.CSSProperties}
        className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ease-out ${
          isScrolled
            ? "h-[calc(4.5rem+env(safe-area-inset-top,0px))] bg-cream/90 backdrop-blur-xl border-b border-border shadow-[0_8px_30px_rgba(46,90,68,0.06)]"
            : "h-[calc(5rem+env(safe-area-inset-top,0px))] bg-cream/80 backdrop-blur-md border-b border-border/70"
        }`}
      >
        <div className="max-w-[1600px] mx-auto w-full h-full px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between gap-2 lg:gap-4 xl:gap-6">
          {/* Brand Identity (Left) */}
          <div className="shrink-0 flex items-center">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              aria-label={common("brandAria")}
              className="group flex items-center gap-2.5 sm:gap-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 rounded-full py-1 pr-2 select-none"
            >
              {/* Minimalist Monogram Badge (>= 40px, 44px touch target) */}
              <div className="w-11 h-11 rounded-full bg-sage border border-sage/20 group-hover:bg-sage-hover flex items-center justify-center shrink-0 transition-all duration-300 shadow-[0_2px_10px_rgba(46,90,68,0.2)]">
                <span className="font-serif text-sm font-semibold tracking-wider text-cream">
                  DM
                </span>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-xs font-semibold tracking-[0.16em] sm:tracking-[0.18em] text-charcoal uppercase group-hover:text-sage transition-colors leading-tight whitespace-nowrap">
                  DINNA MIRZABAYEVA
                </span>
                <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-charcoal-muted group-hover:text-sage transition-colors hidden sm:inline-block leading-tight mt-0.5 whitespace-nowrap">
                  @m1rzabayevaa_021 · Psixolog
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links (Center — Desktop 1024px+ lg:flex) */}
          <nav
            aria-label={t("mainNavAria")}
            className="hidden lg:flex items-center justify-center gap-1 shrink-0 bg-cream-200/90 border border-border rounded-full px-2.5 py-1 backdrop-blur-md shadow-[0_2px_12px_rgba(46,90,68,0.03)]"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center min-h-[44px] px-3.5 py-2 rounded-full text-xs tracking-[0.03em] font-medium transition-all duration-200 select-none whitespace-nowrap ${
                    isActive
                      ? "text-cream bg-sage shadow-[0_2px_8px_rgba(46,90,68,0.25)]"
                      : "text-charcoal-muted hover:text-charcoal hover:bg-cream-300/60"
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions: Primary CTA Button & Language Selector (Desktop 1024px+ lg:flex) */}
          <div className="hidden lg:flex shrink-0 items-center justify-end gap-2.5 xl:gap-3">
            <Button
              type="button"
              onClick={() => handleApply({ service: ctaT("mentorship") })}
              className="h-11 min-h-[44px] shrink-0 group rounded-full bg-sage hover:bg-sage-hover active:scale-[0.98] px-5 font-sans text-xs tracking-wide text-cream font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-[0_4px_16px_rgba(46,90,68,0.25)] hover:shadow-[0_6px_22px_rgba(46,90,68,0.35)]"
            >
              <span className="whitespace-nowrap">{ctaT("mentorship")}</span>
              <svg
                className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-cream"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Button>

            <LanguageSwitcher />
          </div>

          {/* Mobile & Tablet Actions (Shown below 1024px: lg:hidden) */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
            <div className="hidden sm:block" aria-hidden="true">
              <Button
                type="button"
                tabIndex={-1}
                onClick={() => handleApply({ service: ctaT("mentorship") })}
                className="h-11 min-h-[44px] shrink-0 group rounded-full bg-sage hover:bg-sage-hover px-4 font-sans text-xs tracking-wide text-cream font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-sm active:scale-[0.98]"
              >
                <span className="whitespace-nowrap">{ctaT("mentorship")}</span>
                <span className="text-xs font-bold" aria-hidden="true">↗</span>
              </Button>
            </div>

            <LanguageSwitcher />

            {/* Mobile Menu Toggle Button (min 44x44px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={common("openMenu")}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-charcoal hover:text-sage bg-cream-200 hover:bg-cream-300 border border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenApply={(opts) => {
          setIsMobileMenuOpen(false);
          handleApply(opts);
        }}
      />
    </>
  );
}

