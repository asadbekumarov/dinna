"use client";

import React from "react";
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
          <article className="bg-white/90 border border-border rounded-2xl p-6 sm:p-9 flex flex-col justify-between shadow-card hover:border-sage/40 transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-sage-soft text-sage flex items-center justify-center mb-5">
                <HeartPulse className="w-5 h-5 text-sage" aria-hidden="true" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal mb-3 leading-snug">
                {t("card1Title")}
              </h3>

              <p className="text-sm text-charcoal-muted leading-relaxed mb-6 font-normal">
                {t("card1Desc")}
              </p>

              <div className="p-4 bg-cream-50 rounded-xl border border-border text-xs text-charcoal/90 space-y-2.5 mb-6">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{t("card1Point1")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{t("card1Point2")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{t("card1Point3")}</span>
                </div>
              </div>
            </div>

            {/* CTA 1: Apply for consultation */}
            <div className="pt-4 border-t border-border">
              <Button
                type="button"
                onClick={handleConsultation}
                className="w-full sm:w-auto min-h-[48px] px-8 rounded-full bg-sage hover:bg-sage-hover text-cream text-sm font-semibold tracking-wide shadow-sm"
              >
                {t("card1Cta")} &rarr;
              </Button>
            </div>
          </article>

          {/* Card 2: 3-Minute Assessment Test */}
          <article className="bg-cream-200/80 border border-sage/30 rounded-2xl p-6 sm:p-9 flex flex-col justify-between shadow-card hover:border-sage/50 transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-terracotta-soft text-terracotta-dark flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5 text-terracotta-dark" aria-hidden="true" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal mb-3 leading-snug">
                {t("card2Title")}
              </h3>

              <p className="text-sm text-charcoal-muted leading-relaxed mb-6 font-normal">
                {t("card2Desc")}
              </p>

              <div className="p-4 bg-white/80 rounded-xl border border-border text-xs text-charcoal/90 space-y-2.5 mb-6">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{t("card2Point1")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{t("card2Point2")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{t("card2Point3")}</span>
                </div>
              </div>
            </div>

            {/* CTA 2: Start 3-minute test */}
            <div className="pt-4 border-t border-border/80">
              <Button
                asChild
                className="w-full sm:w-auto min-h-[48px] px-8 rounded-full bg-sage hover:bg-sage-hover text-cream text-sm font-semibold tracking-wide shadow-sm"
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
