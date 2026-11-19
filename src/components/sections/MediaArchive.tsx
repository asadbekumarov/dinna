"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { siteMedia } from "@/config/siteMedia";
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
  timeAgo?: string;
  highlight: string;
  message: string;
}

export function MediaArchive({}: MediaArchiveProps = {}) {
  const t = useTranslations("mediaArchive");

  const [activeTab, setActiveTab] = useState<string>("testimonials");

  const testimonialsList: TestimonialItem[] = (t.raw("testimonials") as TestimonialItem[]) || [];
  const reelsList = siteMedia.reels;

  const tabs = [
    { id: "testimonials", label: t("tabTestimonials"), count: testimonialsList.length },
    { id: "reels", label: t("tabWebinars"), count: reelsList.length },
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
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Tab 2: Authentic Instagram Reels (9:16 Portrait Cards) */}
        {activeTab === "reels" && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible no-scrollbar">
            {reelsList.map((reel) => (
              <a
                key={reel.id}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${reel.title} - ${t("watchOnInstagram")}`}
                className="group relative snap-center w-[75vw] max-w-[280px] shrink-0 sm:w-auto sm:shrink aspect-[9/16] rounded-2xl overflow-hidden border border-border bg-charcoal shadow-card hover:border-sage/60 hover:shadow-xl transition-all flex flex-col justify-between p-5"
              >
                {/* Background Image */}
                <Image
                  src={reel.thumb}
                  alt={reel.title}
                  fill
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-charcoal/20 group-hover:from-charcoal/90 transition-colors" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider border border-white/20">
                    {reel.category}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/20 group-hover:bg-sage group-hover:border-sage transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </span>
                </div>

                {/* Center Play Icon */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-sage group-hover:border-sage transition-all duration-300">
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Title & Action */}
                <div className="relative z-10 pt-4">
                  <h4 className="font-serif text-base sm:text-lg font-medium text-white leading-snug line-clamp-3 mb-2 drop-shadow-sm">
                    {reel.title}
                  </h4>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-white/80 group-hover:text-cream tracking-wide">
                    {t("watchOnInstagram")} &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
