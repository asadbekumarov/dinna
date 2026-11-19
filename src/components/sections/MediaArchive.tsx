"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { YouTubeModal } from "@/components/ui/YouTubeModal";
import { siteMedia, VideoItem } from "@/config/siteMedia";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface MediaArchiveProps {
  onOpenApply?: (options?: string | { service?: string }) => void;
}

interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  format: string;
  avatarText: string;
  timeAgo: string;
  highlight: string;
  message: string;
}

export function MediaArchive({}: MediaArchiveProps = {}) {
  const t = useTranslations("mediaArchive");

  const [activeTab, setActiveTab] = useState<string>("testimonials");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const testimonialsList: TestimonialItem[] = (t.raw("testimonials") as TestimonialItem[]) || [];
  const webinars = siteMedia.webinars;
  const events = siteMedia.events;

  const tabs = [
    { id: "testimonials", label: t("tabTestimonials"), count: testimonialsList.length },
    { id: "webinars", label: t("tabWebinars"), count: webinars.length },
    { id: "events", label: t("tabEvents"), count: events.length },
  ];

  return (
    <section
      id="natijalar"
      aria-label={t("sectionAria")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <MaskedHeading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-charcoal leading-[1.16]">
            {t("headingPrefix")}
            <span className="italic text-sage ml-1">
              {t("headingHighlight")}
            </span>
          </MaskedHeading>
        </div>

        {/* Tab Switcher (Horizontal scroll-snap on mobile, not sticky) */}
        <div className="mb-10 border-b border-border flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] px-4 rounded-full font-mono text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-sage text-cream shadow-sm font-semibold"
                    : "bg-cream-200 hover:bg-cream-300 text-charcoal-muted hover:text-charcoal border border-border"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-cream" : "bg-white text-charcoal-muted"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Testimonials (Mobile: Scroll-snap horizontal cards 80vw / Desktop: 2-3 Columns) */}
        {activeTab === "testimonials" && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible no-scrollbar">
            {testimonialsList.map((item) => (
              <article
                key={item.id}
                className="snap-center w-[80vw] max-w-[340px] shrink-0 sm:w-auto sm:shrink bg-white/80 border border-border rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between hover:border-sage/40 transition-colors"
              >
                <div>
                  {/* Top Quote & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-0.5 text-terracotta" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-charcoal-muted uppercase tracking-wider">
                      {item.format}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-medium text-charcoal leading-snug mb-2">
                    &ldquo;{item.highlight}&rdquo;
                  </h4>

                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-normal">
                    {item.message}
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 mt-6 border-t border-border flex items-center gap-3">
                  <Avatar className="w-9 h-9 border border-sage/20 bg-cream-200 text-sage font-mono text-xs">
                    <AvatarFallback>{item.avatarText}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="block font-medium text-xs text-charcoal">
                      {item.author}
                    </span>
                    <span className="block font-mono text-[10px] text-charcoal-muted">
                      {item.role} · {item.timeAgo}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Tab 2: Webinars & Video Content */}
        {activeTab === "webinars" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {webinars.map((vid, idx) => (
              <article
                key={vid.id || idx}
                role="button"
                tabIndex={0}
                onClick={() => setActiveVideo(vid)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveVideo(vid);
                  }
                }}
                className="group relative bg-white/80 border border-border hover:border-sage/40 p-4 rounded-2xl shadow-card cursor-pointer flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-cream-200 border border-border mb-3">
                    <Image
                      src={vid.thumb}
                      alt={vid.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-cream/90 text-sage flex items-center justify-center shadow-md">
                        ▶
                      </div>
                    </div>
                  </div>

                  <h4 className="font-serif text-base font-medium text-charcoal line-clamp-2 leading-snug group-hover:text-sage transition-colors">
                    {vid.title}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-border flex items-center justify-between font-mono text-xs text-charcoal-muted">
                  <span>{vid.duration || "Dars"}</span>
                  <span className="text-sage font-medium">Ko&apos;rish →</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Tab 3: Events & Business Tours */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((ev, idx) => (
              <article
                key={ev.id || idx}
                className="bg-white/80 border border-border rounded-2xl p-4 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-cream-200 border border-border mb-3">
                    <Image
                      src={ev.image}
                      alt={ev.city}
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] text-terracotta-dark font-semibold uppercase">
                      {ev.country}
                    </span>
                    <span className="font-mono text-xs text-charcoal-muted">
                      {ev.date}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-normal text-charcoal">
                    {ev.city}
                  </h4>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* YouTube Modal */}
      <YouTubeModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoId={activeVideo?.id ?? null}
        title={activeVideo?.title}
      />
    </section>
  );
}
