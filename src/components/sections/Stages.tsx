"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StagesProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

const EASE_SWISS = [0.16, 1, 0.3, 1] as const;

export function Stages({ onOpenApply }: StagesProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const ctaT = useTranslations("cta");

  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: "01",
      tag: "1-QADAM · TAYYORGARLIK",
      title: "Qisqa diagnostika yoki ariza",
      time: "2 daqiqa",
      shortDesc: "2 daqiqada qulay vaqtni tanlash va o'zingizga qulay formatni belgilash.",
      fullDesc:
        "Sizdan hech qanday maxsus bilim yoki murakkab tayyorgarlik talab etilmaydi. Saytimizdagi 3 daqiqalik muloyim holat diagnostikasidan o'tishingiz yoki to'g'ridan-to'g'ri o'zingizga ma'qul uchrashuv vaqtini belgilab ariza qoldirishingiz kifoya.",
      highlights: [
        "2 daqiqada qulay sana va soatni tanlash",
        "Toshkent 5/5 oflayn yoki onlayn (Zoom/Telegram)",
        "Shaxsiy istaklar va xavotirlarni oldindan belgilash",
      ],
      icon: "🌱",
    },
    {
      num: "02",
      tag: "2-QADAM · SEANS",
      title: "Xavfsiz va maxfiy suhbat",
      time: "60–90 daqiqa",
      shortDesc: "Toshkentda 5/5 oflayn kabinetda yoki onlayn video-aloqada.",
      fullDesc:
        "Toshkent markazidagi (5/5 manzili) sokin, xavfsiz va shinam kabinetda yoki uyingizdagi qulay muhitda video-seans. Dinna Mirzabayeva sizni hech qanday hukmsiz, tanqidsiz, to'liq empatiya bilan tinglaydi. Aytilgan barcha ma'lumotlar 100% maxfiy qoladi.",
      highlights: [
        "100% qat'iy psixologik konfidensiallik",
        "Hech qanday hukmsiz va erkin qabul muhiti",
        "Ichki og'riqlar, stress va xavotir ildizini topish",
      ],
      icon: "🕊️",
    },
    {
      num: "03",
      tag: "3-QADAM · NATIJA",
      title: "Aniq ichki yechim va qo'llab-quvvatlash",
      time: "Barqaror ta'sir",
      shortDesc: "Birinchi seansdayoq yengillik va shaxsiy harakat rejasi.",
      fullDesc:
        "Vaqtinchalik motivatsiya emas, balki butun umrga xizmat qiluvchi ichki yengillik. Birinchi uchrashuvdayoq yelkangizdagi og'irlik kamayganini sezasiz va kundalik hayotda xotirjamlikni saqlash bo'yicha amaliy tavsiyalarga ega bo'lasiz.",
      highlights: [
        "Birinchi seansdayoq his etiladigan ruhiy yengillik",
        "Shaxsiy tiklanish va hissiy muvozanat rejasi",
        "Zaruriyat tug'ilganda doimiy professional hamrohlik",
      ],
      icon: "✨",
    },
  ];

  return (
    <section
      id="bosqichlar"
      aria-label="Konsultatsiya qanday o'tadi"
      className="scroll-mt-20 py-16 sm:py-24 border-b border-[#E5DFD6] bg-cream text-charcoal relative overflow-hidden"
    >
      {/* Slow-drifting ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-1/4 w-[500px] h-[500px] bg-[#E8DFD1]/60 blur-3xl rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] bottom-1/4 w-[450px] h-[450px] bg-[#DCE5DF]/50 blur-3xl rounded-full"
      />

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <BotanicalMotif variant="leaf" className="w-5 h-5 text-[#C49A6C]" />
            <Badge
              variant="outline"
              className="font-mono text-xs uppercase tracking-[0.22em] text-sage border-sage/30 bg-sage/5 font-medium py-1 px-3 rounded-full"
            >
              SEANS QANDAY O&apos;TADI?
            </Badge>
          </div>

          <MaskedHeading className="text-3xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.18] text-charcoal">
            Ichki xotirjamlikka olib boruvchi{" "}
            <span className="font-serif italic font-normal text-sage">
              3 ta qadam.
            </span>
          </MaskedHeading>

          <p className="text-base sm:text-lg text-[#5C6660] font-normal leading-relaxed mt-5">
            Har bir bosqich sizning xavfsizligingiz, konfidensialligingiz va ruhiy qulayligingiz uchun o&apos;ylangan.
          </p>
        </div>

        {/* 3-Step Process Grid with shadcn/ui Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;

            return (
              <Card
                key={step.num}
                onClick={() => setActiveStep(idx)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveStep(idx);
                  }
                }}
                className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-2xl border transition-all duration-500 cursor-pointer select-none group hover:-translate-y-1 ${
                  isSelected
                    ? "bg-white border-sage shadow-[0_14px_40px_rgba(46,90,68,0.12)] ring-1 ring-sage/20"
                    : "bg-white/90 border-[#E5DFD6] shadow-[0_6px_25px_rgba(46,90,68,0.04)] hover:border-sage/40 hover:bg-white"
                }`}
              >
                <CardContent className="p-0">
                  <div>
                    {/* Step Top Meta Row */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className="font-serif text-3xl font-light text-[#C49A6C]">
                        {step.num}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-cream border border-[#E5DFD6] text-[#5C6660] font-mono text-xs rounded-full px-3 py-1 flex items-center gap-1.5"
                      >
                        <span>{step.icon}</span>
                        <span>{step.time}</span>
                      </Badge>
                    </div>

                    {/* Kicker Tag */}
                    <span className="font-mono text-[11px] text-sage font-medium tracking-wider block mb-2">
                      {step.tag}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif text-2xl font-normal text-charcoal mb-3 group-hover:text-sage transition-colors leading-snug">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#5C6660] leading-relaxed mb-6">
                      {step.shortDesc}
                    </p>
                  </div>

                  {/* Bottom Step Indicator */}
                  <div className="pt-4 border-t border-[#E5DFD6] flex items-center justify-between text-xs font-mono">
                    <span
                      className={`font-medium transition-colors ${
                        isSelected ? "text-sage" : "text-[#5C6660] group-hover:text-charcoal"
                      }`}
                    >
                      {isSelected ? "Tanlangan bosqich" : "Batafsil ko'rish"}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-sage text-cream"
                          : "bg-[#F2EFE9] text-[#5C6660] group-hover:bg-[#EAE5DC]"
                      }`}
                    >
                      →
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Details Card (shadcn Card) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE_SWISS }}
          >
            <Card className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5DFD6] shadow-[0_12px_40px_rgba(46,90,68,0.07)]">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                      <Badge
                        variant="outline"
                        className="font-mono text-xs text-sage border-sage/30 bg-sage/5 font-medium uppercase tracking-wider rounded-full"
                      >
                        {steps[activeStep].tag}
                      </Badge>
                    </div>

                    <h4 className="font-serif text-2xl sm:text-3xl text-charcoal">
                      {steps[activeStep].title}
                    </h4>

                    <p className="text-sm sm:text-base text-[#5C6660] leading-relaxed">
                      {steps[activeStep].fullDesc}
                    </p>

                    {/* Highlights List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {steps[activeStep].highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="text-sm text-charcoal leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="lg:col-span-4 flex flex-col gap-3 justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E5DFD6] lg:pl-8">
                    <Button
                      onClick={() =>
                        handleApply({
                          service: steps[activeStep].title,
                        })
                      }
                      className="w-full py-6 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide transition-all shadow-[0_6px_20px_rgba(46,90,68,0.25)] text-center cursor-pointer active:scale-[0.98]"
                    >
                      {ctaT("primary")} →
                    </Button>

                    <div className="p-3.5 bg-cream border border-[#E5DFD6] rounded-xl text-center">
                      <span className="text-xs text-[#5C6660]">
                        🔒 Har qanday uchrashuv 100% maxfiy va xavfsiz.
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Botanical Divider */}
        <BotanicalMotif variant="divider" className="mt-14" />
      </div>
    </section>
  );
}
