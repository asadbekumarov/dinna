"use client";

import React, { useState, useTransition, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  QUIZ_QUESTIONS,
  DIAGNOSTIC_MAP,
  calculateQuizScore,
  type QuizDiagnosticResult,
} from "../data/quizData";
import {
  formatUzbekPhone,
  cleanUzbekPhone,
  isUzbekPhoneComplete,
} from "@/lib/formatPhone";
import { contactConfig } from "@/config/contact";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Lock, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

type QuizStep = "intro" | "questions" | "lead" | "result";

interface QuizResultData {
  score: number;
  answers: number[];
  diagnostic: QuizDiagnosticResult;
  telegramSent?: boolean;
}

export function QuizView() {
  const t = useTranslations("quiz");
  const locale = useLocale() as "uz" | "ru" | "en";
  const [, startTransition] = useTransition();

  const [step, setStep] = useState<QuizStep>("intro");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Hook #1: Anonymous toggle
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Contact Method (Phone vs Telegram)
  const [contactMethod, setContactMethod] = useState<"phone" | "telegram">("phone");
  const [telegramHandle, setTelegramHandle] = useState<string>("");

  // Lead form state
  const [name, setName] = useState<string>("");
  const [displayPhone, setDisplayPhone] = useState<string>("+998 ");
  const [phone, setPhone] = useState<string>("+998");
  const [companySize, setCompanySize] = useState<string>("Toshkent 5/5");
  const [honeypot, setHoneypot] = useState<string>("");

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    telegramHandle?: string;
    companySize?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultData, setResultData] = useState<QuizResultData | null>(null);

  // Refs for error auto-focusing
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const telegramInputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleStart = () => {
    setAnswers([]);
    setCurrentIdx(0);
    setStep("questions");
  };

  const handleSelectOption = useCallback(
    (points: 0 | 1 | 2 | 3) => {
      if (isTransitioning) return;

      const nextAnswers = [...answers];
      nextAnswers[currentIdx] = points;
      setAnswers(nextAnswers);
      setIsTransitioning(true);

      setTimeout(() => {
        startTransition(() => {
          if (currentIdx + 1 < totalQuestions) {
            setCurrentIdx((prev) => prev + 1);
          } else {
            setStep("lead");
          }
          setIsTransitioning(false);
        });
      }, 240);
    },
    [answers, currentIdx, isTransitioning, totalQuestions]
  );

  const handleBackQuestion = () => {
    if (isTransitioning) return;
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    } else {
      setStep("intro");
    }
  };

  const handleBackFromLead = () => {
    setCurrentIdx(totalQuestions - 1);
    setStep("questions");
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setDisplayPhone(formatted);
    const cleaned = cleanUzbekPhone(formatted);
    setPhone(cleaned);
    if (formErrors.phone) {
      setFormErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleAnonymousToggle = (checked: boolean) => {
    setIsAnonymous(checked);
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: {
      name?: string;
      phone?: string;
      telegramHandle?: string;
      companySize?: string;
    } = {};

    if (!isAnonymous && (!name.trim() || name.trim().length < 2)) {
      errors.name = t("nameError");
    }

    if (contactMethod === "phone") {
      if (!isUzbekPhoneComplete(phone)) {
        errors.phone = t("phoneError");
      }
    } else {
      if (!telegramHandle.trim() || telegramHandle.trim().length < 3) {
        errors.telegramHandle = t("telegramRequiredError");
      }
    }

    if (!companySize) {
      errors.companySize = t("scaleError");
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.name && nameInputRef.current) {
        nameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nameInputRef.current.focus();
      } else if (errors.phone && phoneInputRef.current) {
        phoneInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        phoneInputRef.current.focus();
      } else if (errors.telegramHandle && telegramInputRef.current) {
        telegramInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        telegramInputRef.current.focus();
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const computedScore = calculateQuizScore(answers);
      const q1Index = answers[0] ?? 0;
      const diagnostic = DIAGNOSTIC_MAP[q1Index] ?? DIAGNOSTIC_MAP[0];

      const clientName = isAnonymous ? (name.trim() || "Anonim Mehmon") : name.trim();

      const payload = {
        name: clientName,
        isAnonymous,
        phone: contactMethod === "phone" ? phone : "",
        telegramHandle: telegramHandle.trim(),
        companySize,
        score: computedScore,
        answers,
        locale,
        honeypot,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      };

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setResultData({
        score: computedScore,
        answers,
        diagnostic,
        telegramSent: data.success || res.ok,
      });

      setStep("result");
    } catch {
      const fallbackScore = calculateQuizScore(answers);
      const q1Index = answers[0] ?? 0;
      const fallbackDiagnostic = DIAGNOSTIC_MAP[q1Index] ?? DIAGNOSTIC_MAP[0];

      setResultData({
        score: fallbackScore,
        answers,
        diagnostic: fallbackDiagnostic,
        telegramSent: false,
      });

      setStep("result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentIdx(0);
    setName("");
    setDisplayPhone("+998 ");
    setPhone("+998");
    setTelegramHandle("");
    setIsAnonymous(false);
    setFormErrors({});
    setResultData(null);
    setStep("intro");
  };

  const formatButtons = [
    { id: "Toshkent 5/5", label: t("scale1Sub") },
    { id: "Onlayn Zoom", label: t("scale2Sub") },
    { id: "Telegram", label: t("scale3Sub") },
    { id: "Trening", label: t("scale4Sub") },
  ];

  // Dynamic empathetic text based on result
  const diagnosticEmpathy =
    resultData?.diagnostic?.empathyNote[locale] ||
    resultData?.diagnostic?.empathyNote.uz ||
    "";

  const diagnosticService =
    resultData?.diagnostic?.serviceTitle[locale] ||
    resultData?.diagnostic?.serviceTitle.uz ||
    "";

  const diagnosticAction =
    resultData?.diagnostic?.actionText[locale] ||
    resultData?.diagnostic?.actionText.uz ||
    "";

  // Official direct telegram link
  const directTelegramUrl =
    contactConfig.telegramDirect?.url || contactConfig.telegram?.url || "https://t.me/m1rzabayevaa_021";

  return (
    <div className="min-h-[calc(100dvh-var(--header-h,5rem))] bg-cream flex flex-col justify-center py-6 sm:py-12 px-0 sm:px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* ================= STEP 1: INTRO ================= */}
        {step === "intro" && (
          <div className="w-full bg-[#142820] text-cream border-0 sm:border border-[#C59B6D]/30 rounded-none sm:rounded-3xl p-6 sm:p-10 shadow-none sm:shadow-2xl relative overflow-hidden transition-all">
            <div className="mb-4">
              <Badge
                variant="outline"
                className="bg-[#DFBA73]/15 text-[#DFBA73] border-[#DFBA73]/40 text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1 rounded-full font-medium"
              >
                {t("badge")}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif text-cream font-normal leading-tight tracking-tight mb-4">
              {t("introTitle")}
            </h1>

            <p className="text-base sm:text-lg text-[#DFBA73] font-serif italic mb-3">
              {t("introSubtitle")}
            </p>

            <p className="text-sm sm:text-base text-[#D0D9D4] font-normal leading-relaxed mb-8">
              {t("introDescription")}
            </p>

            <div className="pt-2">
              <Button
                type="button"
                onClick={handleStart}
                className="w-full sm:w-auto h-12 min-h-[48px] px-8 rounded-full bg-[#DFBA73] hover:bg-[#C59B6D] text-[#142820] text-xs uppercase tracking-[0.16em] font-bold shadow-[0_6px_25px_rgba(223,186,115,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("startAction")}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: QUESTIONS (One screen = one question) ================= */}
        {step === "questions" && currentQuestion && (
          <div className="w-full bg-[#142820] text-cream border-0 sm:border border-[#C59B6D]/30 rounded-none sm:rounded-3xl p-6 sm:p-10 shadow-none sm:shadow-2xl relative overflow-hidden transition-all flex flex-col">
            {/* Thin Glowing Progress Bar at Top */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#DFBA73] mb-2 font-medium">
                <span>
                  {currentIdx + 1} / {totalQuestions}
                </span>
                <span>{Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
              </div>
              <Progress
                value={((currentIdx + 1) / totalQuestions) * 100}
                className="h-1.5 bg-white/10 [&>div]:bg-[#DFBA73]"
              />
            </div>

            {/* Question Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-cream leading-snug tracking-tight mb-6 sm:mb-8">
              {currentQuestion.title[locale] || currentQuestion.title.uz}
            </h2>

            {/* Answer Options as Real Buttons (min-h-[56px], letter badge 32px) */}
            <div
              role="radiogroup"
              aria-label={currentQuestion.title[locale] || currentQuestion.title.uz}
              className="space-y-3 mb-8"
            >
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentIdx] === option.points;
                const letter = ["A", "B", "C", "D"][optIdx];

                return (
                  <button
                    key={optIdx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(option.points)}
                    className={`w-full min-h-[56px] p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 active:scale-[0.99] ${
                      isSelected
                        ? "bg-[#23473A] border-[#DFBA73] text-cream shadow-md ring-1 ring-[#DFBA73]"
                        : "bg-[#1B352B]/70 hover:bg-[#1B352B] border-white/10 hover:border-[#DFBA73]/50 text-cream"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1">
                      {/* Letter badge: 32px */}
                      <span
                        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-mono text-xs font-bold transition-colors border ${
                          isSelected
                            ? "bg-[#DFBA73] text-[#142820] border-[#DFBA73]"
                            : "bg-[#142820] border-white/20 text-[#DFBA73]"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed font-normal text-cream">
                        {option.text[locale] || option.text.uz}
                      </span>
                    </div>

                    {/* Radio indicator */}
                    <span
                      className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#DFBA73] bg-[#DFBA73]/20"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DFBA73]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Back Button (min-h-[44px]) */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackQuestion}
                className="min-h-[44px] min-w-[44px] px-3 font-mono text-xs uppercase tracking-wider text-[#A3B8AE] hover:text-cream transition-colors cursor-pointer inline-flex items-center gap-2 rounded-lg"
                aria-label={t("backAction")}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t("backAction")}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: LEAD FORM ================= */}
        {step === "lead" && (
          <div className="w-full bg-[#142820] text-cream border-0 sm:border border-[#C59B6D]/30 rounded-none sm:rounded-3xl p-6 sm:p-10 shadow-none sm:shadow-2xl relative overflow-hidden transition-all">
            {/* Back Button (min-h-[44px]) */}
            <button
              type="button"
              onClick={handleBackFromLead}
              className="min-h-[44px] px-2 font-mono text-xs uppercase tracking-wider text-[#A3B8AE] hover:text-cream transition-colors cursor-pointer inline-flex items-center gap-2 mb-4 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("backAction")}</span>
            </button>

            <h2 className="text-2xl sm:text-3xl font-serif text-cream font-normal leading-snug mb-2">
              {t("leadTitle")}
            </h2>
            <p className="text-sm text-[#D0D9D4] leading-relaxed mb-6">
              {t("leadSubtitle")}
            </p>

            {/* Anonymous Switch (min-h-[44px] zone) */}
            <div className="bg-[#1B352B]/80 border border-[#C59B6D]/30 p-3.5 sm:p-4 rounded-2xl mb-6 min-h-[44px]">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="quiz-anonymous-toggle"
                  className="flex items-center gap-2.5 cursor-pointer flex-1"
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-[#DFBA73]" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-cream tracking-wide">
                      {t("anonymousTitle")}
                    </p>
                    <p className="text-[11px] text-[#A3B8AE]">
                      {t("anonymousDesc")}
                    </p>
                  </div>
                </label>
                <Switch
                  id="quiz-anonymous-toggle"
                  checked={isAnonymous}
                  onCheckedChange={handleAnonymousToggle}
                  className="data-[state=checked]:bg-[#DFBA73] data-[state=unchecked]:bg-white/20"
                />
              </div>

              {isAnonymous && (
                <div className="mt-3 pt-2.5 border-t border-white/10 animate-in fade-in duration-200">
                  <Badge
                    variant="outline"
                    className="bg-[#DFBA73]/10 text-[#DFBA73] border-[#DFBA73]/30 text-[11px] font-normal py-1 px-3 flex items-center gap-1.5 rounded-full w-full justify-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#DFBA73] shrink-0" />
                    <span>{t("anonymousBadge")}</span>
                  </Badge>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitLead} noValidate className="space-y-5">
              {/* Anti-spam Honeypot */}
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

              {/* Name Input (16px / text-base, h-12) */}
              {!isAnonymous && (
                <div>
                  <label
                    htmlFor="quiz-name"
                    className="text-xs uppercase tracking-wider text-[#A3B8AE] font-mono block mb-1.5 font-medium"
                  >
                    {t("nameLabel")} <span className="text-[#DFBA73]">*</span>
                  </label>
                  <Input
                    ref={nameInputRef}
                    id="quiz-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder={t("namePlaceholder")}
                    disabled={isSubmitting}
                    className={`w-full bg-[#1B352B]/80 text-cream h-12 text-base px-4 rounded-xl border placeholder:text-white/40 ${
                      formErrors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                        : "border-white/15 focus:border-[#DFBA73] focus:ring-1 focus:ring-[#DFBA73]"
                    }`}
                  />
                  {formErrors.name && (
                    <p
                      role="alert"
                      aria-live="polite"
                      className="text-sm text-red-400 mt-1.5 flex items-center gap-1 font-normal"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Contact Method Selector (Phone or Telegram) - 44px min-height */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#A3B8AE] font-mono block font-medium">
                    {t("contactChoiceLabel")} <span className="text-[#DFBA73]">*</span>
                  </label>
                  {/* Segmented Control 44px */}
                  <div className="flex items-center gap-1 bg-[#1B352B] p-1 rounded-xl min-h-[44px]">
                    <button
                      type="button"
                      onClick={() => setContactMethod("phone")}
                      className={`min-h-[36px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        contactMethod === "phone"
                          ? "bg-[#DFBA73] text-[#142820] font-bold shadow-sm"
                          : "text-[#A3B8AE] hover:text-white"
                      }`}
                    >
                      {t("contactPhone")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod("telegram")}
                      className={`min-h-[36px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        contactMethod === "telegram"
                          ? "bg-[#DFBA73] text-[#142820] font-bold shadow-sm"
                          : "text-[#A3B8AE] hover:text-white"
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
                      id="quiz-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={displayPhone}
                      onChange={handlePhoneInputChange}
                      placeholder="+998 (90) 123-45-67"
                      disabled={isSubmitting}
                      className={`w-full bg-[#1B352B]/80 text-cream h-12 text-base px-4 rounded-xl border font-mono placeholder:text-white/40 ${
                        formErrors.phone
                          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                          : "border-white/15 focus:border-[#DFBA73] focus:ring-1 focus:ring-[#DFBA73]"
                      }`}
                    />
                    {formErrors.phone && (
                      <p
                        role="alert"
                        aria-live="polite"
                        className="text-sm text-red-400 mt-1.5 flex items-center gap-1 font-normal"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Input
                      ref={telegramInputRef}
                      id="quiz-telegram"
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={telegramHandle}
                      onChange={(e) => {
                        setTelegramHandle(e.target.value);
                        if (formErrors.telegramHandle) {
                          setFormErrors((prev) => ({ ...prev, telegramHandle: undefined }));
                        }
                      }}
                      placeholder={t("telegramPlaceholder")}
                      disabled={isSubmitting}
                      className={`w-full bg-[#1B352B]/80 text-cream h-12 text-base px-4 rounded-xl border placeholder:text-white/40 ${
                        formErrors.telegramHandle
                          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                          : "border-white/15 focus:border-[#DFBA73] focus:ring-1 focus:ring-[#DFBA73]"
                      }`}
                    />
                    {formErrors.telegramHandle && (
                      <p
                        role="alert"
                        aria-live="polite"
                        className="text-sm text-red-400 mt-1.5 flex items-center gap-1 font-normal"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.telegramHandle}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Format selection pills */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A3B8AE] font-mono block mb-2 font-medium">
                  {t("companyScaleLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {formatButtons.map((btn) => {
                    const isSelected = companySize === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setCompanySize(btn.id)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-[#DFBA73] text-[#142820] border-[#DFBA73] font-bold shadow-sm"
                            : "bg-[#1B352B]/60 text-cream border-white/10 hover:border-[#DFBA73]/40"
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 min-h-[48px] rounded-full bg-[#DFBA73] hover:bg-[#C59B6D] text-[#142820] text-xs uppercase tracking-[0.16em] font-bold shadow-[0_6px_25px_rgba(223,186,115,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t("submittingAction")}</span>
                  ) : (
                    <>
                      <span>{t("viewResultAction")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 4: RESULT ================= */}
        {step === "result" && resultData && (
          <div className="w-full bg-[#142820] text-cream border-0 sm:border border-[#C59B6D]/30 rounded-none sm:rounded-3xl p-6 sm:p-10 shadow-none sm:shadow-2xl relative overflow-hidden transition-all">
            {/* Top Badge & Score */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <Badge
                variant="outline"
                className="bg-[#DFBA73]/15 text-[#DFBA73] border-[#DFBA73]/40 text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1 rounded-full font-medium"
              >
                {t("resultScoreLabel")}
              </Badge>
              <span className="font-mono text-sm text-[#DFBA73] font-semibold">
                {resultData.score} / {t("resultScoreOutOf")}
              </span>
            </div>

            {/* Empathetic Highlight Callout */}
            <div className="p-5 sm:p-6 mb-6 rounded-2xl bg-[#1B352B]/80 border border-[#C59B6D]/30 flex items-start gap-3.5 shadow-sm">
              <Sparkles className="w-6 h-6 text-[#DFBA73] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-cream leading-snug">
                  {diagnosticEmpathy}
                </h3>
                <p className="text-xs sm:text-sm text-[#D0D9D4] mt-2 leading-relaxed">
                  {t("resultEmpathySub")}
                </p>
              </div>
            </div>

            {/* Tailored Recommendation Card */}
            <div className="border border-[#DFBA73]/40 bg-gradient-to-br from-[#1B352B]/90 to-[#142820] rounded-2xl p-6 sm:p-8 mb-6 shadow-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#DFBA73] font-bold block mb-2">
                {t("resultRecommendationTitle")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-cream tracking-tight leading-snug mb-3">
                {diagnosticService}
              </h2>
              <p className="text-sm text-[#D0D9D4] leading-relaxed">
                {diagnosticAction}. {t("resultFirstSessionBenefit")}
              </p>
            </div>

            {/* Confidentiality Reminder */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 mb-8">
              <Lock className="w-4 h-4 text-[#A3B8AE] shrink-0" />
              <span className="text-xs text-[#A3B8AE]">
                {t("resultPrivacyReminder")}
              </span>
            </div>

            {/* Result Actions: Primary 52px Telegram Button + Secondary Text Links */}
            <div className="space-y-4">
              {/* Primary 52px Full-Width CTA */}
              <Button
                asChild
                className="w-full h-[52px] min-h-[52px] bg-[#DFBA73] hover:bg-[#C59B6D] text-[#142820] font-bold px-7 text-xs uppercase tracking-[0.16em] rounded-full shadow-[0_6px_25px_rgba(223,186,115,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <a
                  href={`${directTelegramUrl}?text=${encodeURIComponent(
                    `Salom Dinna! Men 3 daqiqalik testdan o'tdim (${diagnosticService}). Konsultatsiyaga yozilmoqchiman.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
                  </svg>
                  <span>{t("ctaTelegramDirect")}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>

              {/* Secondary Actions as 44px Text Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
                <Link
                  href="/bron"
                  className="min-h-[44px] inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#DFBA73] hover:text-white underline underline-offset-4 transition-colors"
                >
                  {t("ctaBooking")} →
                </Link>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="min-h-[44px] inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#A3B8AE] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                >
                  {t("ctaRetake")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
