"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useApplyModal, type OpenApplyOptions } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { formatSectionKicker } from "@/config/sections";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ServiceItem {
  index: string;
  title: string;
  description: string;
}

interface ServicesProps {
  onOpenApply?: (options?: OpenApplyOptions) => void;
}

export function Services({ onOpenApply }: ServicesProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];

  const [activeTab, setActiveTab] = useState<string>("offline");

  const tabData = {
    offline: {
      badge: "Toshkent 5/5 · Shinam Kabinet",
      title: "Individual Psixologik Konsultatsiya",
      time: "60–90 daqiqa",
      icon: "🌿",
      forWhom: "Surunkali xavotir, ichki qo‘rquvlar, o‘zini yo‘qotish va hissiy charchoqni his qilayotganlar uchun.",
      highlights: [
        "Toshkent markazida xavfsiz va sokin muhit",
        "100% qat'iy psixologik konfidensiallik",
        "Hech qanday hukmsiz, to'liq empatiya bilan tinglash",
        "Birinchi uchrashuvdayoq amaliy yengillik",
      ],
      ctaText: "Kabinetga yozilish",
    },
    online: {
      badge: "Zoom / Telegram · Dunyo Bo‘ylab",
      title: "Xavfsiz Onlayn Terapiya",
      time: "60 daqiqa",
      icon: "🕊️",
      forWhom: "Boshqa shahar yoki xorijda yashovchi, o‘z uyi qulayligida terapiya olishni xohlovchilar uchun.",
      highlights: [
        "Istalgan davlatdan qulay vaqtda video yoki audio aloqa",
        "Sokin shaxsiy muhitda vaqt va yo'l xarajatlarisiz",
        "Yuqori sifatli va moslashuvchan seans jadvali",
        "Seansdan so'ng amaliy mashqlar va qo'llab-quvvatlash",
      ],
      ctaText: "Onlayn seansga yozilish",
    },
    training: {
      badge: "Guruh Dasturi · Transformatsiya",
      title: "Mualliflik Treninglari & Dasturlari",
      time: "Amaliy Kurs",
      icon: "✨",
      forWhom: "O‘ziga ishonchni mustahkamlash, hissiy chegaralarni qurish va shaxsiy o‘sishni istaganlar uchun.",
      highlights: [
        "Dinna Mirzabayevaning ko'p yillik amaliy tajribasi asosida",
        "Chuqur transformatsion psixologik texnikalar",
        "O'xshash maqsadli insonlar bilan iliq qo'llab-quvvatlash muhiti",
        "Hayotiy munosabatlar va ichki erkinlikni tiklash",
      ],
      ctaText: "Treningga ariza berish",
    },
  };

  return (
    <section
      id="xizmatlar"
      aria-label={t("title")}
      className="scroll-mt-20 py-16 sm:py-24 border-b border-[#E5DFD6] bg-cream text-charcoal relative overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[5%] top-1/3 w-[550px] h-[550px] bg-[#E8DFD1]/70 blur-3xl rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] bottom-1/4 w-[480px] h-[480px] bg-[#DCE5DF]/60 blur-3xl rounded-full"
      />

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <BotanicalMotif variant="leaf" className="w-5 h-5 text-[#C49A6C]" />
            <Badge
              variant="outline"
              className="font-mono text-xs uppercase tracking-[0.22em] text-sage border-sage/30 bg-sage/5 font-medium py-1 px-3.5 rounded-full"
            >
              {formatSectionKicker("services", t("kicker"))}
            </Badge>
          </div>

          <MaskedHeading className="text-3xl sm:text-5xl font-normal tracking-[-0.025em] leading-[1.16] text-charcoal">
            {t("titlePrefix")}
            <span className="font-serif italic font-normal text-sage">
              {t("titleHighlight")}
            </span>
          </MaskedHeading>

          <p className="text-base sm:text-lg text-[#5C6660] font-normal leading-[1.8] mt-5">
            {t("description")}
          </p>
        </div>

        {/* 1. Modern Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-14">
          {/* Bento Card 1: Large Featured Sanctuary Card (7 cols) */}
          <Card className="lg:col-span-7 relative flex flex-col justify-between bg-gradient-to-br from-white via-white to-[#F7F4EF] rounded-3xl border border-[#C59B6D]/40 p-8 sm:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_18px_45px_rgba(46,90,68,0.1)] hover:shadow-[0_22px_55px_rgba(46,90,68,0.15)] transition-all duration-500 group overflow-hidden">
            {/* Subtle Gold Hairline Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C59B6D]/20 via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-sage text-cream hover:bg-sage-hover font-mono text-[11px] font-medium tracking-wide rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-sm"
                >
                  <span>🌿</span>
                  <span>Oflayn · Toshkent 5/5 Shinam Muhit</span>
                </Badge>
                <span className="font-mono text-xs text-[#C59B6D] font-semibold tracking-wider">
                  60–90 daqiqa
                </span>
              </div>

              <span className="font-mono text-xs text-[#C59B6D] font-semibold tracking-widest block mb-2">
                01 · ASOSIY FORMAT
              </span>

              <CardTitle className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-charcoal leading-snug mb-4 group-hover:text-sage transition-colors">
                {items[0]?.title || "Individual Psixologik Konsultatsiya"}
              </CardTitle>

              <CardDescription className="text-sm sm:text-base text-[#5C6660] leading-relaxed mb-6">
                {items[0]?.description ||
                  "Toshkent markazidagi shinam va xavfsiz kabinetda Dinna Mirzabayeva bilan yakkama-yakka seans. Sizni tinglaydigan, tushunadigan va hukm qilmaydigan sokin muhit."}
              </CardDescription>

              {/* Tactical Feature Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-t border-[#E5DFD6]">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                  <span>100% Qat&apos;iy Konfidensiallik</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D]" />
                  <span>Shinam, sokin 5/5 kabinet</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                  <span>Ichki xavotir ildizini topish</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D]" />
                  <span>Shaxsiy amaliy harakat rejasi</span>
                </div>
              </div>
            </div>

            <CardFooter className="p-0 pt-6 border-t border-[#E5DFD6]">
              <Button
                type="button"
                onClick={() => handleApply({ service: items[0]?.title || "Individual Konsultatsiya" })}
                className="w-full sm:w-auto px-8 py-6 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide shadow-[0_6px_20px_rgba(46,90,68,0.25)] flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98]"
              >
                <span>Uchrashuvga yozilish</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Button>
            </CardFooter>
          </Card>

          {/* Bento Column 2: Right Stack (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
            {/* Bento Card 2: Online Therapy */}
            <Card className="flex-1 relative flex flex-col justify-between bg-white rounded-3xl border border-[#E5DFD6] p-7 sm:p-8 shadow-[0_6px_25px_rgba(46,90,68,0.05)] hover:shadow-[0_14px_35px_rgba(46,90,68,0.1)] hover:border-sage/30 transition-all duration-500 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-sage/10 text-sage font-mono text-[11px] font-medium rounded-full px-3 py-1 flex items-center gap-1.5"
                  >
                    <span>🕊️</span>
                    <span>Onlayn · Zoom & Telegram</span>
                  </Badge>
                  <span className="font-mono text-xs text-[#5C6660]">60 daqiqa</span>
                </div>

                <span className="font-mono text-xs text-[#C59B6D] font-semibold tracking-widest block mb-1">
                  02 · GLOBAL QULAYLIK
                </span>

                <CardTitle className="font-serif text-2xl font-normal text-charcoal mb-3 group-hover:text-sage transition-colors leading-snug">
                  {items[1]?.title || "Onlayn Psixologik Konsultatsiya"}
                </CardTitle>

                <CardDescription className="text-sm text-[#5C6660] leading-relaxed mb-6">
                  {items[1]?.description ||
                    "Istalgan davlatdan turib o‘z uyingiz qulayligida xavfsiz terapiya. Masofa ruhiy xotirjamlikka to‘siq bo‘la olmaydi."}
                </CardDescription>
              </div>

              <CardFooter className="p-0 pt-4 border-t border-[#E5DFD6] flex items-center justify-between">
                <span className="font-mono text-xs text-[#5C6660]">Dunyo bo‘ylab qabul</span>
                <Button
                  variant="ghost"
                  onClick={() => handleApply({ service: items[1]?.title || "Onlayn Terapiya" })}
                  className="text-xs font-semibold text-sage hover:text-sage-hover hover:bg-[#F2EFE9] rounded-full p-2 h-auto"
                >
                  Yozilish →
                </Button>
              </CardFooter>
            </Card>

            {/* Bento Card 3: Authorship Group Training */}
            <Card className="flex-1 relative flex flex-col justify-between bg-white rounded-3xl border border-[#E5DFD6] p-7 sm:p-8 shadow-[0_6px_25px_rgba(46,90,68,0.05)] hover:shadow-[0_14px_35px_rgba(46,90,68,0.1)] hover:border-sage/30 transition-all duration-500 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-[#C59B6D]/15 text-[#C59B6D] font-mono text-[11px] font-medium rounded-full px-3 py-1 flex items-center gap-1.5"
                  >
                    <span>✨</span>
                    <span>Guruh Transformatsiyasi</span>
                  </Badge>
                  <span className="font-mono text-xs text-[#5C6660]">Amaliy Kurs</span>
                </div>

                <span className="font-mono text-xs text-[#C59B6D] font-semibold tracking-widest block mb-1">
                  03 · MUALLIFLIK DASTURI
                </span>

                <CardTitle className="font-serif text-2xl font-normal text-charcoal mb-3 group-hover:text-sage transition-colors leading-snug">
                  {items[2]?.title || "Mualliflik Treninglari & Shaxsiy Rivojlanish"}
                </CardTitle>

                <CardDescription className="text-sm text-[#5C6660] leading-relaxed mb-6">
                  {items[2]?.description ||
                    "Shaxsiy chegaralarni qurish, ichki o‘zlikni qabul qilish va sog‘lom munosabatlar o‘rnatish bo‘yicha chuqur amaliy dastur."}
                </CardDescription>
              </div>

              <CardFooter className="p-0 pt-4 border-t border-[#E5DFD6] flex items-center justify-between">
                <span className="font-mono text-xs text-[#5C6660]">Guruhda ishlash</span>
                <Button
                  variant="ghost"
                  onClick={() => handleApply({ service: items[2]?.title || "Mualliflik Treningi" })}
                  className="text-xs font-semibold text-sage hover:text-sage-hover hover:bg-[#F2EFE9] rounded-full p-2 h-auto"
                >
                  Ariza qoldirish →
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* 2. Interactive Service Explorer (shadcn/ui Tabs) */}
        <div className="bg-white/80 backdrop-blur-md border border-[#E5DFD6] rounded-3xl p-6 sm:p-10 shadow-[0_10px_35px_rgba(46,90,68,0.06)]">
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C59B6D] font-semibold block mb-2">
              INTERAKTIV TAQQOSLASH
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
              Qaysi format sizga eng ma&apos;qul?
            </h3>
            <p className="text-sm text-[#5C6660] mt-1.5">
              O&apos;zingizga qulay formatni tanlang va barcha tafsilotlarni bir qarashda bilib oling.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 bg-[#F2EFE9] p-1.5 rounded-full max-w-xl mb-8 border border-[#E5DFD6]">
              <TabsTrigger
                value="offline"
                className="rounded-full text-xs font-medium py-2.5 data-[state=active]:bg-sage data-[state=active]:text-cream transition-all"
              >
                🌿 Toshkent 5/5
              </TabsTrigger>
              <TabsTrigger
                value="online"
                className="rounded-full text-xs font-medium py-2.5 data-[state=active]:bg-sage data-[state=active]:text-cream transition-all"
              >
                🕊️ Onlayn
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="rounded-full text-xs font-medium py-2.5 data-[state=active]:bg-sage data-[state=active]:text-cream transition-all"
              >
                ✨ Trening
              </TabsTrigger>
            </TabsList>

            {(Object.keys(tabData) as Array<keyof typeof tabData>).map((key) => {
              const data = tabData[key];
              return (
                <TabsContent key={key} value={key} className="focus-visible:outline-none">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-cream p-6 sm:p-8 rounded-2xl border border-[#E5DFD6]">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono border-sage/30 text-sage bg-white rounded-full">
                          {data.badge}
                        </Badge>
                        <span className="font-mono text-xs text-[#5C6660]">·</span>
                        <span className="font-mono text-xs text-[#5C6660]">{data.time}</span>
                      </div>

                      <h4 className="font-serif text-2xl sm:text-3xl text-charcoal">
                        {data.title}
                      </h4>

                      <p className="text-sm sm:text-base text-[#5C6660] leading-relaxed">
                        {data.forWhom}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {data.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-charcoal">
                            <span className="w-5 h-5 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs shrink-0 font-bold">
                              ✓
                            </span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-3 justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E5DFD6] lg:pl-8">
                      <Button
                        onClick={() => handleApply({ service: data.title })}
                        className="w-full py-6 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide shadow-[0_6px_20px_rgba(46,90,68,0.25)] text-center cursor-pointer active:scale-[0.98]"
                      >
                        {data.ctaText} →
                      </Button>
                      <div className="p-3 bg-white border border-[#E5DFD6] rounded-xl text-center">
                        <span className="text-xs text-[#5C6660]">
                          🔒 100% maxfiylik kafolatlangan
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        {/* 3. Free Diagnostic Banner */}
        <Card className="mt-12 sm:mt-16 bg-white border border-[#E5DFD6] rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(46,90,68,0.06)] relative overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-sage" />
                  <Badge
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-wider text-sage border-sage/30 bg-sage/5 font-medium rounded-full"
                  >
                    {t("diagKicker")}
                  </Badge>
                  <span className="text-[#5C6660] font-mono text-xs">·</span>
                  <span className="font-mono text-xs text-[#5C6660]">
                    {t("diagTime")}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
                  {t("diagTitle")}
                </h3>
                <p className="text-sm sm:text-base text-[#5C6660] leading-relaxed max-w-2xl">
                  {t("diagDesc")}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Button
                  onClick={() => handleApply({ service: t("diagServiceApplyName") })}
                  className="w-full py-6 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide transition-all shadow-[0_6px_20px_rgba(46,90,68,0.25)] text-center cursor-pointer active:scale-[0.98]"
                >
                  {t("diagCta")} →
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full py-6 rounded-full bg-cream hover:bg-[#F2EFE9] border border-sage/30 text-sage hover:text-sage-hover text-xs font-medium tracking-wide transition-all text-center active:scale-[0.98]"
                >
                  <Link href="/test">
                    3 daqiqalik testdan o&apos;tish
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delicate Botanical Divider */}
        <BotanicalMotif variant="divider" className="mt-14" />
      </div>
    </section>
  );
}
