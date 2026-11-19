import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { BookingView } from "@/features/booking/components/BookingView";
import { SITE_URL } from "@/config/siteConfig";
import { routing } from "@/i18n/routing";

interface BookingPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isUz = locale === "uz";
  const isRu = locale === "ru";

  const title = isUz
    ? "Konsultatsiya uchun vaqtni tanlang | Dinna Mirzabayeva"
    : isRu
    ? "Выберите время для консультации | Динна Мирзабаева"
    : "Book a Psychological Consultation | Dinna Mirzabayeva";

  const description = isUz
    ? "Dinna Mirzabayeva bilan Toshkentda oflayn (5/5) yoki onlayn individual psixologik konsultatsiya uchun qulay vaqtni tanlang."
    : isRu
    ? "Выберите удобное время для очной консультации в Ташкенте (5/5) или онлайн-сессии с психологом Динной Мирзабаевой."
    : "Select a convenient time for an offline consultation in Tashkent (5/5) or online session with Dinna Mirzabayeva.";

  const pagePath = locale === "uz" ? "/bron" : `/${locale}/bron`;
  const canonicalUrl = `${SITE_URL}${pagePath}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        uz: `${SITE_URL}/uz/bron`,
        ru: `${SITE_URL}/ru/bron`,
        en: `${SITE_URL}/en/bron`,
        "x-default": `${SITE_URL}/uz/bron`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : locale === "ru" ? "ru_RU" : "en_US",
      url: canonicalUrl,
      siteName: "Dinna Mirzabayeva",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal selection:bg-sage/15 selection:text-sage">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 flex flex-col">
        <BookingView />
      </main>

      <Footer />
      <MobileStickyBar />
    </div>
  );
}
