"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteMedia } from "@/config/siteMedia";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { formatSectionKicker } from "@/config/sections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookCtaSplitProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

export function BookCtaSplit({ onOpenApply }: BookCtaSplitProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const tBook = useTranslations("book");
  const tCta = useTranslations("ctaBand");
  const ctaCommon = useTranslations("cta");
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
      className="scroll-mt-20 py-16 sm:py-24 border-t border-b border-[#E5DFD6] bg-cream relative overflow-hidden text-charcoal"
    >
      <span id="cta-band" className="absolute -top-24 pointer-events-none" />

      {/* Atmospheric depth glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#E8DFD1]/60 blur-3xl rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-[#DCE5DF]/50 blur-3xl rounded-full"
      />

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left 7 Columns: Signature Training Card with shadcn Card */}
          <Card className="lg:col-span-7 bg-white border-[#E5DFD6] rounded-2xl p-7 sm:p-9 flex flex-col justify-between shadow-[0_8px_30px_rgba(46,90,68,0.05)] hover:-translate-y-1 transition-all duration-500">
            <CardContent className="p-0 flex flex-col justify-between h-full">
              <div>
                {/* Kicker */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[2px] bg-sage rounded-full" aria-hidden="true" />
                  <Badge
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-[0.22em] text-sage border-sage/30 bg-sage/5 font-medium py-1 px-3 rounded-full"
                  >
                    {formatSectionKicker("book", tBook("kicker"))}
                  </Badge>
                </div>

                {/* Title */}
                <MaskedHeading className="text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.2] text-charcoal">
                  {tBook("titlePrefix")}
                  <span className="font-serif italic font-normal text-sage">
                    {tBook("titleHighlight")}
                  </span>
                </MaskedHeading>

                <p className="text-sm sm:text-base text-[#5C6660] font-normal mt-3 leading-relaxed max-w-xl">
                  {tBook("description")}
                </p>

                {/* Card Body: Cover + Specs */}
                <div className="mt-6 pt-6 border-t border-[#E5DFD6] grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* Visual Frame */}
                  <div className="sm:col-span-4 flex justify-center">
                    <div className="relative w-[140px] sm:w-[160px] aspect-[1/1.35] shadow-[0_12px_30px_rgba(46,90,68,0.12)] border border-[#E5DFD6] rounded-xl overflow-hidden">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(max-width: 640px) 140px, 160px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Specs List */}
                  <div className="sm:col-span-8 flex flex-col justify-center divide-y divide-[#E5DFD6]">
                    {specs.map((spec, i) => (
                      <div
                        key={i}
                        className="py-3 flex items-baseline justify-between gap-3 text-xs"
                      >
                        <span className="font-mono uppercase tracking-wider text-[#C59B6D] font-semibold shrink-0">
                          {spec.label}
                        </span>
                        <span className="text-charcoal font-sans text-xs sm:text-sm text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Row */}
              <div className="mt-8 pt-5 border-t border-[#E5DFD6] flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#5C6660]">
                  {tBook("pedestalLeft")}
                </span>
                <Button
                  onClick={handleOrderBook}
                  className="bg-sage hover:bg-sage-hover text-cream px-6 py-5 text-xs font-medium rounded-full shadow-[0_4px_16px_rgba(46,90,68,0.2)]"
                >
                  <span>{tBook("cta")}</span>
                  <span>→</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right 5 Columns: Diagnostic Provocation Monolith */}
          <Card className="lg:col-span-5 bg-white border-[#E5DFD6] rounded-2xl p-7 sm:p-9 flex flex-col justify-between shadow-[0_8px_30px_rgba(46,90,68,0.04)] hover:-translate-y-1 transition-all duration-500">
            <CardContent className="p-0 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-sage" />
                  <Badge
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-[0.22em] text-sage border-sage/30 bg-sage/5 font-medium rounded-full"
                  >
                    {tCta("kicker")}
                  </Badge>
                </div>

                <MaskedHeading className="text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.2] text-charcoal">
                  {tCta("titlePrefix")}
                  <span className="font-serif italic font-normal text-sage">
                    {tCta("titleHighlight")}
                  </span>
                </MaskedHeading>

                <p className="text-sm sm:text-base text-[#5C6660] font-normal mt-4 leading-relaxed">
                  {tCta("description")}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5DFD6] flex flex-col gap-3">
                <Button
                  asChild
                  className="w-full bg-sage hover:bg-sage-hover text-cream py-6 text-xs font-medium rounded-full shadow-[0_4px_16px_rgba(46,90,68,0.25)]"
                >
                  <Link href="/test" className="flex items-center justify-center gap-2">
                    <span>{tCta("startTest")}</span>
                    <span>→</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleApply("Konsultatsiyaga yozilish")}
                  className="w-full bg-white hover:bg-[#F2EFE9] text-charcoal border-[#E5DFD6] py-6 text-xs font-medium rounded-full"
                >
                  <span>{ctaCommon("primary")}</span>
                  <span>→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
