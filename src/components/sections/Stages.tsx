"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { Button } from "@/components/ui/button";
import { Check, Lock } from "lucide-react";

interface StepItem {
  num: string;
  tag: string;
  title: string;
  time: string;
  desc: string;
  highlights: string[];
  icon: string;
}

interface StagesProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

export function Stages({ onOpenApply }: StagesProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const t = useTranslations("stages");

  const steps: StepItem[] = (t.raw("steps") as StepItem[]) || [];

  return (
    <section
      id="bosqichlar"
      aria-label={t("title")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <MaskedHeading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-charcoal leading-[1.16]">
            {t("titlePrefix")}
            <span className="italic text-sage ml-1">
              {t("titleHighlight")}
            </span>
          </MaskedHeading>

          <p className="text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed mt-4 max-w-2xl">
            {t("description")}
          </p>
        </div>

        {/* Mobile Vertical Timeline (hidden on lg) */}
        <div className="block lg:hidden relative pl-6 sm:pl-8 border-l-2 border-sage/30 space-y-10 mb-12">
          {steps.map((step, idx) => (
            <article key={step.num || idx} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sage text-cream flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                {step.num}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{step.icon}</span>
                  <span className="font-mono text-[10px] text-terracotta-dark font-medium uppercase tracking-wider">
                    {step.tag}
                  </span>
                  <span className="text-border">·</span>
                  <span className="font-mono text-[10px] text-charcoal-muted">
                    {step.time}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-charcoal mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-charcoal-muted leading-relaxed mb-4">
                  {step.desc}
                </p>

                <ul className="space-y-1.5 bg-cream-200/60 p-3.5 rounded-xl border border-border text-xs text-charcoal/90">
                  {step.highlights?.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop 3-Column Editorial Grid (hidden on < lg) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 xl:gap-10 items-stretch mb-16">
          {steps.map((step, idx) => (
            <article
              key={step.num || idx}
              className="pt-6 border-t-2 border-sage/30 flex flex-col justify-between group hover:border-sage transition-colors duration-300"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between font-mono text-xs text-charcoal-muted mb-4">
                  <span className="text-2xl font-serif text-sage font-light">{step.num}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-200 border border-border text-[11px]">
                    {step.time}
                  </span>
                </div>

                <span className="font-mono text-[10px] text-terracotta-dark font-semibold uppercase tracking-wider block mb-2">
                  {step.tag}
                </span>

                <h3 className="font-serif text-2xl font-normal text-charcoal leading-snug mb-3 group-hover:text-sage transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-charcoal-muted leading-relaxed mb-6 font-normal">
                  {step.desc}
                </p>
              </div>

              {/* Highlights List */}
              <ul className="space-y-2 py-4 border-t border-border text-xs text-charcoal/90">
                {step.highlights?.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Reassurance Callout Bar */}
        <div className="border border-border bg-white/70 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="w-12 h-12 rounded-full bg-sage/10 text-sage flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-sage" />
            </span>
            <div>
              <h4 className="font-serif text-lg sm:text-xl text-charcoal font-medium">
                {t("ctaBandTitle")}
              </h4>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
                {t("ctaBandDesc")}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => handleApply()}
            className="w-full sm:w-auto min-h-[48px] px-8 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide shadow-sm active:scale-[0.98] shrink-0"
          >
            {t("ctaBandButton")} →
          </Button>
        </div>
      </div>
    </section>
  );
}
