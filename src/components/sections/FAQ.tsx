"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatSectionKicker } from "@/config/sections";
import { FAQSkeleton } from "@/components/ui/skeletons";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
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

  return (
    <section
      id="faq"
      className="scroll-mt-20 py-[var(--section-y)] border-b border-border bg-cream text-charcoal relative overflow-x-clip"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header (kicker + serif H2) */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BotanicalMotif variant="leaf" className="w-4 h-4 text-terracotta shrink-0" />
            <Badge
              variant="outline"
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sage border-sage/30 bg-sage/5 font-medium py-0.5 px-3 rounded-full"
            >
              {formatSectionKicker("faq", t("kicker"))}
            </Badge>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-charcoal tracking-tight leading-[1.16]">
            {isUz ? t("headlineUz") : t("headline")}
          </h2>

          <p className="text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed mt-4 max-w-2xl">
            {t("lede")}
          </p>
        </div>

        {/* Search Bar (text-base / 16px to prevent iOS auto-zoom) */}
        <div className="max-w-2xl mb-6">
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
        </div>

        {/* Horizontal Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-border">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`min-h-[44px] px-4 rounded-full font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center justify-center ${
                  isSelected
                    ? "bg-sage text-cream shadow-sm font-semibold"
                    : "bg-cream-200 hover:bg-cream-300 text-charcoal-muted hover:text-charcoal border border-border"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accordion List (min-h-[56px] trigger) */}
        <div className="max-w-3xl">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-charcoal-muted font-mono text-sm">
              Hech qanday savol topilmadi.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full divide-y divide-border border-b border-border">
              {filteredItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-none">
                  <AccordionTrigger className="min-h-[56px] py-4 text-left font-serif text-lg sm:text-xl font-normal text-charcoal hover:text-sage transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
}
