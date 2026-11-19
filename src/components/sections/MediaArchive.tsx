"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { YouTubeModal } from "@/components/ui/YouTubeModal";
import { siteMedia, VideoItem } from "@/config/siteMedia";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { formatSectionKicker } from "@/config/sections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EASE_SWISS = [0.16, 1, 0.3, 1] as const;

interface MediaArchiveProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

interface PsychologyTestimonial {
  id: string;
  author: string;
  role: string;
  format: string;
  avatarText: string;
  timeAgo: string;
  highlight: string;
  message: string;
}

const PSYCHOLOGY_TESTIMONIALS: PsychologyTestimonial[] = [
  {
    id: "test-1",
    author: "M.A.",
    role: "29 yosh",
    format: "Toshkent 5/5 oflayn",
    avatarText: "MA",
    timeAgo: "Yaqinda",
    highlight: "Surunkali xavotirdan xalos bo'ldim",
    message:
      "Dinna xonim bilan uchrashuvlardan so'ng ko'p yillik surunkali xavotir va ichki qo'rquvlarimdan xalos bo'ldim. 5/5 ofisidagi muhit juda iliq va xavfsiz. O'zimni nihoyat qabul qilishni va xotirjam nafas olishni o'rgandim.",
  },
  {
    id: "test-2",
    author: "D.K.",
    role: "34 yosh",
    format: "Onlayn (Zoom)",
    avatarText: "DK",
    timeAgo: "1 hafta oldin",
    highlight: "Har bir seansdan keyin yengillik",
    message:
      "Onlayn formatda shunday chuqur empatiya va ishonchni his qilaman deb o'ylamagandim. Har bir seansdan keyin yelkamdan og'ir yuk tushgandek yengillik his qilaman. Rahmat sizga!",
  },
  {
    id: "test-3",
    author: "S.R.",
    role: "26 yosh",
    format: "Mualliflik treningi",
    avatarText: "SR",
    timeAgo: "2 hafta oldin",
    highlight: "Munosabatlarga qarashim o'zgardi",
    message:
      "Mualliflik treningingiz mening munosabatlarga va eng muhimi o'zimga bo'lgan qarashimni butkul o'zgartirdi. Hissiy chegaralarimni xotirjam va chiroyli himoya qilishni boshladim.",
  },
  {
    id: "test-4",
    author: "N.T.",
    role: "31 yosh",
    format: "Toshkent 5/5 oflayn",
    avatarText: "NT",
    timeAgo: "Yaqinda",
    highlight: "Hissiy charchoq (burnout)ni yengdim",
    message:
      "Hissiy charchoq (burnout) va depressiv holatdan chiqishimda bergan amaliy mashqlaringiz va qo'llab-quvvatlovingiz beqiyos bo'ldi. Endi hayotimga ranglar va xotirjamlik qaytdi.",
  },
  {
    id: "test-5",
    author: "G.B.",
    role: "38 yosh",
    format: "Onlayn konsultatsiya",
    avatarText: "GB",
    timeAgo: "1 oy oldin",
    highlight: "Ichki tayanchimni topdim",
    message:
      "Oilaviy inqiroz paytida o'zimni yo'qotib qo'ygandim. Dinna xonim menga o'z ichki tayanchimni topishga va oqilona, xotirjam qaror qabul qilishga ko'maklashdilar.",
  },
  {
    id: "test-6",
    author: "Z.M.",
    role: "24 yosh",
    format: "Shaxsiy rivojlanish kursi",
    avatarText: "ZM",
    timeAgo: "1 oy oldin",
    highlight: "O'zimga bo'lgan mehr qaytdi",
    message:
      "O'z-o'zimni tinimsiz tanqid qilish odatim yo'qoldi. O'rniga xotirjamlik va o'zimga mehr keldi. Bu hayotimdagi eng to'g'ri qadam bo'ldi.",
  },
];

