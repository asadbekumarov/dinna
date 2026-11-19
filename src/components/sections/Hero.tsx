"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/Marquee";
import { Sparkles, Star } from "lucide-react";

interface HeroProps {
  onOpenModal?: () => void;
  onOpenApply?: () => void;
}

export default function Hero({ onOpenModal, onOpenApply }: HeroProps = {}) {
  const { openApply } = useApplyModal();

  const handleOpenModal = () => {
    if (onOpenModal) {
      onOpenModal();
    } else if (onOpenApply) {
      onOpenApply();
    } else {
      openApply();
    }
  };

  const t = useTranslations("hero");
  const ctaT = useTranslations("cta");

  // Localized Marquee Ticker items
  const tickerItems: string[] = (t.raw("tickerItems") as string[]) || [];

  return (
    <section
      id="hero"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 85% 15%, rgba(46, 90, 68, 0.07) 0%, rgba(197, 155, 109, 0.05) 45%, rgba(250, 248, 245, 0) 80%), #FAF8F5",
      }}
      className="scroll-mt-20 relative min-h-[600px] min-h-[92svh] supports-[height:100svh]:min-h-[92svh] bg-cream text-charcoal pt-24 sm:pt-28 pb-8 flex flex-col justify-between border-b border-border overflow-x-clip"
    >
      {/* Main Editorial Content Container */}
      <div className="max-w-[1360px] mx-auto w-full px-5 sm:px-8 lg:px-12 my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (Desktop 7 cols) / Mobile Stack */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Bespoke Editorial H1 */}
            <h1 className="text-display font-serif font-normal tracking-[-0.02em] text-charcoal leading-[1.12] animate-hero-mask-reveal">
              {t("titlePrefix")}
              <span className="italic text-sage border-b border-sage/40 pb-0.5 inline-block">
                {t("titleHighlight")}
              </span>
              {t("titleSuffix")}
            </h1>

            {/* 3. Mobile-Only Arch Portrait (shown after H1 on mobile, hidden on lg+) */}
            <div className="block lg:hidden my-6 w-full max-w-[340px] mx-auto">
              <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden border border-sage/20 shadow-card bg-cream-200">
                <Image
                  src="/images/hero/dinna-portrait.webp"
                  alt={t("portraitAlt")}
                  fill
                  priority
                  sizes="(max-width: 430px) 340px, 400px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent pointer-events-none" />

                {/* Photo Bottom Identification */}
                <div className="absolute bottom-3.5 left-4 right-4 z-20 text-cream">
                  <p className="font-serif italic text-xl font-normal leading-tight">
                    Dinna Mirzabayeva
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-terracotta mt-0.5">
                    {t("captionRole")}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Single-Sentence Subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-charcoal-muted font-normal leading-relaxed max-w-xl mt-3 lg:mt-6">
              {t("description")}
            </p>

            {/* 5. CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Primary CTA (Full-width on mobile, 52px height) */}
              <Button
                size="lg"
                onClick={handleOpenModal}
                className="w-full sm:w-auto h-[52px] min-h-[52px] bg-sage hover:bg-sage-hover text-cream px-8 rounded-full text-sm font-semibold tracking-wide shadow-[0_8px_24px_rgba(46,90,68,0.25)] hover:shadow-[0_12px_30px_rgba(46,90,68,0.35)] cursor-pointer active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>{ctaT("primary")}</span>
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Button>

              {/* Desktop Secondary CTA (Quiz) */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="hidden sm:inline-flex h-[52px] min-h-[52px] bg-white/90 hover:bg-cream-200 text-sage hover:text-sage-hover border border-sage/35 hover:border-sage px-6 rounded-full text-sm font-medium transition-all shadow-sm active:scale-[0.98] items-center gap-2"
              >
                <Link href="/test">
                  <span>{t("ctaSecondary")}</span>
                  <span className="text-xs font-mono" aria-hidden="true">↗</span>
                </Link>
              </Button>
            </div>

            {/* Mobile-Only Subtle Quiz Text Link */}
            <div className="block sm:hidden text-center mt-2">
              <Link
                href="/test"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono text-charcoal-muted hover:text-sage transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>{t("quickQuiz")}</span>
              </Link>
            </div>
          </div>

          {/* Right Column (Desktop 5 cols) — Arch Sculptural Portrait */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-end w-full">
            <div className="relative w-full max-w-[390px]">
              {/* Arch Photo Container */}
              <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden border border-sage/20 shadow-modal bg-cream-200 group">
                <Image
                  src="/images/hero/dinna-portrait.webp"
                  alt={t("portraitAlt")}
                  fill
                  priority
                  sizes="390px"
                  className="object-cover object-top hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent pointer-events-none" />

                {/* Person identification bottom overlay */}
                <div className="absolute bottom-5 left-5 right-5 z-20 text-cream">
                  <p className="font-serif italic text-2xl font-normal leading-tight">
                    Dinna Mirzabayeva
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta mt-1 font-medium">
                    {t("captionRole")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Metrics Bar */}
        <div className="pt-8 sm:pt-10 mt-8 sm:mt-12 border-t border-border">
          {/* Mobile Metrics: 3-column compact row (number on top, label on bottom) */}
          <div className="grid grid-cols-3 gap-2 sm:hidden text-center">
            {/* Metric 01 */}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-light text-charcoal tracking-tight flex items-baseline">
                <AnimatedCounter value="500" />
                <span className="text-terracotta font-serif italic text-sm ml-0.5">+</span>
              </div>
              <span className="font-mono text-[10px] text-sage font-medium uppercase mt-1 line-clamp-1">
                {t("metric1Label")}
              </span>
            </div>

            {/* Metric 02 */}
            <div className="flex flex-col items-center border-x border-border px-1">
              <div className="text-2xl font-light text-charcoal tracking-tight flex items-baseline">
                <AnimatedCounter value="98" />
                <span className="text-terracotta font-serif italic text-sm ml-0.5">%</span>
              </div>
              <span className="font-mono text-[10px] text-sage font-medium uppercase mt-1 line-clamp-1">
                {t("metric2Label")}
              </span>
            </div>

            {/* Metric 03 */}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-light text-charcoal tracking-tight flex items-center">
                <span>5/5</span>
                <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta ml-1" />
              </div>
              <span className="font-mono text-[10px] text-sage font-medium uppercase mt-1 line-clamp-1">
                {t("metric3Label")}
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Metrics (sm+) */}
          <div className="hidden sm:grid sm:grid-cols-3 divide-x divide-border">
            {/* Metric 01 */}
            <div className="pr-6 sm:pr-8 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-xs text-sage font-semibold block mb-1">
                  {t("metric1Label")}
                </span>
                <span className="text-xs sm:text-sm text-charcoal-muted font-normal">
                  {t("metric1Desc")}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-charcoal ml-4 flex items-baseline shrink-0">
                <AnimatedCounter value="500" />
                <span className="text-terracotta font-serif italic ml-0.5">+</span>
              </div>
            </div>

            {/* Metric 02 */}
            <div className="px-6 sm:px-8 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-xs text-sage font-semibold block mb-1">
                  {t("metric2Label")}
                </span>
                <span className="text-xs sm:text-sm text-charcoal-muted font-normal">
                  {t("metric2Desc")}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-charcoal ml-4 flex items-baseline shrink-0">
                <AnimatedCounter value="98" />
                <span className="text-terracotta font-serif italic ml-0.5">%</span>
              </div>
            </div>

            {/* Metric 03 */}
            <div className="pl-6 sm:pl-8 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-xs text-sage font-semibold block mb-1">
                  {t("metric3Label")}
                </span>
                <span className="text-xs sm:text-sm text-charcoal-muted font-normal">
                  {t("metric3Desc")}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-charcoal ml-4 flex items-center shrink-0">
                <span>5/5</span>
                <Star className="w-4 h-4 fill-terracotta text-terracotta ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Marquee Ribbon (Reduced motion safe) */}
      <div className="w-full border-t border-border mt-8 py-3 bg-cream/70 relative overflow-hidden">
        <Marquee speed={32} pauseOnHover={false} className="py-0.5">
          <div className="flex items-center gap-8 px-4 text-xs font-mono uppercase tracking-[0.16em] text-charcoal-muted">
            {tickerItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-terracotta shrink-0" aria-hidden="true" />
                  <span className="hover:text-sage transition-colors">{item}</span>
                </span>
                <span className="text-border" aria-hidden="true">·</span>
              </React.Fragment>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}

export { Hero };
