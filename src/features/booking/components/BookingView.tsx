"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { contactConfig } from "@/config/contact";

// Dynamically import Cal embed with ssr: false to avoid window/document reference issues during SSR
const Cal = dynamic(() => import("@calcom/embed-react"), {
  ssr: false,
  loading: () => null,
});

export function BookingView() {
  const t = useTranslations("booking");
  const locale = useLocale();

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const rawCalLink =
    process.env.NEXT_PUBLIC_CAL_LINK || "asadbek-umarov-klqsdt/15min";
  const calLink = rawCalLink
    ? rawCalLink
        .trim()
        .replace(/^https?:\/\/(app\.)?cal\.com\//i, "")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")
    : "";

  // Cal.com does not currently support 'uz' (Uzbek).
  // For 'uz' users, we provide 'ru' in the calendar embed as the regional secondary language,
  // while our entire website chrome and texts strictly stay in Uzbek.
  const embedLocale = locale === "en" ? "en" : "ru";

  useEffect(() => {
    if (!calLink) {
      setHasError(true);
      return;
    }

    let isMounted = true;

    (async function initCal() {
      try {
        const { getCalApi } = await import("@calcom/embed-react");
        const cal = await getCalApi();
        if (!isMounted) return;

        // Configure theme, brand color token (#2E5A44), and layout
        cal("ui", {
          theme: "light",
          styles: {
            branding: {
              brandColor: "#2E5A44",
            },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });

        // Listen for successful booking events
        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            if (isMounted) setIsBooked(true);
          },
        });

        cal("on", {
          action: "bookingSuccessfulV2",
          callback: () => {
            if (isMounted) setIsBooked(true);
          },
        });

        // Trigger skeleton dismissal when iframe finishes loading
        cal("on", {
          action: "linkReady",
          callback: () => {
            if (isMounted) setIsLoaded(true);
          },
        });
      } catch (err) {
        console.error("[Cal Embed Init Error]", err);
        if (isMounted) setHasError(true);
      }
    })();

    // Fallback timer to hide skeleton if linkReady is delayed or blocked
    const timer = setTimeout(() => {
      if (isMounted && !hasError) {
        setIsLoaded(true);
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [calLink, hasError]);

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      {/* Editorial Header Section */}
      <div className="mb-8 sm:mb-12 max-w-3xl">
        {/* Architectural Kicker */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-[1.5px] bg-[#C59B6D]" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-sage font-medium">
            {t("kicker")}
          </span>
        </div>

        {/* Serif Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-charcoal font-normal tracking-[-0.02em] leading-[1.12]">
          {t("title")}
        </h1>

        {/* Narrative Description */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#5C6660] font-normal leading-relaxed max-w-2xl">
          {t("description")}
        </p>

        {/* 3 Value Pillars / Badges */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-[#E5E0D8] flex flex-wrap items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-charcoal">
              {t("badgeDuration")}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C59B6D] shrink-0" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-charcoal">
              {t("badgePrice")}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-charcoal">
              {t("badgePrivacy")}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Success Notification Banner */}
      {isBooked && (
        <div
          role="status"
          aria-live="polite"
          className="mb-8 p-6 sm:p-8 bg-[#FFFFFF] border border-sage rounded-2xl shadow-[0_12px_40px_rgba(46,90,68,0.12)] flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-500 animate-in fade-in"
        >
          <div className="w-10 h-10 rounded-full bg-sage/15 border border-sage flex items-center justify-center text-sage shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-medium text-charcoal mb-1 font-serif">
              {t("successTitle")}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6660] font-light leading-relaxed">
              {t("successMessage")}
            </p>
          </div>
        </div>
      )}

      {/* Calendar Area or Fallback */}
      <div className="relative w-full border border-[#E5E0D8] bg-[#FFFFFF] shadow-[0_8px_30px_rgb(46,90,68,0.06)] rounded-2xl overflow-hidden">
        {hasError || !calLink ? (
          /* Fallback Error Card if Calendar fails or env var missing */
          <div className="py-16 sm:py-24 px-6 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full border border-[#C59B6D]/40 bg-[#C59B6D]/10 text-[#C59B6D]">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
              {t("errorTitle")}
            </h2>
            <p className="text-[#5C6660] text-sm sm:text-base leading-relaxed mb-8">
              {t("errorDesc")}
            </p>
            <a
              href={contactConfig.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-sage hover:bg-sage-hover text-white px-8 py-4 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 rounded-full shadow-[0_4px_20px_rgba(46,90,68,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
            >
              <span>{t("errorTelegramCta")}</span>
              <span>→</span>
            </a>
          </div>
        ) : (
          <div className="relative min-h-[680px] w-full">
            {/* Minimalist Skeleton Loader */}
            {!isLoaded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-cream p-6 sm:p-10 flex flex-col gap-6 animate-pulse"
              >
                <div className="flex items-center justify-between pb-6 border-b border-[#E5E0D8]">
                  <div className="h-6 w-48 bg-[#E5E0D8] rounded-full" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-[#E5E0D8] rounded-full" />
                    <div className="h-8 w-8 bg-[#E5E0D8] rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-3 py-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-4 bg-[#E5E0D8] rounded-full" />
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-3 flex-1">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className="h-14 sm:h-20 bg-[#F2EFE9] border border-[#E5E0D8]/60 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cal.com Embed Component */}
            <div className="w-full min-h-[680px]">
              <Cal
                calLink={calLink}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "680px",
                  overflow: "auto",
                }}
                config={{
                  layout: "month_view",
                  theme: "light",
                  locale: embedLocale,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