export function MediaArchive({ onOpenApply }: MediaArchiveProps) {
  const { openApply } = useApplyModal();
  const handleApply = onOpenApply || openApply;

  const tArchive = useTranslations("mediaArchive");

  const [activeTab, setActiveTab] = useState<"testimonials" | "webinars" | "events">("testimonials");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#fikrlar" || hash === "#natijalar") {
      setActiveTab("testimonials");
    } else if (hash === "#vebinarlar" || hash === "#darslar") {
      setActiveTab("webinars");
    } else if (hash === "#tadbirlarimiz" || hash === "#tadbirlar") {
      setActiveTab("events");
    }
  }, []);

  const tabs = [
    {
      id: "testimonials" as const,
      index: "01",
      label: tArchive("tabTestimonials"),
      count: PSYCHOLOGY_TESTIMONIALS.length,
    },
    {
      id: "webinars" as const,
      index: "02",
      label: tArchive("tabWebinars"),
      count: siteMedia.webinars.length,
    },
    {
      id: "events" as const,
      index: "03",
      label: tArchive("tabEvents"),
      count: siteMedia.events.length,
    },
  ];

  return (
    <section
      id="natijalar"
      aria-label={tArchive("sectionAria")}
      className="scroll-mt-20 py-16 sm:py-24 border-b border-[#E5E0D8] bg-cream text-charcoal relative overflow-hidden"
    >
      <span id="tadbirlarimiz" className="absolute -top-20 pointer-events-none" />
      <span id="tadbirlar" className="absolute -top-20 pointer-events-none" />
      <span id="fikrlar" className="absolute -top-20 pointer-events-none" />
      <span id="vebinarlar" className="absolute -top-20 pointer-events-none" />

      {/* Header Row */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-sage rounded-full" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-sage font-medium">
                {formatSectionKicker("media", tArchive("kicker"))}
              </span>
            </div>

            <MaskedHeading className="text-3xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.18] text-charcoal mt-4">
              {tArchive("headingPrefix")}
              <span className="font-serif italic font-normal text-sage">
                {tArchive("headingHighlight")}
              </span>
            </MaskedHeading>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 border-b border-[#E5E0D8] flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group relative pb-4 px-3 text-left font-mono text-xs tracking-wider uppercase transition-colors shrink-0 cursor-pointer flex items-center gap-2.5 ${
                  isActive ? "text-sage font-semibold" : "text-[#5C6660] hover:text-charcoal"
                }`}
              >
                <span className={isActive ? "text-sage" : "text-[#5C6660]"}>
                  /{tab.index}
                </span>
                <span className="font-sans font-medium text-xs sm:text-sm tracking-wide">
                  {tab.label}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                    isActive
                      ? "bg-sage text-cream font-semibold"
                      : "bg-[#F2EFE9] text-[#5C6660]"
                  }`}
                >
                  {tab.count}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mediaHubActiveIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-sage rounded-full"
                    transition={{ duration: 0.35, ease: EASE_SWISS }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panes */}
      <AnimatePresence mode="wait">
        {/* Tab 1: Anonymous Client Testimonials Styled as Calm Message Cards */}
        {activeTab === "testimonials" && (
          <motion.div
            key="tab-testimonials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE_SWISS }}
            className="max-w-[1360px] mx-auto px-6 md:px-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {PSYCHOLOGY_TESTIMONIALS.map((tItem) => (
                <Card
                  key={tItem.id}
                  className="bg-white border border-[#E5DFD6] rounded-2xl p-6 sm:p-7 shadow-[0_6px_25px_rgba(46,90,68,0.04)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(46,90,68,0.09)] transition-all duration-500 flex flex-col justify-between"
                >
                  <CardContent className="p-0">
                    <div>
                      {/* Message Header */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-[#E5DFD6]">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-sage/20">
                            <AvatarFallback className="bg-sage/10 text-sage font-semibold font-mono text-xs">
                              {tItem.avatarText}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-sm text-charcoal">
                              {tItem.author}
                            </h4>
                            <p className="text-xs text-[#5C6660]">
                              {tItem.role}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-[#F2EFE9] text-sage hover:bg-[#EAE5DC] text-[11px] font-mono rounded-full px-2.5 py-0.5">
                          {tItem.format}
                        </Badge>
                      </div>

                      {/* Star Rating & Highlight */}
                      <div className="flex items-center gap-1 text-[#C59B6D] text-xs mb-2">
                        {"★★★★★"}
                        <span className="text-[11px] font-mono text-[#5C6660] ml-2">
                          {tItem.timeAgo}
                        </span>
                      </div>

                      <h5 className="font-serif italic text-base text-charcoal font-medium mb-3">
                        &ldquo;{tItem.highlight}&rdquo;
                      </h5>

                      {/* Calm Message Body */}
                      <p className="text-sm text-[#5C6660] leading-relaxed font-normal">
                        {tItem.message}
                      </p>
                    </div>

                    {/* Privacy Reassurance Footnote */}
                    <div className="mt-5 pt-3 border-t border-[#E5DFD6] flex items-center justify-between text-[11px] font-mono text-[#5C6660]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                        Tasdiqlangan mijoz natijasi
                      </span>
                      <span>100% Maxfiy</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 2: Guidance Insights */}
        {activeTab === "webinars" && (
          <motion.div
            key="tab-webinars"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE_SWISS }}
            className="max-w-[1360px] mx-auto px-6 md:px-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {siteMedia.webinars.map((vid, idx) => {
                const indexNum = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
                return (
                  <article
                    key={vid.id === "REPLACE_ME" ? `webinar-${idx}` : vid.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedVideo(vid)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedVideo(vid);
                      }
                    }}
                    className="border border-[#E5E0D8] bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-[0_6px_25px_rgba(46,90,68,0.04)] hover:shadow-[0_12px_35px_rgba(46,90,68,0.08)] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-video w-full relative overflow-hidden bg-[#F2EFE9]">
                      <Image
                        src={vid.thumb}
                        alt={vid.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover w-full h-full group-hover:scale-[1.03] transition-all duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-cream/90 rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-sage border border-[#E5E0D8]">
                        <span>Tavsiya / {indexNum}</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1">
                      <h3 className="text-base font-medium text-charcoal leading-snug line-clamp-2 group-hover:text-sage transition-colors">
                        {vid.title}
                      </h3>
                      <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between font-mono text-xs text-sage font-medium">
                        <span>Ko&apos;rish</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Workshops & Trainings */}
        {activeTab === "events" && (
          <motion.div
            key="tab-events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE_SWISS }}
            className="max-w-[1360px] mx-auto px-6 md:px-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {siteMedia.events.map((evt) => (
                <article
                  key={evt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleApply({ service: `${evt.city} mualliflik treningi` })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleApply({ service: `${evt.city} mualliflik treningi` });
                    }
                  }}
                  className="group relative bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_35px_rgba(46,90,68,0.08)] cursor-pointer"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EFE9] rounded-xl mb-4">
                    <Image
                      src={evt.image}
                      alt={evt.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-cover w-full h-full group-hover:scale-[1.04] transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-3 font-serif italic text-2xl text-cream pointer-events-none z-10">
                      {evt.city}
                    </span>
                  </div>

                  <div className="pt-2 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-charcoal tracking-tight truncate max-w-[180px]">
                        {evt.title}
                      </h3>
                      <span className="text-xs text-[#5C6660] mt-0.5 block">
                        {evt.date}
                      </span>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider text-sage font-semibold shrink-0">
                      Yozilish →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <YouTubeModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo?.id || null}
        title={selectedVideo?.title}
      />
    </section>
  );
}
