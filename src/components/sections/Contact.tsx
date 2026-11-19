"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { contactConfig } from "@/config/contact";
import { formatSectionKicker } from "@/config/sections";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  formatUzbekPhone,
  cleanUzbekPhone,
  isUzbekPhoneComplete,
} from "@/lib/formatPhone";

export function Contact() {
  const t = useTranslations("contact");
  const applyT = useTranslations("applyModal");
  const locale = useLocale();

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companySize: "Toshkent 5/5",
    business: "",
    honeypot: "",
  });

  const [displayPhone, setDisplayPhone] = useState("+998 ");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setDisplayPhone(formatted);
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const errors: { name?: string; phone?: string } = {};

    if (!isAnonymous && formData.name.trim().length < 2) {
      errors.name = t("nameError");
    }

    if (!isUzbekPhoneComplete(displayPhone)) {
      errors.phone = t("phoneError");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      setIsSubmitting(true);
      const cleanedPhone = cleanUzbekPhone(displayPhone);

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isAnonymous ? (formData.name.trim() || "Anonim Mehmon") : formData.name.trim(),
          isAnonymous,
          phone: cleanedPhone,
          companySize: formData.companySize || "Toshkent 5/5",
          business: formData.companySize,
          question: formData.business.trim() || undefined,
          service: "Individual psixologik konsultatsiya",
          locale,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMessage(
          data.error || "Arizani yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
        );
        return;
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        companySize: "Toshkent 5/5",
        business: "",
        honeypot: "",
      });
      setDisplayPhone("+998 ");
    } catch {
      setErrorMessage(
        "Aloqa xatosi yuz berdi. Internetni tekshirib qayta urinib ko'ring."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const officeAddress =
    locale === "ru"
      ? contactConfig.office.addressRu
      : locale === "en"
      ? contactConfig.office.addressEn
      : contactConfig.office.addressUz;

  return (
    <section
      id="aloqa"
      aria-label={t("title")}
      className="scroll-mt-20 relative bg-cream border-t border-[#E5DFD6] py-16 sm:py-24 pb-28 sm:pb-32 overflow-hidden text-charcoal"
    >
      <span id="kontakt" className="absolute -top-24 pointer-events-none" />
      <span id="kontaktlar" className="absolute -top-24 pointer-events-none" />

      {/* Atmospheric ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-[5%] top-[15%] w-[550px] h-[550px] rounded-full bg-[#E8DFD1]/70 blur-3xl"
        />
        <div
          className="absolute -left-[5%] bottom-[15%] w-[480px] h-[480px] rounded-full bg-[#DCE5DF]/60 blur-3xl"
        />
      </div>

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
        {/* Left Column — Editorial Details & Direct Ledger */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <BotanicalMotif variant="leaf" className="w-5 h-5 text-[#C49A6C]" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-sage font-medium">
                {formatSectionKicker("contact", t("kicker"))}
              </span>
            </div>

            <MaskedHeading className="text-3xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.18] text-charcoal mt-5">
              {t("titlePrefix")}
              <span className="font-serif italic font-normal text-sage">
                {t("titleHighlight")}
              </span>
            </MaskedHeading>

            <p className="text-base sm:text-lg text-[#5C6660] font-normal leading-relaxed mt-4 max-w-xl">
              {t("description")}
            </p>
          </div>

          {/* Contact Ledger */}
          <div className="border-t border-[#E5E0D8] mt-8 bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border shadow-[0_4px_20px_rgba(46,90,68,0.04)] divide-y divide-[#E5E0D8]">
            {/* Phone Row */}
            <div className="py-4 flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs text-[#5C6660] uppercase tracking-wider shrink-0">
                {t("phoneLabel")}
              </span>
              <a
                href={contactConfig.phone.href}
                aria-label={contactConfig.phone.ariaLabel}
                className="text-base font-medium text-charcoal hover:text-sage transition-colors font-mono"
              >
                {contactConfig.phone.display}
              </a>
            </div>

            {/* Telegram Channel Row */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
              <span className="font-mono text-xs text-[#5C6660] uppercase tracking-wider shrink-0">
                {t("telegramChannelLabel")}
              </span>
              <a
                href={contactConfig.telegramChannel.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contactConfig.telegramChannel.ariaLabel}
                className="text-base font-medium text-sage hover:underline font-mono"
              >
                {contactConfig.telegramChannel.display}
              </a>
            </div>

            {/* Telegram Direct Row */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
              <span className="font-mono text-xs text-[#5C6660] uppercase tracking-wider shrink-0">
                {t("telegramDirectLabel")}
              </span>
              <a
                href={contactConfig.telegramDirect.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contactConfig.telegramDirect.ariaLabel}
                className="text-base font-medium text-sage hover:underline font-mono"
              >
                {contactConfig.telegramDirect.display}
              </a>
            </div>

            {/* Instagram Row */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
              <span className="font-mono text-xs text-[#5C6660] uppercase tracking-wider shrink-0">
                Instagram
              </span>
              <a
                href={contactConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contactConfig.instagram.ariaLabel}
                className="text-base font-medium text-sage hover:underline font-mono"
              >
                {contactConfig.instagram.display}
              </a>
            </div>

            {/* Office Row */}
            <div className="py-4 flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs text-[#5C6660] uppercase tracking-wider shrink-0">
                {t("addressLabel")}
              </span>
              <span className="text-base font-medium text-charcoal text-right">
                {officeAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column — Direct Consultation Form with Tactile Elevation */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E5DFD6] rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_14px_45px_rgba(46,90,68,0.07)] p-8 sm:p-10 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
              {t("formTitle")}
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-sage/10 text-sage font-mono text-[11px] font-medium">
              100% Maxfiy
            </span>
          </div>

          <p className="text-xs text-[#5C6660] mb-7">
            {t("formSubtitle")}
          </p>

          {isSuccess ? (
            <div className="py-4 text-left animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sage mb-4">
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span>{applyT("thankYouBadge")}</span>
              </div>

              <h4 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
                {applyT("thankYouTitle")}
              </h4>

              <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed mb-6">
                {applyT("thankYouBody")}
              </p>

              <div className="border-t border-b border-[#E5E0D8] py-4 mb-6 space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-sage shrink-0 font-bold">{applyT("timelineStep1Prefix")}</span>
                  <span className="text-charcoal">{applyT("timelineStep1Text")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#C59B6D] shrink-0 font-bold">{applyT("timelineStep2Prefix")}</span>
                  <span className="text-[#5C6660]">{applyT("timelineStep2Text")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#C59B6D] shrink-0 font-bold">{applyT("timelineStep3Prefix")}</span>
                  <span className="text-[#5C6660]">{applyT("timelineStep3Text")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={contactConfig.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contactConfig.telegram.ariaLabel}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sage hover:bg-sage-hover text-cream font-medium text-xs rounded-full transition-all"
                >
                  <span>{applyT("actionTelegram")}</span>
                  <span>↗</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#E5E0D8] hover:bg-[#F2EFE9] text-charcoal text-xs font-medium rounded-full transition-all cursor-pointer"
                >
                  <span>{t("submitAnother")}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="hidden" aria-hidden="true">
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, honeypot: e.target.value }))
                  }
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 border border-red-300 bg-red-50 text-red-700 text-xs rounded-xl flex items-center justify-between gap-3"
                >
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="shrink-0 px-3 py-1 bg-red-600 text-white text-xs rounded-full cursor-pointer"
                  >
                    {t("retry")}
                  </button>
                </div>
              )}

              {/* Hook #1: Anonymous Mode Switch */}
              <div className="bg-[#142820]/5 border border-[#C59B6D]/30 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔒</span>
                    <div>
                      <p className="text-xs font-semibold text-charcoal">
                        Anonim yozilish (Ism shart emas)
                      </p>
                      <p className="text-[11px] text-[#5C6660]">
                        100% maxfiylik kafolati
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="contact-anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      setIsAnonymous(checked);
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    className="data-[state=checked]:bg-sage data-[state=unchecked]:bg-[#E5DFD6]"
                  />
                </div>
                {isAnonymous && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#C59B6D]/20 animate-in fade-in duration-200">
                    <Badge
                      variant="outline"
                      className="bg-sage/10 text-sage border-sage/30 text-[11px] py-0.5 px-2.5 rounded-full w-full justify-center"
                    >
                      ✨ Sizning shaxsingiz 100% sir saqlanadi
                    </Badge>
                  </div>
                )}
              </div>

              {/* Name / Nickname */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block mb-2"
                >
                  {isAnonymous ? "Taxallus (masalan: Mehmon)" : t("nameLabel")}{" "}
                  {!isAnonymous && <span className="text-sage">*</span>}
                </label>
                <Input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  required={!isAnonymous}
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder={isAnonymous ? "Mehmon yoki ixtiyoriy taxallus" : t("namePlaceholder")}
                  disabled={isSubmitting}
                  className={`w-full bg-cream border h-12 px-4 py-3.5 text-sm text-charcoal placeholder:text-[#5C6660]/60 rounded-xl transition-all ${
                    fieldErrors.name
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-[#E5DFD6] focus:border-sage focus:ring-2 focus:ring-sage/20"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-red-500 font-light">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block mb-2"
                >
                  {t("phoneInputLabel")}
                </label>
                <Input
                  id="contact-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={displayPhone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  placeholder="+998 (90) 123-45-67"
                  className={`w-full bg-cream border h-12 px-4 py-3.5 text-sm text-charcoal placeholder:text-[#5C6660]/60 rounded-xl transition-all font-mono ${
                    fieldErrors.phone
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-[#E5DFD6] focus:border-sage focus:ring-2 focus:ring-sage/20"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs text-red-500 font-light">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Consultation Format Selector */}
              <div>
                <span className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block mb-2">
                  {applyT("companyScaleLabel")}
                </span>
                <div
                  role="radiogroup"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2"
                >
                  {[
                    { value: "Toshkent 5/5", title: "Toshkent 5/5", sub: "Oflayn qabul" },
                    { value: "Onlayn Zoom", title: "Onlayn", sub: "Zoom / Video" },
                    { value: "Telegram audio", title: "Telegram", sub: "Audio aloqa" },
                    { value: "Trening", title: "Trening", sub: "Guruh dasturi" },
                  ].map((opt) => {
                    const isSelected = (formData.companySize || "Toshkent 5/5") === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, companySize: opt.value }))
                        }
                        disabled={isSubmitting}
                        className={`py-2.5 px-2 rounded-xl text-xs transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                          isSelected
                            ? "bg-sage border-sage text-cream shadow-[0_2px_10px_rgba(46,90,68,0.25)]"
                            : "bg-[#F2EFE9] border-[#E5E0D8] text-[#5C6660] hover:bg-[#EAE5DC]"
                        }`}
                      >
                        <span className="font-semibold text-xs">{opt.title}</span>
                        <span className="text-[10px] opacity-80 font-sans leading-tight">
                          {opt.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason / Notes */}
              <div>
                <label
                  htmlFor="contact-business"
                  className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block mb-2"
                >
                  {t("businessInputLabel")}
                </label>
                <Textarea
                  id="contact-business"
                  rows={3}
                  value={formData.business}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, business: e.target.value }))
                  }
                  placeholder={t("businessInputPlaceholder")}
                  disabled={isSubmitting}
                  className="w-full bg-cream border border-[#E5DFD6] px-4 py-3 text-sm text-charcoal placeholder:text-[#5C6660]/60 focus:border-sage focus:ring-2 focus:ring-sage/20 rounded-xl transition-all resize-none"
                />
              </div>

              {/* Privacy badge */}
              <div className="flex items-center gap-2 text-xs text-[#5C6660] pt-1">
                <span className="text-sage">🔒</span>
                <span>Barcha ma&apos;lumotlar 100% maxfiy saqlanadi.</span>
              </div>

              {/* Submit Button (shadcn Button) */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sage hover:bg-sage-hover text-cream py-6 text-xs tracking-wider uppercase font-medium transition-all rounded-full mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(46,90,68,0.25)] active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{applyT("submitting")}</span>
                ) : (
                  <span>{t("formSubmit")}</span>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
