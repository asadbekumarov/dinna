"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { contactConfig } from "@/config/contact";

export function Footer() {
  const t = useTranslations("footer");

  const socialLinks = [
    {
      label: t("instagram"),
      href: contactConfig.instagram.url,
      ariaLabel: contactConfig.instagram.ariaLabel,
      external: true,
    },
    {
      label: t("telegram"),
      href: contactConfig.telegramDirect.url,
      ariaLabel: contactConfig.telegramDirect.ariaLabel,
      external: true,
    },
    {
      label: t("channel"),
      href: contactConfig.telegramChannel.url,
      ariaLabel: contactConfig.telegramChannel.ariaLabel,
      external: true,
    },
    {
      label: t("privacy"),
      href: "/privacy",
      ariaLabel: t("privacy"),
      external: false,
    },
    {
      label: t("terms"),
      href: "/terms",
      ariaLabel: t("terms"),
      external: false,
    },
  ];

  return (
    <footer className="bg-cream-200 border-t border-border py-10 pb-24 md:pb-12 text-charcoal">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-sage/20 bg-cream shrink-0">
              <Image
                src="/images/brand/logo-mark.webp"
                alt="Dinna Mirzabayeva"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold tracking-[0.16em] text-xs text-charcoal uppercase">
              {t("brand")}
            </span>
          </div>
          <span className="text-xs text-charcoal-muted">
            {t("rights")}
          </span>
        </div>

        {/* Right: Links with min 44px touch targets */}
        <nav
          aria-label="Footer links"
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 font-mono text-xs text-charcoal-muted"
        >
          {socialLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.ariaLabel}
                  className="min-h-[44px] min-w-[44px] px-2.5 inline-flex items-center justify-center hover:text-sage transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  aria-label={item.ariaLabel}
                  className="min-h-[44px] min-w-[44px] px-2.5 inline-flex items-center justify-center hover:text-sage transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  {item.label}
                </Link>
              )}
              {idx < socialLinks.length - 1 && (
                <span className="text-border select-none hidden sm:inline" aria-hidden="true">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </footer>
  );
}
