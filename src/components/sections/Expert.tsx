"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { siteMedia } from "@/config/siteMedia";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function Expert() {
  const t = useTranslations("expert");
  const { portrait } = siteMedia.expert;

  const pillars = [
    {
      tag: t("pillar1Tag"),
      title: t("pillar1Title"),
      desc: t("pillar1Desc"),
    },
    {
      tag: t("pillar2Tag"),
      title: t("pillar2Title"),
      desc: t("pillar2Desc"),
    },
    {
      tag: t("pillar3Tag"),
      title: t("pillar3Title"),
      desc: t("pillar3Desc"),
    },
  ];

  return (
    <section
      id="ekspert"
      aria-label={t("name")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <MaskedHeading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-charcoal leading-[1.16]">
            {t("headlinePrefix")}
            <span className="italic text-sage ml-1">
              {t("headlineHighlight")}
            </span>
          </MaskedHeading>
        </div>

        {/* Mobile Portrait (Arch, shown top on mobile, hidden on lg+) */}
        <div className="block lg:hidden mb-10 w-full max-w-[320px] mx-auto">
          <div className="relative aspect-[4/5] w-full rounded-t-full rounded-b-2xl overflow-hidden border border-sage/20 shadow-card bg-cream-200">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes="(max-width: 430px) 320px, 400px"
              className="object-cover object-top"
              loading="lazy"
            />
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between font-mono text-xs uppercase tracking-wider text-charcoal-muted">
            <span className="text-charcoal font-semibold">{t("name")}</span>
            <span className="text-sage font-bold">{t("experience")}</span>
          </div>
        </div>

        {/* 12-Column Editorial Grid (Desktop: Portrait left, Bio right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16">
          {/* Left Column (Desktop 5 cols) — Arch Portrait */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative aspect-[4/5] w-full rounded-t-full rounded-b-2xl overflow-hidden border border-sage/20 shadow-card bg-cream-200 group">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(max-width: 1200px) 40vw, 420px"
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between font-mono text-xs uppercase tracking-wider text-charcoal-muted">
              <span className="text-charcoal font-semibold">{t("name")}</span>
              <span className="text-sage font-bold">{t("experience")}</span>
            </div>
          </div>

          {/* Right Column (Desktop 7 cols) — Bio, Pull Quote & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            {/* Pull Quote */}
            <blockquote className="border-l-2 border-sage pl-5 sm:pl-6 py-2 font-serif italic text-lg sm:text-2xl text-charcoal leading-relaxed bg-cream-200/50 rounded-r-2xl">
              &ldquo;{t("quote")}&rdquo;
            </blockquote>

            {/* Biography Prose */}
            <div className="text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed space-y-4">
              <p>{t("bio1")}</p>
              <p>{t("bio2")}</p>
            </div>

            {/* 3 Pillars: Editorial Cards with Top Border */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-border">
              {pillars.map((p, idx) => (
                <div key={idx} className="pt-3 border-t border-sage/30">
                  <span className="font-mono text-[10px] text-terracotta-dark font-semibold uppercase tracking-wider block mb-1">
                    {p.tag}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif text-charcoal font-normal mb-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
