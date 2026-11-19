"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { siteMedia } from "@/config/siteMedia";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { Lightbox, LightboxMedia } from "@/components/ui/Lightbox";
import { Badge } from "@/components/ui/badge";

export function Expert() {
  const t = useTranslations("expert");
  const { portrait } = siteMedia.expert;
  const diplomas = siteMedia.diplomas;
  const [activeMedia, setActiveMedia] = useState<LightboxMedia | null>(null);

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

        {/* Diplomas & Qualifications (Mobile: Horizontal Scroll-Snap / Desktop: 3 Columns) */}
        <div id="sertifikatlar" className="pt-10 sm:pt-14 border-t border-border w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-sage rounded-full" aria-hidden="true" />
              <Badge
                variant="outline"
                className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sage border-sage/30 bg-sage/5 font-medium py-0.5 px-3 rounded-full"
              >
                {t("certificatesHint")}
              </Badge>
            </div>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible no-scrollbar">
            {diplomas.map((doc, idx) => (
              <div
                key={doc.id || idx}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActiveMedia({
                    src: doc.src,
                    title: doc.title,
                    issuer: doc.issuer,
                    year: doc.year,
                    alt: doc.alt,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveMedia({
                      src: doc.src,
                      title: doc.title,
                      issuer: doc.issuer,
                      year: doc.year,
                      alt: doc.alt,
                    });
                  }
                }}
                aria-label={`${doc.title} — zoom`}
                className="snap-center min-w-[260px] sm:min-w-0 group relative bg-white/80 border border-border hover:border-sage/40 p-4 rounded-2xl shadow-card transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100 rounded-xl mb-3 border border-border/80 flex items-center justify-center p-2">
                    <Image
                      src={doc.thumb}
                      alt={doc.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 50vw, 380px"
                      className="object-contain w-full h-full group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute bottom-2 right-2 bg-sage text-cream px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
                      Zoom
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-medium text-charcoal line-clamp-2 leading-snug group-hover:text-sage transition-colors">
                    {doc.title}
                  </h4>
                  {doc.issuer && (
                    <p className="text-[11px] text-charcoal-muted font-normal line-clamp-1 mt-1 font-mono">
                      {doc.issuer}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-sage font-semibold">
                    {doc.year || "CERT"}
                  </span>
                  <span className="text-[11px] text-charcoal-muted group-hover:text-sage font-medium">
                    Ko&apos;rish →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <Lightbox
        isOpen={Boolean(activeMedia)}
        onClose={() => setActiveMedia(null)}
        media={activeMedia}
      />
    </section>
  );
}
