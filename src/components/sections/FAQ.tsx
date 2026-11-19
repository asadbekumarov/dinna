"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
import { formatSectionKicker } from "@/config/sections";
import { FAQSkeleton } from "@/components/ui/skeletons";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export { FAQSkeleton };

export interface FAQProps {
  isLoading?: boolean;
}

type CategoryKey = "all" | "systematization" | "consulting" | "mentorship" | "guarantees";

interface FAQItem {
  id: string;
  category: "systematization" | "consulting" | "mentorship" | "guarantees";
  question: string;
  answer: string;
}

export function FAQ({ isLoading = false }: FAQProps = {}) {
  const t = useTranslations("faq");
  const locale = useLocale();
  const isUz = locale === "uz";
  const isRu = locale === "ru";
  const { openApply } = useApplyModal();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

  // Raw items from translation
  const rawItems = useMemo<FAQItem[]>(() => {
    return [
      {
        id: "q1",
        category: "systematization",
        question: t("items.0.question"),
        answer: t("items.0.answer"),
      },
      {
        id: "q2",
        category: "systematization",
        question: t("items.1.question"),
        answer: t("items.1.answer"),
      },
      {
        id: "q3",
        category: "consulting",
        question: t("items.2.question"),
        answer: t("items.2.answer"),
      },
      {
        id: "q4",
        category: "consulting",
        question: t("items.3.question"),
        answer: t("items.3.answer"),
      },
      {
        id: "q5",
        category: "mentorship",
        question: t("items.4.question"),
        answer: t("items.4.answer"),
      },
      {
        id: "q6",
        category: "mentorship",
        question: t("items.5.question"),
        answer: t("items.5.answer"),
      },
      {
        id: "q7",
        category: "guarantees",
        question: t("items.6.question"),
        answer: t("items.6.answer"),
      },
      {
        id: "q8",
        category: "guarantees",
        question: t("items.7.question"),
        answer: t("items.7.answer"),
      },
    ];
  }, [t]);

  // Dynamic search & category filtering
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rawItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;
      const qMatch = item.question.toLowerCase().includes(query);
      const aMatch = item.answer.toLowerCase().includes(query);
      return qMatch || aMatch;
    });
  }, [rawItems, searchQuery, selectedCategory]);

  const handleCategoryClick = (cat: CategoryKey) => {
    setSelectedCategory((prev) => (prev === cat ? "all" : cat));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      systematization: 0,
      consulting: 0,
      mentorship: 0,
      guarantees: 0,
    };
    rawItems.forEach((item) => {
      if (item.category && item.category in counts) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [rawItems]);

  if (isLoading) {
    return <FAQSkeleton />;
  }

  const formatCount = (count: number) => {
    if (isUz) return `${count} ta javob`;
    if (isRu) return `${count} ответов`;
    return `${count} answers`;
  };

  const categories = [
    {
      key: "systematization" as CategoryKey,
      title: t("categories.systematization.title"),
      count: formatCount(categoryCounts.systematization || 0),
      countNum: categoryCounts.systematization || 0,
      icon: "💬",
    },
    {
      key: "consulting" as CategoryKey,
      title: t("categories.consulting.title"),
      count: formatCount(categoryCounts.consulting || 0),
      countNum: categoryCounts.consulting || 0,
      icon: "📍",
    },
    {
      key: "mentorship" as CategoryKey,
      title: t("categories.mentorship.title"),
      count: formatCount(categoryCounts.mentorship || 0),
      countNum: categoryCounts.mentorship || 0,
      icon: "🔒",
    },
    {
      key: "guarantees" as CategoryKey,
      title: t("categories.guarantees.title"),
      count: formatCount(categoryCounts.guarantees || 0),
      countNum: categoryCounts.guarantees || 0,
      icon: "✨",
    },
  ];

  return (
    <section
      id="faq"
      className="relative w-full bg-cream text-charcoal py-16 sm:py-24 overflow-hidden border-t border-[#E5DFD6]"
    >
      {/* Organic Background Depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[5%] top-1/4 w-[500px] h-[500px] rounded-full bg-[#E8DFD1]/60 blur-3xl"
        />
        <div
          className="absolute right-[5%] bottom-1/4 w-[480px] h-[480px] rounded-full bg-[#DCE5DF]/55 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-[1224px] mx-auto px-5 sm:px-8">
        {/* HERO AREA */}
        <div className="flex flex-col items-center text-center max-w-[860px] mx-auto">
          <div className="flex items-center justify-center gap-3">
            <BotanicalMotif variant="leaf" className="w-5 h-5 text-[#C49A6C]" />
            <Badge
              variant="outline"
              className="font-mono text-xs uppercase tracking-[0.22em] text-sage border-sage/30 bg-sage/5 font-medium py-1 px-3 rounded-full"
            >
              {formatSectionKicker("faq", t("kicker"))}
            </Badge>
            <BotanicalMotif variant="leaf" className="w-5 h-5 text-[#C49A6C] -scale-x-100" />
          </div>

          <h2 className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal tracking-tight leading-[1.2]">
            {isUz ? t("headlineUz") : t("headline")}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#5C6660] font-normal leading-relaxed max-w-[680px]">
            {t("lede")}
          </p>
        </div>

        {/* SEARCH BAR (shadcn Input) */}
        <div className="mt-10 sm:mt-12 max-w-[860px] mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 sm:pl-6 flex items-center pointer-events-none z-10 text-[#5C6660]">
              <svg
                className="w-5 h-5 text-sage"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="w-full h-[54px] sm:h-[60px] pl-[52px] sm:pl-[60px] pr-12 rounded-full bg-white text-charcoal placeholder:text-[#5C6660]/70 text-sm sm:text-base border-[#E5DFD6] focus:border-sage focus:ring-2 focus:ring-sage/20 shadow-[0_4px_20px_rgba(46,90,68,0.04)]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label={t("clearSearch")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#5C6660] hover:text-charcoal transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#F2EFE9] flex items-center justify-center text-xs">
                  ✕
                </div>
              </button>
            )}
          </div>
        </div>

        {/* CATEGORIES with shadcn Card */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <Card
                key={cat.key}
                role="button"
                tabIndex={0}
                onClick={() => handleCategoryClick(cat.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryClick(cat.key);
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? "bg-white border-sage shadow-[0_6px_20px_rgba(46,90,68,0.08)] scale-[1.01]"
                    : "bg-white/80 border-[#E5DFD6] hover:bg-white hover:border-sage/30"
                }`}
              >
                <CardContent className="p-0 flex items-center gap-3.5 w-full">
                  <span className="text-2xl shrink-0">{cat.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className={`text-sm font-medium block truncate ${isSelected ? "text-sage" : "text-charcoal"}`}>
                      {cat.title}
                    </span>
                    <span className="text-xs font-mono text-[#5C6660] mt-0.5 block">
                      {cat.count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ACTIVE FILTER STATUS */}
        {(selectedCategory !== "all" || searchQuery) && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-sm text-[#5C6660]">
              {filteredItems.length} {isUz ? "ta savol ko'rsatilmoqda" : "questions found"}
            </span>
            <Button
              variant="link"
              onClick={clearFilters}
              className="text-sm text-sage hover:underline p-0 h-auto font-medium"
            >
              {t("clearSearch")}
            </Button>
          </div>
        )}

        {/* ACCORDION (Official shadcn/ui Accordion) */}
        <div className="mt-10">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-white border border-[#E5DFD6]">
              <p className="text-base text-[#5C6660]">
                {t("noResults")}
              </p>
              <Button
                onClick={clearFilters}
                className="mt-4 rounded-full bg-sage text-cream text-xs font-medium hover:bg-sage-hover transition-all"
              >
                {t("clearSearch")}
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible defaultValue="q1" className="space-y-4">
              {filteredItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="rounded-2xl bg-white border border-[#E5DFD6] shadow-[0_4px_16px_rgba(46,90,68,0.03)] hover:border-sage/30 hover:shadow-[0_8px_25px_rgba(46,90,68,0.06)] data-[state=open]:border-sage/40 data-[state=open]:shadow-[0_12px_35px_rgba(46,90,68,0.08)] px-6 overflow-hidden transition-all duration-300"
                >
                  <AccordionTrigger className="py-5 sm:py-6 text-base sm:text-lg font-medium text-charcoal hover:text-sage hover:no-underline text-left leading-snug">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm sm:text-base leading-relaxed text-[#5C6660] border-t border-[#E5DFD6]/60 pt-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* BOTTOM CALLOUT with shadcn Card */}
        <Card className="mt-14 p-7 sm:p-8 rounded-2xl bg-[#F2EFE9] border border-[#E5DFD6] shadow-[0_4px_20px_rgba(46,90,68,0.04)]">
          <CardContent className="p-0 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-serif text-xl sm:text-2xl font-normal text-charcoal">
                {t("bottomCard.title")}
              </span>
              <p className="text-xs sm:text-sm text-[#5C6660] mt-1.5 max-w-[540px]">
                {t("bottomCard.description")}
              </p>
            </div>

            <Button
              onClick={openApply}
              className="shrink-0 py-6 px-7 rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-medium tracking-wide transition-all shadow-[0_4px_16px_rgba(46,90,68,0.25)] active:scale-[0.98]"
            >
              {t("bottomCard.cta")} →
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
