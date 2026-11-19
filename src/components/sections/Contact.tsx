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

  const formatOptions = [
    { id: "Toshkent 5/5", label: t("formatOffline") || "Toshkent 5/5 (Oflayn)", icon: "🌿" },
    { id: "Onlayn (Zoom/Telegram)", label: t("formatOnline") || "Onlayn (Zoom / Telegram)", icon: "🕊️" },
    { id: "Mualliflik Treningi", label: t("formatTraining") || "Mualliflik Treningi", icon: "✨" },
  ];

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
      className="scroll-mt-20 relative bg-cream border-t border-border py-[var(--section-y)] pb-28 sm:pb-32 overflow-x-clip text-charcoal"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header (07 + kicker + serif H2) */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-sage font-bold tracking-widest uppercase">
              07
            </span>
            <span className="text-border" aria-hidden="true">/</span>
            <BotanicalMotif variant="leaf" className="w-4 h-4 text-terracotta shrink-0" />
            <Badge
              variant="outline"
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sage border-sage/30 bg-sage/5 font-medium py-0.5 px-3 rounded-full"
            >
              {formatSectionKicker("contact", t("kicker"))}
            </Badge>
          </div>

          <MaskedHeading className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-charcoal leading-[1.16]">
            {t("titlePrefix")}
            <span className="italic text-sage ml-1">
              {t("titleHighlight")}
            </span>
          </MaskedHeading>

          <p className="text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed mt-4 max-w-2xl">
            {t("description")}
          </p>
        </div>

        {/* 12-Column Grid: On Mobile Form is order-1 (first for conversion!), Details is order-2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Form Column (order-1 on mobile, order-2 on desktop lg:col-span-7) */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="bg-white/85 border border-border rounded-2xl p-6 sm:p-8 shadow-card">
              <h3 className="font-serif text-2xl text-charcoal font-normal mb-1">
                {t("formTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted mb-6">
                {t("formSubtitle")}
              </p>

              {isSuccess ? (
                <div className="p-6 bg-sage/10 border border-sage/30 rounded-xl text-center space-y-3">
                  <span className="text-3xl">🕊️</span>
                  <h4 className="font-serif text-xl text-sage font-medium">
                    {applyT("thankYouBadge") || "Arizangiz qabul qilindi"}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto">
                    {t("successMessage") || "Tez orada mutaxassisimiz siz bilan bog'lanadi."}
                  </p>
                  <Button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-3 rounded-full text-xs min-h-[44px]"
                  >
                    Yangi ariza qoldirish
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="website"
                    value={formData.honeypot}
                    onChange={(e) => setFormData((p) => ({ ...p, honeypot: e.target.value }))}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Anonymous Mode Switch */}
                  <div className="flex items-center justify-between p-3.5 bg-cream-200/70 border border-border rounded-xl">
                    <div className="pr-3">
                      <span className="font-medium text-xs sm:text-sm text-charcoal block">
                        {t("anonymousLabel")}
                      </span>
                      <span className="text-[11px] text-charcoal-muted font-mono">
                        {t("anonymousHint")}
                      </span>
                    </div>
                    <Switch
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked)}
                      aria-label={t("anonymousLabel")}
                    />
                  </div>

                  {/* Format Selection Buttons: min-h-[48px] */}
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-charcoal-muted font-medium block mb-2">
                      {t("formatLabel")} <span className="text-terracotta">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {formatOptions.map((opt) => {
                        const isSelected = formData.companySize === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, companySize: opt.id }))}
                            className={`min-h-[48px] px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? "bg-sage text-cream border-sage shadow-sm font-semibold"
                                : "bg-cream-100 border-border text-charcoal hover:bg-cream-200"
                            }`}
                          >
                            <span className="text-sm shrink-0">{opt.icon}</span>
                            <span className="line-clamp-2 leading-tight">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Input (hidden if anonymous) */}
                  {!isAnonymous && (
                    <div>
                      <label className="font-mono text-xs uppercase tracking-wider text-charcoal-muted font-medium block mb-1.5">
                        {t("nameLabel")} <span className="text-terracotta">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder={t("namePlaceholder")}
                        className="w-full h-12 rounded-xl bg-cream-100 text-charcoal border-border focus:border-sage text-base"
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-red-600 mt-1 font-mono">{fieldErrors.name}</p>
                      )}
                    </div>
                  )}

                  {/* Phone Input (16px / text-base for iOS zoom protection) */}
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-charcoal-muted font-medium block mb-1.5">
                      {t("phoneLabel")} <span className="text-terracotta">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={displayPhone}
                      onChange={handlePhoneChange}
                      placeholder="+998 90 123 45 67"
                      className="w-full h-12 rounded-xl bg-cream-100 text-charcoal border-border focus:border-sage font-mono text-base"
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-600 mt-1 font-mono">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Note / Question (16px text-base) */}
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-charcoal-muted font-medium block mb-1.5">
                      {t("noteLabel")}
                    </label>
                    <Textarea
                      value={formData.business}
                      onChange={(e) => setFormData((p) => ({ ...p, business: e.target.value }))}
                      placeholder={t("notePlaceholder")}
                      rows={3}
                      className="w-full rounded-xl bg-cream-100 text-charcoal border-border focus:border-sage text-base leading-relaxed"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-mono">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button: min-h-[48px] */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[50px] rounded-full bg-sage hover:bg-sage-hover text-cream text-xs font-semibold uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {isSubmitting ? "Yuborilmoqda..." : t("submitButton") + " →"}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Details Column (order-2 on mobile, order-1 on desktop lg:col-span-5) */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">
            {/* Contact Details Ledger */}
            <div className="border border-border bg-white/70 rounded-2xl p-6 sm:p-7 shadow-card divide-y divide-border">
              {/* Phone */}
              <div className="py-3.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-charcoal-muted uppercase tracking-wider shrink-0">
                  {t("phoneLabel")}
                </span>
                <a
                  href={contactConfig.phone.href}
                  className="text-sm font-medium text-charcoal hover:text-sage font-mono min-h-[44px] inline-flex items-center"
                >
                  {contactConfig.phone.display}
                </a>
              </div>

              {/* Telegram Channel */}
              <div className="py-3.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-charcoal-muted uppercase tracking-wider shrink-0">
                  {t("telegramChannelLabel")}
                </span>
                <a
                  href={contactConfig.telegramChannel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sage hover:underline font-mono min-h-[44px] inline-flex items-center"
                >
                  {contactConfig.telegramChannel.display}
                </a>
              </div>

              {/* Telegram Direct */}
              <div className="py-3.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-charcoal-muted uppercase tracking-wider shrink-0">
                  {t("telegramDirectLabel")}
                </span>
                <a
                  href={contactConfig.telegramDirect.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sage hover:underline font-mono min-h-[44px] inline-flex items-center"
                >
                  {contactConfig.telegramDirect.display}
                </a>
              </div>

              {/* Instagram */}
              <div className="py-3.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-charcoal-muted uppercase tracking-wider shrink-0">
                  Instagram
                </span>
                <a
                  href={contactConfig.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sage hover:underline font-mono min-h-[44px] inline-flex items-center"
                >
                  {contactConfig.instagram.display}
                </a>
              </div>

              {/* Address */}
              <div className="py-3.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-charcoal-muted uppercase tracking-wider shrink-0">
                  {t("addressLabel")}
                </span>
                <span className="text-xs sm:text-sm font-medium text-charcoal text-right">
                  {officeAddress}
                </span>
              </div>
            </div>

            {/* Confidentiality Reminder Card */}
            <div className="p-5 bg-cream-200/80 border border-sage/20 rounded-2xl flex items-start gap-3">
              <span className="text-xl">🌿</span>
              <div>
                <h5 className="font-serif text-base text-charcoal font-medium">
                  Xavfsiz va sokin muhit
                </h5>
                <p className="text-xs text-charcoal-muted leading-relaxed mt-1">
                  Har bir suhbat qat&apos;iy maxfiylik qoidalariga asoslanadi. Sizning ma&apos;lumotlaringiz hech qachon uchinchi shaxslarga berilmaydi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
