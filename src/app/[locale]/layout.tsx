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

  const isProduction = process.env.VERCEL_ENV === "production";

  return {
    title,
    description,
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
      siteName: "Dinna Mirzabayeva",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          secureUrl: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: "Dinna Mirzabayeva — Psixolog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-icon.png", type: "image/png" },
      ],
    },
    robots: !isProduction
      ? { index: false, follow: false }
      : { index: true, follow: true },
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
    "@type": ["Person", "HealthAndBeautyBusiness"],
    name: "Dinna Mirzabayeva",
    jobTitle:
      locale === "ru"
        ? "Психолог и тренер личностного роста"
        : locale === "en"
        ? "Psychologist & Personal Growth Coach"
        : "Psixolog va Shaxsiy Rivojlanish Treneri",
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/images/hero/portrait.webp`,
    telephone: contactConfig.phone.clean,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Toshkent shahri, 5/5",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
    },
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
