"use client";

import React, { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { applySchema, type ApplyFormData } from "../schemas/applySchema";
import {
  formatUzbekPhone,
  cleanUzbekPhone,
  isUzbekPhoneComplete,
} from "@/lib/formatPhone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Lock, Sparkles, MapPin, Video, AlertCircle } from "lucide-react";

interface ApplyFormProps {
  onSuccess: () => void;
  selectedService?: string | null;
  isBook?: boolean;
}

export function ApplyForm({ onSuccess, selectedService }: ApplyFormProps) {
  const t = useTranslations("applyModal");
  const locale = useLocale();

  // 3-step wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [format, setFormat] = useState<"Toshkent (Oflayn • 5/5)" | "Onlayn (Video-aloqa)">(
    "Toshkent (Oflayn • 5/5)"
  );
  const [preferredDay, setPreferredDay] = useState<string>("Ertaga");
  const [preferredTime, setPreferredTime] = useState<string>("14:00");
  const [contactMethod, setContactMethod] = useState<"phone" | "telegram">("phone");
  const [name, setName] = useState<string>("");
  const [displayPhone, setDisplayPhone] = useState<string>("+998 ");
  const [phone, setPhone] = useState<string>("+998");
  const [telegramHandle, setTelegramHandle] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Refs for auto-focusing on validation errors
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const telegramInputRef = useRef<HTMLInputElement>(null);

  const formatOptions = [
    {
      id: "Toshkent (Oflayn • 5/5)" as const,
      title: t("formatOfflineTitle"),
      desc: t("formatOfflineDesc"),
      icon: MapPin,
    },
    {
      id: "Onlayn (Video-aloqa)" as const,
      title: t("formatOnlineTitle"),
      desc: t("formatOnlineDesc"),
      icon: Video,
    },
  ];

  const dayOptions = [
    { id: "Ertaga", label: t("dayTomorrow") },
    { id: "Indinga", label: t("dayAfterTomorrow") },
    { id: "Shu hafta oxiri", label: t("dayWeekend") },
  ];

  const timeSlots = ["11:00", "14:00", "16:30", "19:00"];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setDisplayPhone(formatted);
    const cleaned = cleanUzbekPhone(formatted);
    setPhone(cleaned);
    if (errors.phone) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const handleAnonymousToggle = (checked: boolean) => {
    setIsAnonymous(checked);
    if (errors.name) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  // Step navigation & validations
  const validateStep2 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (!isAnonymous && (!name.trim() || name.trim().length < 2)) {
      stepErrors.name = t("nameRequiredError");
    }

    if (contactMethod === "phone") {
      if (!isUzbekPhoneComplete(displayPhone)) {
        stepErrors.phone = t("phoneRequiredError");
      }
    } else {
      if (!telegramHandle.trim() || telegramHandle.trim().length < 3) {
        stepErrors.telegramHandle = t("telegramRequiredError");
      }
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      // Focus and scroll to first error field
      if (stepErrors.name && nameInputRef.current) {
        nameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nameInputRef.current.focus();
      } else if (stepErrors.phone && phoneInputRef.current) {
        phoneInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        phoneInputRef.current.focus();
      } else if (stepErrors.telegramHandle && telegramInputRef.current) {
        telegramInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        telegramInputRef.current.focus();
      }
      return false;
    }

    return true;
  };

  const handleNextFromStep1 = () => {
    setErrors({});
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    setServerError(null);

    const submissionData: ApplyFormData = {
      name: isAnonymous ? (name.trim() || "Anonim Mehmon") : name.trim(),
      phone: contactMethod === "phone" ? phone : "",
      telegramHandle: telegramHandle.trim(),
      format,
      preferredDay,
      preferredTime,
      business: format,
      companySize: `${format} (${preferredDay} ${preferredTime})`,
      question: question.trim(),
      service: selectedService || undefined,
      locale,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      honeypot,
      isAnonymous,
    };

    const result = applySchema.safeParse(submissionData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok || (!data.ok && !data.success)) {
        throw new Error(data.error || t("errorMessage"));
      }

      onSuccess();
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Serverga ulanishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-[380px]">
      {/* Honeypot anti-spam field */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* 3-Dot Progress Header */}
      <div className="mb-6 pb-4 border-b border-border/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-charcoal-muted font-medium">
            {t("stepIndicator", { current: currentStep })}
          </span>
          <span className="font-serif text-sm font-medium text-sage">
            {currentStep === 1
              ? t("step1FormatTitle")
              : currentStep === 2
              ? t("step2ContactTitle")
              : t("step3NoteTitle")}
          </span>
        </div>

        {/* Dots & Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((stepNumber) => {
            const isCompleted = currentStep > stepNumber;
            const isCurrent = currentStep === stepNumber;
            return (
              <div
                key={stepNumber}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  isCompleted
                    ? "bg-sage"
                    : isCurrent
                    ? "bg-terracotta"
                    : "bg-cream-300"
                }`}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>

      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3.5 mb-4 border border-red-300 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      {/* ================= STEP 1: FORMAT + DAY/TIME ================= */}
      {currentStep === 1 && (
        <div className="space-y-6 flex-1 animate-in fade-in-50 duration-200">
          {/* Format Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-charcoal-muted font-mono block mb-2.5 font-semibold">
              {t("step1Format")} <span className="text-terracotta">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {formatOptions.map((item) => {
                const isSelected = format === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id)}
                    className={`min-h-[56px] p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1 active:scale-[0.98] ${
                      isSelected
                        ? "bg-sage text-cream border-sage shadow-md ring-1 ring-sage"
                        : "bg-white text-charcoal border-border hover:border-sage/40 hover:bg-cream-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold leading-tight">{item.title}</span>
                      <IconComp
                        className={`w-4 h-4 shrink-0 ${isSelected ? "text-cream" : "text-sage"}`}
                      />
                    </div>
                    <span
                      className={`text-xs ${isSelected ? "text-cream/80" : "text-charcoal-muted"}`}
                    >
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Day (Pills min-h-[44px]) */}
          <div>
            <label className="text-xs uppercase tracking-wider text-charcoal-muted font-mono block mb-2 font-semibold">
              {t("step1Time")} <span className="text-terracotta">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {dayOptions.map((day) => {
                const isSelected = preferredDay === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setPreferredDay(day.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center justify-center active:scale-[0.97] ${
                      isSelected
                        ? "bg-sage text-cream shadow-sm font-semibold ring-1 ring-sage"
                        : "bg-white border border-border text-charcoal hover:bg-cream-100"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            {/* Time Slots (Buttons min-h-[48px]) */}
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => {
                const isSelected = preferredTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPreferredTime(time)}
                    className={`min-h-[48px] py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer active:scale-[0.97] text-center border flex items-center justify-center ${
                      isSelected
                        ? "bg-charcoal text-cream border-charcoal shadow-sm"
                        : "bg-white text-charcoal border-border hover:border-charcoal/40"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Safe-Area Footer for Step 1 */}
          <div className="sticky bottom-0 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-cream/95 backdrop-blur-sm border-t border-border mt-auto">
            <Button
              type="button"
              onClick={handleNextFromStep1}
              className="w-full h-12 bg-sage hover:bg-sage-hover text-cream text-sm font-semibold rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("nextStep")}</span>
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: CONTACT & IDENTITY ================= */}
      {currentStep === 2 && (
        <div className="space-y-5 flex-1 animate-in fade-in-50 duration-200">
          {/* Anonymous Switch (44px min touch zone at top) */}
          <div className="min-h-[44px] bg-white border border-border p-3.5 rounded-2xl flex flex-col justify-center transition-all">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="anonymous-toggle"
                className="flex items-center gap-2.5 cursor-pointer flex-1"
              >
                <span className="w-8 h-8 rounded-full bg-sage/10 text-sage flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-sage" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-charcoal tracking-wide">
                    {t("anonymousTitle")}
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    {t("anonymousDesc")}
                  </p>
                </div>
              </label>
              <Switch
                id="anonymous-toggle"
                checked={isAnonymous}
                onCheckedChange={handleAnonymousToggle}
                className="data-[state=checked]:bg-sage data-[state=unchecked]:bg-cream-300"
              />
            </div>

            {isAnonymous && (
              <div className="mt-3 pt-2.5 border-t border-border/60 animate-in fade-in duration-200">
                <div className="text-sage text-[11px] font-normal py-1 px-3 flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span>{t("anonymousBadge")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Name / Nickname Input */}
          <div>
            <label
              htmlFor="apply-name"
              className="text-xs uppercase tracking-wider text-charcoal-muted font-mono block mb-1.5 font-medium"
            >
              {isAnonymous ? "Taxallus (masalan: Mehmon)" : t("nameLabel")}{" "}
              {!isAnonymous && <span className="text-terracotta">*</span>}
            </label>
            <Input
              ref={nameInputRef}
              id="apply-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.name;
                    return next;
                  });
                }
              }}
              placeholder={isAnonymous ? "Mehmon yoki istalgan taxallus" : t("namePlaceholder")}
              disabled={isSubmitting}
              className={`w-full bg-white h-12 text-base px-4 rounded-xl border ${
                errors.name
                  ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                  : "border-border focus:border-sage focus:ring-1 focus:ring-sage"
              }`}
            />
            {errors.name && (
              <p
                role="alert"
                aria-live="polite"
                className="text-sm text-red-700 mt-1.5 flex items-center gap-1 font-normal"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Contact Method Selector (Phone or Telegram) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal-muted font-mono block font-medium">
                {t("contactMethodLabel")} <span className="text-terracotta">*</span>
              </label>
              {/* 44px min-height Segmented Control */}
              <div className="flex items-center gap-1 bg-cream-200 p-1 rounded-xl min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setContactMethod("phone")}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    contactMethod === "phone"
                      ? "bg-white text-charcoal shadow-sm font-semibold"
                      : "text-charcoal-muted hover:text-charcoal"
                  }`}
                >
                  {t("contactPhone")}
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod("telegram")}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    contactMethod === "telegram"
                      ? "bg-white text-charcoal shadow-sm font-semibold"
                      : "text-charcoal-muted hover:text-charcoal"
                  }`}
                >
                  {t("contactTelegram")}
                </button>
              </div>
            </div>

            {contactMethod === "phone" ? (
              <div>
                <Input
                  ref={phoneInputRef}
                  id="apply-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={displayPhone}
                  onChange={handlePhoneChange}
                  placeholder="+998 (90) 123-45-67"
                  disabled={isSubmitting}
                  className={`w-full bg-white h-12 text-base px-4 rounded-xl border font-mono ${
                    errors.phone
                      ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                      : "border-border focus:border-sage focus:ring-1 focus:ring-sage"
                  }`}
                />
                {errors.phone && (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="text-sm text-red-700 mt-1.5 flex items-center gap-1 font-normal"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Input
                  ref={telegramInputRef}
                  id="apply-telegram"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={telegramHandle}
                  onChange={(e) => {
                    setTelegramHandle(e.target.value);
                    if (errors.telegramHandle) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.telegramHandle;
                        return next;
                      });
                    }
                  }}
                  placeholder="@username yoki telefon raqam"
                  disabled={isSubmitting}
                  className={`w-full bg-white h-12 text-base px-4 rounded-xl border ${
                    errors.telegramHandle
                      ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                      : "border-border focus:border-sage focus:ring-1 focus:ring-sage"
                  }`}
                />
                {errors.telegramHandle && (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="text-sm text-red-700 mt-1.5 flex items-center gap-1 font-normal"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.telegramHandle}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky Safe-Area Footer for Step 2 */}
          <div className="sticky bottom-0 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-cream/95 backdrop-blur-sm border-t border-border mt-auto flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="min-h-[48px] px-5 rounded-full border-border bg-white text-charcoal hover:bg-cream-100 text-xs font-semibold uppercase tracking-wider"
            >
              ← {t("prevStep")}
            </Button>
            <Button
              type="button"
              onClick={handleNextFromStep2}
              className="flex-1 h-12 bg-sage hover:bg-sage-hover text-cream text-sm font-semibold rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("nextStep")}</span>
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: NOTE & CONFIRMATION ================= */}
      {currentStep === 3 && (
        <div className="space-y-5 flex-1 animate-in fade-in-50 duration-200">
          {/* Summary Details Badge Card */}
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm text-xs space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-charcoal-muted font-bold block mb-1">
              {t("summaryTitle")}
            </span>
            <div className="flex items-center justify-between py-1 border-b border-border/60">
              <span className="text-charcoal-muted">{t("summaryFormat")}</span>
              <span className="font-medium text-charcoal">{format}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/60">
              <span className="text-charcoal-muted">{t("summarySlot")}</span>
              <span className="font-medium text-charcoal">
                {preferredDay} · {preferredTime}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-charcoal-muted">{t("summaryContact")}</span>
              <span className="font-medium text-charcoal">
                {isAnonymous
                  ? `Anonim (${contactMethod === "phone" ? displayPhone : telegramHandle})`
                  : `${name} (${contactMethod === "phone" ? displayPhone : telegramHandle})`}
              </span>
            </div>
          </div>

          {/* Optional Note / Question (16px text-base) */}
          <div>
            <label
              htmlFor="apply-question"
              className="text-xs uppercase tracking-wider text-charcoal-muted font-mono block mb-1.5 font-medium"
            >
              {t("noteLabel")}
            </label>
            <Textarea
              id="apply-question"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("notePlaceholder")}
              disabled={isSubmitting}
              className="w-full bg-white border-border px-4 py-3 text-base text-charcoal placeholder:text-charcoal-muted/60 focus:border-sage focus:ring-1 focus:ring-sage rounded-xl resize-none leading-relaxed"
            />
          </div>

          {/* Sticky Safe-Area Footer for Step 3 */}
          <div className="sticky bottom-0 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-cream/95 backdrop-blur-sm border-t border-border mt-auto flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(2)}
              className="min-h-[48px] px-5 rounded-full border-border bg-white text-charcoal hover:bg-cream-100 text-xs font-semibold uppercase tracking-wider"
            >
              ← {t("prevStep")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-sage hover:bg-sage-hover text-cream text-xs uppercase tracking-[0.16em] font-semibold rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{t("submittingFinal")}</span>
              ) : (
                <>
                  <span>{t("submitFinal")}</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
