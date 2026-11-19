"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FAQSkeleton } from "@/components/ui/skeletons";
import { Input } from "@/components/ui/input";
import { Search, X, MessageSquare, ArrowUpRight } from "lucide-react";
import { useApplyModal } from "@/features/apply/context/ApplyModalContext";
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
  const { openApply } = useApplyModal();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

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
        category: "mentorship",
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
        category: "guarantees",
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

  const categories = [
    { key: "all" as CategoryKey, label: isUz ? "Barchasi" : locale === "ru" ? "Все" : "All" },
    { key: "systematization" as CategoryKey, label: t("categories.systematization.title") },
    { key: "consulting" as CategoryKey, label: t("categories.consulting.title") },
    { key: "mentorship" as CategoryKey, label: t("categories.mentorship.title") },
    { key: "guarantees" as CategoryKey, label: t("categories.guarantees.title") },
  ];

  if (isLoading) {
    return <FAQSkeleton />;
  }

  const handleOpenConsultation = () => {
    openApply({ defaultPlan: "Individual psixologik konsultatsiya" });
  };

  return (
    <section
      id="faq"
      aria-label={t("headline")}
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column (Sticky Sidebar on Desktop): Header, Search, Categories, and Help Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-charcoal tracking-tight leading-[1.16]">
                {isUz ? t("headlineUz") : t("headline")}
              </h2>

              <p className="text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed mt-4">
                {t("lede")}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <span className="absolute left-4 pointer-events-none text-sage flex items-center justify-center" aria-hidden="true">
                <Search className="w-4 h-4 text-sage" />
              </span>

              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchLabel")}
                className="w-full h-12 pl-11 pr-12 rounded-full bg-white text-charcoal placeholder:text-charcoal-muted/70 text-base border-border focus:border-sage focus:ring-1 focus:ring-sage shadow-sm"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label={t("clearSearch")}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] absolute right-1 flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "bg-sage text-cream shadow-sm font-semibold"
                        : "bg-white/80 hover:bg-cream-200 text-charcoal-muted hover:text-charcoal border border-border"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Assistance Card (Desktop only in left column) */}
            <div className="hidden lg:block bg-white/85 border border-border rounded-2xl p-6 sm:p-7 shadow-card space-y-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-sage/10 text-sage flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-sage" />
              </div>
              <h3 className="font-serif text-xl font-normal text-charcoal">
                {t("bottomCard.title")}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {t("bottomCard.description")}
              </p>
              <button
                type="button"
                onClick={handleOpenConsultation}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-sage text-cream font-mono text-xs uppercase tracking-wider hover:bg-sage-dark transition-all shadow-sm font-medium w-full cursor-pointer"
              >
                <span>{t("bottomCard.cta")}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Accordion Questions */}
          <div className="lg:col-span-7">
            {filteredItems.length === 0 ? (
              <div className="py-14 text-center text-charcoal-muted font-mono text-sm bg-white/60 rounded-2xl border border-dashed border-border p-8">
                {t("noResults")}
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full divide-y divide-border border-y border-border">
                {filteredItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border-none">
                    <AccordionTrigger className="min-h-[60px] py-4 text-left font-serif text-lg sm:text-xl font-normal text-charcoal hover:text-sage transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Assistance Card (Mobile / Tablet only, below questions) */}
            <div className="block lg:hidden bg-white/85 border border-border rounded-2xl p-6 sm:p-7 shadow-card space-y-3 mt-8">
              <div className="w-10 h-10 rounded-full bg-sage/10 text-sage flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-sage" />
              </div>
              <h3 className="font-serif text-xl font-normal text-charcoal">
                {t("bottomCard.title")}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {t("bottomCard.description")}
              </p>
              <button
                type="button"
                onClick={handleOpenConsultation}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-sage text-cream font-mono text-xs uppercase tracking-wider hover:bg-sage-dark transition-all shadow-sm font-medium w-full cursor-pointer"
              >
                <span>{t("bottomCard.cta")}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
