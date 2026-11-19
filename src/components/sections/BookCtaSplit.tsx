"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, HeartPulse } from "lucide-react";

interface BookCtaSplitProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

export function BookCtaSplit({ onOpenApply }: BookCtaSplitProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const t = useTranslations("book");

  const handleConsultation = () => {
    handleApply(t("card1Title"));
  };

  return (
    <section
      id="qabul"
      aria-label={t("sectionAria")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <MaskedHeading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-charcoal leading-[1.16]">
            {t("titlePrefix")}
            <span className="italic text-sage ml-1">
              {t("titleHighlight")}
            </span>
          </MaskedHeading>
        </div>

        {/* 2 Equal Cards: Consultation & Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Individual Consultation */}
          <article className="group relative overflow-hidden rounded-3xl border border-charcoal/20 p-7 sm:p-10 flex flex-col justify-between shadow-xl min-h-[520px] transition-all duration-500 hover:shadow-2xl">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/cta/consultation-bg.webp"
                alt={t("card1Title")}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Dark Rich Editorial Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-charcoal/70" />
            </div>

            {/* Card Content (Crisp High-Contrast White & Cream) */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-cream flex items-center justify-center mb-6">
                <HeartPulse className="w-6 h-6 text-cream" aria-hidden="true" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-cream mb-3 leading-snug">
                {t("card1Title")}
              </h3>

              <p className="text-sm sm:text-base text-cream/80 leading-relaxed mb-6 font-normal">
                {t("card1Desc")}
              </p>

              <div className="p-4 sm:p-5 bg-black/30 rounded-2xl border border-white/15 text-xs sm:text-sm text-cream/95 space-y-3 mb-6">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t("card1Point1")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t("card1Point2")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t("card1Point3")}</span>
                </div>
              </div>
            </div>

            {/* CTA 1: Apply for consultation */}
            <div className="relative z-10 pt-5 border-t border-white/15">
              <Button
                type="button"
                onClick={handleConsultation}
                className="w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-cream text-charcoal hover:bg-white text-sm font-semibold tracking-wide shadow-md transition-all active:scale-[0.98]"
              >
                {t("card1Cta")} &rarr;
              </Button>
            </div>
          </article>

          {/* Card 2: 3-Minute Assessment Test */}
          <article className="group relative overflow-hidden rounded-3xl border border-charcoal/20 p-7 sm:p-10 flex flex-col justify-between shadow-xl min-h-[520px] transition-all duration-500 hover:shadow-2xl">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/cta/diagnostic-bg.webp"
                alt={t("card2Title")}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Dark Rich Editorial Gradient Scrim (Natural tones matching Card 1) */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-charcoal/70" />
            </div>

            {/* Card Content (Crisp High-Contrast White & Cream) */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-cream flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-cream" aria-hidden="true" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-cream mb-3 leading-snug">
                {t("card2Title")}
              </h3>

              <p className="text-sm sm:text-base text-cream/80 leading-relaxed mb-6 font-normal">
                {t("card2Desc")}
              </p>

              <div className="p-4 sm:p-5 bg-black/30 rounded-2xl border border-white/15 text-xs sm:text-sm text-cream/95 space-y-3 mb-6">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t("card2Point1")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t("card2Point2")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t("card2Point3")}</span>
                </div>
              </div>
            </div>

            {/* CTA 2: Start 3-minute test */}
            <div className="relative z-10 pt-5 border-t border-white/15">
              <Button
                asChild
                className="w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-cream text-charcoal hover:bg-white text-sm font-semibold tracking-wide shadow-md transition-all active:scale-[0.98]"
              >
                <Link href="/test">
                  <span>{t("card2Cta")} &rarr;</span>
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
