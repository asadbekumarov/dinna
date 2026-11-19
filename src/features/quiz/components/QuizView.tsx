"use client";

import React, { useState, useTransition, useCallback } from "react";
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
import { Card, CardContent } from "@/components/ui/card";

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
  const [companySize, setCompanySize] = useState<string>("Toshkent 5/5 oflayn");
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
      }, 260);
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
        errors.telegramHandle = "Iltimos, Telegram @username yoki telefoningizni kiriting";
      }
    }

    if (!companySize) {
      errors.companySize = t("scaleError");
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const q1 = answers[0] ?? 0;
    const diagnostic = DIAGNOSTIC_MAP[q1] || DIAGNOSTIC_MAP[0];
    const clientName = isAnonymous
      ? (name.trim() || "Anonim Mehmon")
      : name.trim();

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          isAnonymous,
          phone: contactMethod === "phone" ? phone : "",
          telegramHandle: contactMethod === "telegram" ? telegramHandle.trim() : "",
          companySize,
          answers,
          locale,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          honeypot,
        }),
      });

      const data = await response.json();

      setResultData({
        score: data.score || calculateQuizScore(answers),
        answers,
        diagnostic: data.diagnostic || diagnostic,
        telegramSent: data.telegramSent,
      });
      setStep("result");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("[Quiz Submit Error]", err);
      // Fallback display on network exception
      setResultData({
        score: calculateQuizScore(answers),
        answers,
        diagnostic,
        telegramSent: false,
      });
      setStep("result");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentIdx(0);
    setResultData(null);
    setFormErrors({});
    setStep("intro");
  };

  // Pre-calculate localized diagnostic details
  const activeDiagnostic = resultData?.diagnostic || DIAGNOSTIC_MAP[answers[0] ?? 0] || DIAGNOSTIC_MAP[0];
  const diagnosticService = activeDiagnostic.serviceTitle[locale] || activeDiagnostic.serviceTitle.uz;
  const diagnosticEmpathy = activeDiagnostic.empathyNote[locale] || activeDiagnostic.empathyNote.uz;
  const diagnosticAction = activeDiagnostic.actionText[locale] || activeDiagnostic.actionText.uz;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:py-20 relative overflow-hidden bg-cream">
      {/* Slow-drifting ambient light depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[15%] w-[640px] h-[640px] rounded-full bg-[#E8DFD1]/70 blur-3xl opacity-70" />
        <div className="absolute -right-[10%] bottom-[15%] w-[600px] h-[600px] rounded-full bg-[#DCE5DF]/70 blur-3xl opacity-70" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {/* ================= STEP 1: INTRO (Dark-Emerald Sanctuary Container) ================= */}
        {step === "intro" && (
          <Card className="bg-[#142820] text-cream border border-[#C59B6D]/30 rounded-[28px] p-8 sm:p-14 shadow-[0_25px_60px_rgba(10,25,18,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)] relative overflow-hidden backdrop-blur-2xl">
            {/* Ambient internal light corner blooms */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C59B6D]/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sage/30 blur-3xl"
            />

            <CardContent className="p-0 relative z-10">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#DFBA73] animate-pulse" />
                <Badge
                  variant="outline"
                  className="font-mono text-xs uppercase tracking-[0.25em] text-[#DFBA73] border-[#C59B6D]/40 bg-[#C59B6D]/10 font-medium rounded-full py-1 px-3.5"
                >
                  3 Daqiqalik Tezkor Diagnostika
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-[-0.02em] leading-[1.15] text-cream">
                Muammodan yechimga: Ichki holatingizni aniqlang
              </h1>

              <p className="mt-4 text-lg sm:text-xl text-[#DFBA73] font-medium font-serif italic">
                Sizni nima bezovta qilayotganini aniqlab, individual yechim xaritasini oling
              </p>

              <p className="mt-4 text-sm sm:text-base text-[#D0D9D4] font-normal leading-relaxed max-w-xl">
                4 ta qisqa savol orqali holatingizni tahlil qiling. Test yakunida aynan sizning vaziyatingizga mos terapiya tavsiyasi beriladi.
              </p>

              {/* Quick 3-metric reassurance strip */}
              <div className="grid grid-cols-3 gap-3 my-8 pt-6 border-t border-white/10">
                <div>
                  <span className="block font-mono text-xs text-[#A3B8AE] uppercase tracking-wider">
                    Savollar
                  </span>
                  <span className="font-serif text-lg sm:text-2xl text-cream font-medium">
                    {totalQuestions} ta
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-[#A3B8AE] uppercase tracking-wider">
                    Vaqt
                  </span>
                  <span className="font-serif text-lg sm:text-2xl text-cream font-medium">
                    2 daqiqa
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-[#A3B8AE] uppercase tracking-wider">
                    Maxfiylik
                  </span>
                  <span className="font-serif text-lg sm:text-2xl text-[#DFBA73] font-medium">
                    100% Sir
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleStart}
                className="group relative overflow-hidden inline-flex items-center justify-between gap-6 w-full sm:w-auto bg-[#DFBA73] hover:bg-[#C59B6D] text-[#142820] px-9 py-6 text-xs uppercase tracking-[0.18em] font-bold transition-all duration-300 rounded-full cursor-pointer shadow-[0_4px_25px_rgba(223,186,115,0.35)] active:scale-[0.98]"
              >
                <span>Diagnostikani boshlash</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold">
                  →
                </span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ================= STEP 2: QUESTIONS (Dark-Emerald Sanctuary Container) ================= */}
        {step === "questions" && currentQuestion && (
          <div className="bg-[#142820] text-cream border border-[#C59B6D]/30 rounded-[28px] p-6 sm:p-12 shadow-[0_25px_60px_rgba(10,25,18,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] relative overflow-hidden backdrop-blur-2xl transition-all">
            {/* Top progress and back row */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <button
                type="button"
                onClick={handleBackQuestion}
                className="font-mono text-xs uppercase tracking-[0.16em] text-[#A3B8AE] hover:text-cream transition-colors cursor-pointer inline-flex items-center gap-2 py-1"
                aria-label={t("backAction")}
              >
                <span>←</span>
                <span>{t("backAction")}</span>
              </button>

              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#DFBA73] font-medium">
                {currentIdx + 1} / {totalQuestions} SAVOL
              </span>
            </div>

            {/* Accessible Glowing Champagne-Gold Progress Bar */}
            <div className="relative mb-8">
              <Progress
                value={((currentIdx + 1) / totalQuestions) * 100}
                className="h-2.5 bg-white/10 border border-[#C59B6D]/30 [&>div]:bg-gradient-to-r [&>div]:from-[#C59B6D] [&>div]:to-[#DFBA73] [&>div]:shadow-[0_0_14px_rgba(223,186,115,0.6)]"
              />
            </div>

            {/* Question Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-cream leading-snug tracking-[-0.01em] mb-8 min-h-[58px]">
              {currentQuestion.title[locale] || currentQuestion.title.uz}
            </h2>

            {/* Answer Options */}
            <div
              role="radiogroup"
              aria-label={currentQuestion.title[locale] || currentQuestion.title.uz}
              className="space-y-3.5"
            >
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentIdx] === option.points;
                const letter = ["A", "B", "C", "D"][optIdx];

                return (
                  <div
                    key={optIdx}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelectOption(option.points)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectOption(option.points);
                      }
                    }}
                    className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 outline-none select-none active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#23473A] border-[#DFBA73] text-white shadow-[0_8px_25px_rgba(223,186,115,0.3)] ring-1 ring-[#DFBA73]"
                        : "bg-[#1B352B]/70 hover:bg-[#1B352B] border-white/10 hover:border-[#DFBA73]/60 text-cream hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                      <span
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-mono text-xs transition-colors border ${
                          isSelected
                            ? "bg-[#DFBA73] text-[#142820] border-[#DFBA73] font-bold shadow-[0_0_12px_rgba(223,186,115,0.5)]"
                            : "bg-[#142820] border-white/15 text-[#DFBA73] group-hover:border-[#DFBA73]/40"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed font-normal text-cream">
                        {option.text[locale] || option.text.uz}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#DFBA73] bg-[#DFBA73]/20"
                          : "border-white/20 group-hover:border-[#DFBA73]/40"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DFBA73] shadow-[0_0_8px_#DFBA73]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: LEAD FORM (With Anonymous Switch & Contact Choice) ================= */}
        {step === "lead" && (
          <div className="bg-[#142820] text-cream border border-[#C59B6D]/30 rounded-[28px] p-6 sm:p-12 shadow-[0_25px_60px_rgba(10,25,18,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] relative overflow-hidden backdrop-blur-2xl transition-all">
            <button
              type="button"
              onClick={handleBackFromLead}
              className="font-mono text-xs uppercase tracking-[0.16em] text-[#A3B8AE] hover:text-cream transition-colors cursor-pointer inline-flex items-center gap-2 mb-6 py-1"
            >
              <span>←</span>
              <span>{t("backAction")}</span>
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#DFBA73] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#DFBA73] font-medium">
                4 / 4 TUGALLANDI · TAHLIL TAYYOR
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-cream leading-snug tracking-[-0.01em] mb-2">
              Natijangiz va shaxsiy tavsiyangiz tayyor
            </h2>

            <p className="text-sm text-[#D0D9D4] font-normal leading-relaxed mb-6">
              Natijani ochish va saqlab qolish uchun aloqa vositasini tanlang.
            </p>

            {/* Hook #1: Anonymous Mode Switch inside Mini-Test */}
            <div className="bg-[#1B352B]/80 border border-[#C59B6D]/30 p-4 rounded-2xl mb-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="text-xs font-semibold text-cream tracking-wide">
                      Anonim yozilish (Ism shart emas)
                    </p>
                    <p className="text-[11px] text-[#A3B8AE]">
                      Shaxsingiz 100% sir saqlanadi
                    </p>
                  </div>
                </div>
                <Switch
                  id="quiz-anonymous-toggle"
                  checked={isAnonymous}
                  onCheckedChange={handleAnonymousToggle}
                  className="data-[state=checked]:bg-[#DFBA73] data-[state=unchecked]:bg-white/20"
                />
              </div>

              {isAnonymous && (
                <div className="mt-3 pt-3 border-t border-white/10 animate-in fade-in duration-300">
                  <Badge
                    variant="outline"
                    className="bg-[#DFBA73]/10 text-[#DFBA73] border-[#DFBA73]/30 text-[11px] font-normal py-1 px-3 flex items-center gap-1.5 rounded-full w-full justify-center"
                  >
                    <span>✨</span>
                    <span>Sizning shaxsingiz 100% maxfiy saqlanadi. Taxallusingiz bilan murojaat qilinadi.</span>
                  </Badge>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitLead} noValidate className="space-y-6">
              {/* Anti-spam Honeypot */}
              <input
                type="text"
                name="b_address"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Name / Nickname Input */}
              <div>
                <label
                  htmlFor="quiz-name"
                  className="font-mono text-xs uppercase tracking-[0.16em] text-cream font-medium block mb-2"
                >
                  {isAnonymous ? "Taxallus (masalan: Mehmon)" : "Ismingiz"}{" "}
                  {!isAnonymous && <span className="text-[#DFBA73]">*</span>}
                </label>
                <Input
                  id="quiz-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) {
                      setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder={isAnonymous ? "Mehmon yoki ixtiyoriy taxallus" : "Ismingizni kiriting"}
                  disabled={isSubmitting}
                  className="w-full bg-[#1B352B]/60 border-white/20 h-12 px-4 py-3.5 text-sm text-cream placeholder:text-[#A3B8AE]/60 focus:border-[#DFBA73] focus:ring-1 focus:ring-[#DFBA73] rounded-xl"
                />
                {formErrors.name && (
                  <p className="font-mono text-xs text-rose-400 mt-1.5">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Contact Method Selection (Phone or Telegram) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-[0.16em] text-cream font-medium block">
                    Bog&apos;lanish uchun <span className="text-[#DFBA73]">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-[11px] font-mono">
                    <button
                      id="quiz-toggle-phone"
                      type="button"
                      onClick={() => setContactMethod("phone")}
                      className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                        contactMethod === "phone" ? "bg-[#DFBA73] text-[#142820] font-bold" : "text-[#D0D9D4]"
                      }`}
                    >
                      Telefon
                    </button>
                    <button
                      id="quiz-toggle-telegram"
                      type="button"
                      onClick={() => setContactMethod("telegram")}
                      className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                        contactMethod === "telegram" ? "bg-[#DFBA73] text-[#142820] font-bold" : "text-[#D0D9D4]"
                      }`}
                    >
                      Telegram
                    </button>
                  </div>
                </div>

                {contactMethod === "phone" ? (
                  <div>
                    <Input
                      id="quiz-phone"
                      type="tel"
                      autoComplete="tel"
                      value={displayPhone}
                      onChange={handlePhoneInputChange}
                      placeholder="+998 90 123 45 67"
                      disabled={isSubmitting}
                      className="w-full bg-[#1B352B]/60 border-white/20 h-12 px-4 py-3.5 text-sm text-cream placeholder:text-[#A3B8AE]/60 focus:border-[#DFBA73] focus:ring-1 focus:ring-[#DFBA73] rounded-xl font-mono"
                    />
                    {formErrors.phone && (
                      <p className="font-mono text-xs text-rose-400 mt-1.5">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Input
                      id="quiz-telegram"
                      type="text"
                      value={telegramHandle}
                      onChange={(e) => {
                        setTelegramHandle(e.target.value);
                        if (formErrors.telegramHandle) {
                          setFormErrors((prev) => ({ ...prev, telegramHandle: undefined }));
                        }
                      }}
                      placeholder="@username yoki telefon raqamingiz"
                      disabled={isSubmitting}
                      className="w-full bg-[#1B352B]/60 border-white/20 h-12 px-4 py-3.5 text-sm text-cream placeholder:text-[#A3B8AE]/60 focus:border-[#DFBA73] focus:ring-1 focus:ring-[#DFBA73] rounded-xl font-mono"
                    />
                    {formErrors.telegramHandle && (
                      <p className="font-mono text-xs text-rose-400 mt-1.5">
                        {formErrors.telegramHandle}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Consultation Format Preference */}
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.16em] text-cream font-medium block mb-2">
                  Ma&apos;qul qabul formati <span className="text-[#DFBA73]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { value: "Toshkent 5/5 oflayn", label: "Toshkent (Oflayn 5/5)", sub: "Shinam kabinetda" },
                    { value: "Onlayn video", label: "Onlayn Video", sub: "Zoom yoki Telegram" },
                  ].map((opt) => {
                    const isSelected = companySize === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCompanySize(opt.value)}
                        disabled={isSubmitting}
                        className={`py-3.5 px-3 font-mono text-xs transition-all rounded-xl text-center cursor-pointer flex flex-col items-center justify-center gap-1 border active:scale-[0.98] ${
                          isSelected
                            ? "bg-[#DFBA73] border-[#DFBA73] text-[#142820] font-bold shadow-[0_4px_16px_rgba(223,186,115,0.35)]"
                            : "bg-[#1B352B]/60 border-white/15 text-[#D0D9D4] hover:text-white hover:border-[#DFBA73]/50"
                        }`}
                      >
                        <span className="font-medium text-xs tracking-wider">
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-sans ${isSelected ? "text-[#142820]/90 font-medium" : "text-[#A3B8AE]"}`}>
                          {opt.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-4">
                <Button
                  id="quiz-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden inline-flex items-center justify-between gap-6 w-full sm:w-auto bg-[#DFBA73] hover:bg-[#C59B6D] disabled:opacity-50 text-[#142820] px-9 py-6 text-xs uppercase tracking-[0.18em] font-bold transition-all duration-300 rounded-full cursor-pointer shadow-[0_4px_25px_rgba(223,186,115,0.35)] active:scale-[0.98]"
                >
                  <span>
                    {isSubmitting ? "Tahlil qilinmoqda..." : "Shaxsiy Natijani Ko'rish"}
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold">
                    →
                  </span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 4: DYNAMIC PERSONALIZED RESULT CARD (Hook #3) ================= */}
        {step === "result" && (
          <Card className="bg-[#142820] text-cream border border-[#C59B6D]/30 rounded-[28px] p-6 sm:p-12 shadow-[0_25px_60px_rgba(10,25,18,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] relative overflow-hidden backdrop-blur-2xl transition-all">
            <CardContent className="p-0">
              {/* Header kicker & personalized greeting */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DFBA73] animate-pulse" />
                  <Badge
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-[0.22em] text-[#DFBA73] border-[#C59B6D]/40 bg-[#C59B6D]/10 font-medium rounded-full py-1 px-3.5"
                  >
                    Shaxsiy Diagnostika Natijasi
                  </Badge>
                </div>
                <span className="font-serif italic text-sm text-[#DFBA73]">
                  {isAnonymous
                    ? "Anonim Mehmon uchun tahlil"
                    : name.trim()
                    ? `${name.trim()} uchun individual tahlil`
                    : "Shaxsiy diagnostika"}
                </span>
              </div>

              {/* Empathetic Highlight Callout Box based on Q1 */}
              <div className="p-5 sm:p-6 mb-8 rounded-2xl bg-[#1B352B]/80 border border-[#C59B6D]/30 flex items-start gap-4 shadow-sm">
                <span className="text-2xl shrink-0 mt-0.5">🕊️</span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-cream leading-snug">
                    {diagnosticEmpathy}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D0D9D4] mt-2 leading-relaxed">
                    Har qanday holat — bu sizning ojizligingiz emas, balki hayotingizda yangi, sog&apos;lomroq bosqich boshlanishining ishorasidir.
                  </p>
                </div>
              </div>

              {/* Problem-to-Solution Tailored Service Recommendation Card */}
              <div className="border border-[#DFBA73]/40 bg-gradient-to-br from-[#1B352B]/90 to-[#142820] rounded-2xl p-6 sm:p-8 mb-8 shadow-md">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#DFBA73] font-bold block mb-2">
                  Aynan siz uchun moslashtirilgan yo&apos;nalish:
                </span>
                <h2 id="quiz-result-recommendation" className="text-2xl sm:text-3xl font-serif text-cream tracking-[-0.01em] leading-snug mb-3">
                  {diagnosticService}
                </h2>
                <p className="text-sm text-[#D0D9D4] leading-relaxed">
                  {diagnosticAction}. Birinchi seansdayoq vaziyatning tub sabablari aniqlanib, ruhiy yengillik va aniq harakatlar rejasi shakllantiriladi.
                </p>
              </div>

              {/* Confidentiality reminder */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 mb-8">
                <span className="text-lg">🔒</span>
                <span className="text-xs text-[#A3B8AE]">
                  Sizning javoblaringiz va murojaatingiz to&apos;liq maxfiy saqlanadi. Suhbat davomida barcha ma&apos;lumotlar shaxsiy sir hisoblanadi.
                </span>
              </div>

              {/* Action Buttons: 1-Click Telegram Direct, Booking Page & Retake */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                {/* Direct 1-Click Telegram Chat with Dinna Mirzabayeva */}
                <Button
                  asChild
                  className="flex-1 bg-[#DFBA73] hover:bg-[#C59B6D] text-[#142820] font-bold px-7 py-6 text-xs uppercase tracking-[0.16em] rounded-full shadow-[0_6px_25px_rgba(223,186,115,0.35)] active:scale-[0.98]"
                >
                  <a
                    href={`${contactConfig.telegram.url}?text=${encodeURIComponent(
                      `Salom Dinna! Men 3 daqiqalik testdan o'tdim (${diagnosticService}). Konsultatsiyaga yozilmoqchiman.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
                    </svg>
                    <span className="font-semibold">Dinna bilan Telegramda bog&apos;lanish</span>
                    <span>→</span>
                  </a>
                </Button>

                {/* Secondary CTA: Booking Page */}
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent hover:bg-white/10 text-cream border-white/25 hover:border-[#DFBA73] px-6 py-6 text-xs uppercase tracking-[0.14em] font-medium rounded-full active:scale-[0.98]"
                >
                  <Link href="/bron">
                    <span>Vaqtni belgilash</span>
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRetake}
                  className="text-[#A3B8AE] hover:text-white border border-white/15 hover:border-white/30 px-5 py-6 text-xs uppercase tracking-[0.14em] font-medium rounded-full active:scale-[0.98]"
                >
                  <span>Qaytadan o&apos;tish</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
