"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteMedia } from "@/config/siteMedia";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { formatSectionKicker } from "@/config/sections";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface BookCtaSplitProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

export function BookCtaSplit({ onOpenApply }: BookCtaSplitProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const tBook = useTranslations("book");
  const tCta = useTranslations("ctaBand");
  const { cover } = siteMedia.book;

  const handleOrderBook = () => {
    handleApply(tBook("bookTitle"));
  };

  const specs = [
    { label: tBook("spec1Label"), value: tBook("spec1Value") },
    { label: tBook("spec2Label"), value: tBook("spec2Value") },
    { label: tBook("spec3Label"), value: tBook("spec3Value") },
  ];

  return (
    <section
      id="kitob"
      aria-label={tBook("sectionAria")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header (kicker + serif H2) */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <BotanicalMotif variant="leaf" className="w-4 h-4 text-terracotta shrink-0" />
            <Badge
              variant="outline"
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sage border-sage/30 bg-sage/5 font-medium py-0.5 px-3 rounded-full"
            >
              {formatSectionKicker("book", tBook("kicker"))}
            </Badge>
          </div>

          <MaskedHeading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-charcoal leading-[1.16]">
            {tBook("titlePrefix")}
            <span className="italic text-sage ml-1">
              {tBook("titleHighlight")}
            </span>
          </MaskedHeading>
        </div>

        {/* 2 Blocks Stacked on Mobile, Side-by-Side 7/5 on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Block 1: The Book (lg:col-span-7) */}
          <article className="lg:col-span-7 bg-white/80 border border-border rounded-2xl p-6 sm:p-9 flex flex-col justify-between shadow-card hover:border-sage/40 transition-colors">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta-dark font-semibold block mb-2">
                {tBook("badge")}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal mb-3">
                {tBook("bookTitle")}
              </h3>

              <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                {tBook("description")}
              </p>

              {/* Cover & Specs */}
              <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6">
                <div className="sm:col-span-4 flex justify-center">
                  <div className="relative w-[140px] aspect-[1/1.38] rounded-xl overflow-hidden shadow-card border border-border">
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      sizes="140px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-2.5 font-mono text-xs">
                  {specs.map((item, idx) => (
                    <div key={idx} className="flex items-baseline justify-between py-1.5 border-b border-border/70">
                      <span className="text-charcoal-muted uppercase">{item.label}</span>
                      <span className="font-semibold text-charcoal">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA 1: Order Book */}
            <div className="pt-4 border-t border-border">
              <Button
                type="button"
                onClick={handleOrderBook}
                className="w-full sm:w-auto min-h-[48px] px-8 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-semibold tracking-wide shadow-sm"
              >
                {tBook("cta")} →
              </Button>
            </div>
          </article>

          {/* Block 2: Quick Diagnostic & Consultation CTA (lg:col-span-5) */}
          <article className="lg:col-span-5 bg-cream-200/90 border border-sage/30 rounded-2xl p-6 sm:p-9 flex flex-col justify-between shadow-card">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-sage font-bold">
                  {tCta("kicker")}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal mb-3 leading-snug">
                {tCta("title")}
              </h3>

              <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                {tCta("description")}
              </p>

              <div className="p-4 bg-white/70 rounded-xl border border-border/80 text-xs text-charcoal/90 space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage shrink-0" />
                  <span>3 daqiqalik holat diagnostikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage shrink-0" />
                  <span>Toshkent 5/5 oflayn & Dunyo onlayn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage shrink-0" />
                  <span>100% konfidensial va xavfsiz muhit</span>
                </div>
              </div>
            </div>

            {/* CTA 2: Start Diagnostic */}
            <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="w-full min-h-[48px] rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-semibold tracking-wide shadow-sm"
              >
                <Link href="/test">
                  <span>{tCta("ctaDiagnostic")} →</span>
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
