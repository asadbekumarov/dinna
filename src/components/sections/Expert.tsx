"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { siteMedia } from "@/config/siteMedia";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { KenBurnsImage } from "@/components/ui/KenBurnsImage";
import { Lightbox, LightboxMedia } from "@/components/ui/Lightbox";
import { formatSectionKicker } from "@/config/sections";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Expert() {
  const t = useTranslations("expert");
  const { portrait } = siteMedia.expert;
  const diplomas = siteMedia.diplomas;
  const [activeMedia, setActiveMedia] = useState<LightboxMedia | null>(null);

  return (
    <section
      id="ekspert"
      aria-label={t("name")}
      className="scroll-mt-20 py-16 sm:py-24 border-b border-[#E5DFD6] bg-cream text-charcoal relative overflow-hidden"
    >
      {/* Subtle organic atmospheric ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-1/3 w-[520px] h-[520px] bg-[#E8DFD1]/70 blur-3xl rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] bottom-1/4 w-[480px] h-[480px] bg-[#DCE5DF]/60 blur-3xl rounded-full"
      />

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 relative z-10">
        {/* Top Section Kicker */}
        <div className="flex items-center gap-3 mb-12">
          <BotanicalMotif variant="leaf" className="w-5 h-5 text-[#C49A6C]" />
          <Badge
            variant="outline"
            className="font-mono text-xs uppercase tracking-[0.22em] text-sage border-sage/30 bg-sage/5 font-medium py-1 px-3 rounded-full"
          >
            {formatSectionKicker("expert", t("kicker"))}
          </Badge>
        </div>

        {/* Main 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column — Editorial Portrait (lg:col-span-5) */}
          <div className="lg:col-span-5 group">
            <Card className="relative aspect-[3/4] w-full bg-white rounded-3xl overflow-hidden border border-[#E5DFD6] shadow-[0_12px_40px_rgba(46,90,68,0.08)] p-0">
              <CardContent className="p-0 h-full w-full">
                <KenBurnsImage>
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                    className="object-cover w-full h-full group-hover:scale-[1.03] transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                </KenBurnsImage>
              </CardContent>
            </Card>

            {/* Below Image Metadata Bar */}
            <div className="mt-4 pt-4 border-t border-[#E5DFD6] flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.16em] text-[#5C6660]">
              <span className="text-charcoal font-semibold">{t("name")}</span>
              <span className="text-sage font-bold">{t("experience")}</span>
            </div>
          </div>

          {/* Right Column — Biography, Editorial Quote & 3 Pillars */}
          <div className="lg:col-span-7 space-y-9">
            {/* Headline */}
            <MaskedHeading className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-[-0.02em] leading-[1.2] text-charcoal">
              {t("headlinePrefix")}
              <span className="font-serif italic font-normal text-sage">
                {t("headlineHighlight")}
              </span>
              {t("headlineSuffix")}
            </MaskedHeading>

            {/* Editorial Pull-Quote */}
            <blockquote className="border-l-2 border-sage pl-6 py-2 font-serif italic text-xl sm:text-2xl text-charcoal leading-relaxed bg-[#F2EFE9]/60 rounded-r-2xl">
              &ldquo;{t("quote")}&rdquo;
            </blockquote>

            {/* Biography Prose */}
            <div className="text-base sm:text-lg text-[#5C6660] font-normal leading-[1.75] space-y-4">
              <p>{t("bio1")}</p>
              <p>{t("bio2")}</p>
            </div>

            {/* The 3 Philosophy Pillars with shadcn Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Pillar 1 */}
              <Card className="p-5 bg-white border border-[#E5DFD6] rounded-2xl shadow-[0_4px_16px_rgba(46,90,68,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(46,90,68,0.08)] transition-all duration-500">
                <CardContent className="p-0">
                  <span className="font-mono text-xs text-[#C49A6C] font-semibold tracking-wider block mb-2">
                    {t("pillar1Tag")}
                  </span>
                  <h3 className="text-base font-semibold text-charcoal mb-1.5">
                    {t("pillar1Title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {t("pillar1Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Pillar 2 */}
              <Card className="p-5 bg-white border border-[#E5DFD6] rounded-2xl shadow-[0_4px_16px_rgba(46,90,68,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(46,90,68,0.08)] transition-all duration-500">
                <CardContent className="p-0">
                  <span className="font-mono text-xs text-sage font-semibold tracking-wider block mb-2">
                    {t("pillar2Tag")}
                  </span>
                  <h3 className="text-base font-semibold text-charcoal mb-1.5">
                    {t("pillar2Title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {t("pillar2Desc")}
                  </p>
                </CardContent>
              </Card>

              {/* Pillar 3 */}
              <Card className="p-5 bg-white border border-[#E5DFD6] rounded-2xl shadow-[0_4px_16px_rgba(46,90,68,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(46,90,68,0.08)] transition-all duration-500">
                <CardContent className="p-0">
                  <span className="font-mono text-xs text-[#C49A6C] font-semibold tracking-wider block mb-2">
                    {t("pillar3Tag")}
                  </span>
                  <h3 className="text-base font-semibold text-charcoal mb-1.5">
                    {t("pillar3Title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                    {t("pillar3Desc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Professional Qualifications & Diplomas */}
        <div id="sertifikatlar" className="mt-14 sm:mt-20 pt-10 sm:pt-14 border-t border-[#E5DFD6] w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-sage rounded-full" aria-hidden="true" />
              <Badge
                variant="outline"
                className="font-mono text-xs uppercase tracking-[0.2em] text-sage border-sage/30 bg-sage/5 font-medium py-1 px-3 rounded-full"
              >
                {t("certificatesHint")}
              </Badge>
            </div>
            <span className="font-mono text-xs text-[#5C6660] uppercase tracking-wider">
              / 03
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {diplomas.map((doc, idx) => (
              <Card
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
                className="group relative w-full bg-white border border-[#E5DFD6] hover:border-sage/40 p-5 rounded-2xl shadow-[0_4px_16px_rgba(46,90,68,0.04)] hover:shadow-[0_8px_30px_rgba(46,90,68,0.08)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9] rounded-xl mb-4 border border-[#E5DFD6] flex items-center justify-center p-2">
                    <Image
                      src={doc.thumb}
                      alt={doc.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-contain w-full h-full group-hover:scale-[1.03] transition-all duration-500 ease-out"
                    />
                    <div className="absolute bottom-2 right-2 bg-sage text-cream px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
                      Zoom
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#E5DFD6] flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-charcoal line-clamp-2 leading-snug group-hover:text-sage transition-colors">
                        {doc.title}
                      </h4>
                      {doc.issuer && (
                        <p className="text-xs text-[#5C6660] font-normal line-clamp-1 mt-1">
                          {doc.issuer}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="font-mono text-xs text-sage border-sage/30 font-semibold shrink-0 mt-0.5">
                      {doc.year || "CERT"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
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
