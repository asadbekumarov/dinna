"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useApplyModal, type OpenApplyOptions } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { formatSectionKicker } from "@/config/sections";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceEnhanced {
  index: string;
  tag: string;
  title: string;
  description: string;
  time: string;
  format: string;
  features: string[];
  cta: string;
}

interface ServicesProps {
  onOpenApply?: (options?: OpenApplyOptions) => void;
}

export function Services({ onOpenApply }: ServicesProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const t = useTranslations("services");

  const servicesList: ServiceEnhanced[] = (t.raw("itemsEnhanced") as ServiceEnhanced[]) || [];

  return (
    <section
      id="xizmatlar"
      aria-label={t("title")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header (01 + kicker + serif H2) */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-sage font-bold tracking-widest uppercase">
              01
            </span>
            <span className="text-border" aria-hidden="true">/</span>
            <BotanicalMotif variant="leaf" className="w-4 h-4 text-terracotta shrink-0" />
            <Badge
              variant="outline"
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sage border-sage/30 bg-sage/5 font-medium py-0.5 px-3 rounded-full"
            >
              {formatSectionKicker("services", t("kicker"))}
            </Badge>
          </div>

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

        {/* Services: Mobile Vertical List / Desktop 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch mb-16">
          {servicesList.map((service, idx) => (
            <article
              key={service.index || idx}
              className="group relative flex flex-col justify-between pt-6 border-t-2 border-sage/30 hover:border-sage transition-colors duration-300 bg-transparent"
            >
              <div>
                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs font-mono text-charcoal-muted mb-3">
                  <span className="text-sage font-bold tracking-widest">{service.index}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-200 border border-border text-[11px]">
                    {service.time}
                  </span>
                </div>

                {/* Service Tag & Title */}
                <span className="font-mono text-[11px] uppercase tracking-wider text-terracotta-dark font-medium block mb-2">
                  {service.format}
                </span>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-charcoal leading-snug mb-3 group-hover:text-sage transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-charcoal-muted leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>

                {/* Key Features Bullets */}
                <ul className="space-y-2 py-4 border-t border-border text-xs text-charcoal/90 mb-6">
                  {service.features?.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="text-sage text-sm leading-none mt-0.5 font-bold">✓</span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <Button
                  type="button"
                  onClick={() => handleApply({ service: service.title })}
                  className="w-full min-h-[44px] rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide shadow-sm active:scale-[0.98] transition-all"
                >
                  {service.cta || t("applyButton")} →
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Simple 3-Row Comparison Table (replacing heavy tabs) */}
        <div className="border border-border rounded-2xl bg-white/70 p-6 sm:p-8 shadow-card mb-12">
          <div className="mb-6 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-terracotta-dark font-bold block mb-1">
                {t("compareBadge")}
              </span>
              <h3 className="font-serif text-2xl text-charcoal font-normal">
                {t("compareTitle")}
              </h3>
            </div>
            <p className="text-xs text-charcoal-muted">
              {t("compareSubtitle")}
            </p>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-charcoal-muted font-mono uppercase text-[11px]">
                  <th className="py-3 pr-4 font-medium">Format</th>
                  <th className="py-3 px-4 font-medium">Joylashuv</th>
                  <th className="py-3 px-4 font-medium">Davomiyligi</th>
                  <th className="py-3 pl-4 text-right font-medium">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {servicesList.map((s, i) => (
                  <tr key={i} className="hover:bg-cream-100 transition-colors">
                    <td className="py-4 pr-4 font-serif text-base text-charcoal font-medium">
                      {s.title}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-charcoal-muted">
                      {s.format}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-charcoal-muted">
                      {s.time}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApply({ service: s.title })}
                        className="rounded-full min-h-[44px] px-4 text-xs font-medium border-sage/30 text-sage hover:bg-sage hover:text-cream transition-all"
                      >
                        {t("applyButton")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic CTA Monolith */}
        <div className="border border-sage/30 bg-cream-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-sage font-semibold">
                {t("diagKicker")}
              </span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl text-charcoal font-normal mb-1">
              {t("diagTitle")}
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {t("diagDesc")}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button
              asChild
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-semibold tracking-wide shadow-sm"
            >
              <Link href="/test">
                <span>{t("diagCta")}</span>
                <span className="ml-1.5" aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
