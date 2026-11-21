import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ApplyModalProvider } from "@/features/apply/context/ApplyModalContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { contactConfig } from "@/config/contact";
import { SITE_URL } from "@/config/siteConfig";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isUz = locale === "uz";
  const isRu = locale === "ru";

  const title = isUz
    ? "Dinna Mirzabayeva | Psixolog & Shaxsiy Rivojlanish Treneri (Toshkent 5/5 & Onlayn)"
    : isRu
    ? "Динна Мирзабаева | Психолог & Тренер личностного роста (Ташкент 5/5 & Онлайн)"
    : "Dinna Mirzabayeva | Psychologist & Personal Growth Coach (Tashkent 5/5 & Online)";

  const description = isUz
    ? "Dinna Mirzabayeva (@m1rzabayevaa_021) — Toshkentda oflayn (5/5) va dunyo bo'ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari. O'zingizni toping va qalbingizga xotirjamlik bering."
    : isRu
    ? "Динна Мирзабаева (@m1rzabayevaa_021) — Индивидуальные психологические консультации в Ташкенте (5/5) и онлайн по всему миру, авторские тренинги личностного роста."
    : "Dinna Mirzabayeva (@m1rzabayevaa_021) — In-person psychological consultations in Tashkent (5/5), worldwide online therapy, and transformational personal growth trainings.";

  const keywords = isUz
    ? [
        "psixolog toshkent",
        "dinna mirzabayeva",
        "psixologik konsultatsiya",
        "amaliyotchi psixolog",
        "onlayn psixolog",
        "shaxsiy rivojlanish treyningi",
        "ruhiy xotirjamlik",
        "ichki xavotir va depressiya",
        "psixolog qabuli",
        "toshkent 5/5 psixolog",
        "individual terapiya",
        "oilaviy psixolog",
        "psixologik test diagnostika",
      ]
    : isRu
    ? [
        "психолог ташкент",
        "динна мирзабаева",
        "психологическая консультация ташкент",
        "онлайн психолог узбекистан",
        "практикующий психолог",
        "тренинги личностного роста",
        "душевное спокойствие",
        "избавление от тревоги",
        "запись к психологу ташкент",
        "психологический тест",
      ]
    : [
        "psychologist tashkent",
        "dinna mirzabayeva",
        "psychological consultation tashkent",
        "online psychologist uzbekistan",
        "mental wellness coach",
        "personal growth trainings",
        "anxiety and stress relief",
        "confidential psychological therapy",
      ];

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Dinna Mirzabayeva", url: `${SITE_URL}/${locale}` }],
    creator: "Dinna Mirzabayeva",
    publisher: "Dinna Mirzabayeva",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uz: "/uz",
        ru: "/ru",
        en: "/en",
        "x-default": "/uz",
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : locale === "ru" ? "ru_RU" : "en_US",
      url: `${SITE_URL}/${locale}`,
      siteName: "Dinna Mirzabayeva — Psixolog",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          secureUrl: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: "Dinna Mirzabayeva — Amaliyotchi Psixolog & Shaxsiy Rivojlanish Treneri",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
      creator: "@m1rzabayevaa_021",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/images/brand/logo-mark.webp", type: "image/webp" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/images/brand/logo-mark.webp", type: "image/webp" },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Person", "HealthAndBeautyBusiness", "MedicalBusiness"],
    "@id": `${SITE_URL}/#dinna-mirzabayeva`,
    name: "Dinna Mirzabayeva",
    alternateName: "Динна Мирзабаева",
    jobTitle:
      locale === "ru"
        ? "Практикующий психолог и тренер личностного роста"
        : locale === "en"
        ? "Certified Psychologist & Personal Growth Coach"
        : "Amaliyotchi psixolog va shaxsiy rivojlanish treneri",
    description:
      locale === "ru"
        ? "Индивидуальные психологические консультации в Ташкенте (5/5) и онлайн по всему миру. 100% конфиденциальность и бережная терапия."
        : locale === "en"
        ? "Confidential in-person psychological therapy in Tashkent (5/5) and worldwide online sessions."
        : "Toshkentda oflayn (5/5) va dunyo bo'ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari.",
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/images/hero/dinna-mirzabayeva-hero.webp`,
    logo: `${SITE_URL}/images/brand/logo.webp`,
    telephone: contactConfig.phone.clean,
    priceRange: "$$",
    currenciesAccepted: "UZS, USD",
    paymentAccepted: "Cash, Card, Payme, Click",
    medicalSpecialty: "Psychology",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Toshkent shahri, 5/5",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.311081",
      longitude: "69.240562",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    knowsAbout: [
      "Psixologiya",
      "Individual konsultatsiya",
      "Stress va xavotirni yengish",
      "Ruhiy xotirjamlik",
      "Shaxsiy chegaralar",
      "Munosabatlar terapiyasi",
      "Art-terapiya",
    ],
    sameAs: [
      contactConfig.instagram.url,
      contactConfig.telegramDirect.url,
      contactConfig.telegramChannel.url,
    ],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ApplyModalProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </ApplyModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
