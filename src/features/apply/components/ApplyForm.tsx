"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";

interface ApplyFormProps {
  onSuccess: () => void;
  selectedService?: string | null;
  isBook?: boolean;
}

export function ApplyForm({ onSuccess, selectedService }: ApplyFormProps) {
  const t = useTranslations("applyModal");
  const locale = useLocale();

  // Anonymous switch state (Hook #1)
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Smart slot & format states (Hook #2)
  const [format, setFormat] = useState<"Toshkent (Oflayn • 5/5)" | "Onlayn (Video-aloqa)">(
    "Toshkent (Oflayn • 5/5)"
  );
  const [preferredDay, setPreferredDay] = useState<string>("Ertaga");
  const [preferredTime, setPreferredTime] = useState<string>("14:00");

  const [contactMethod, setContactMethod] = useState<"phone" | "telegram">("phone");
  const [telegramHandle, setTelegramHandle] = useState<string>("");

  const [formData, setFormData] = useState<ApplyFormData>({
    name: "",
    phone: "+998",
    telegramHandle: "",
    format: "Toshkent (Oflayn • 5/5)",
    preferredDay: "Ertaga",
    preferredTime: "14:00",
    business: "Toshkent (Oflayn • 5/5)",
    companySize: "Toshkent (Oflayn • 5/5)",
    address: "",
    question: "",
    service: selectedService || undefined,
    locale,
    pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    honeypot: "",
    isAnonymous: false,
  });

  const [displayPhone, setDisplayPhone] = useState("+998 ");

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        service: selectedService,
      }));
    }
  }, [selectedService]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData((prev) => ({
        ...prev,
        locale,
        pageUrl: window.location.href,
      }));
    }
  }, [locale]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setDisplayPhone(formatted);
    const cleaned = cleanUzbekPhone(formatted);
    setFormData((prev) => ({ ...prev, phone: cleaned }));
    if (errors.phone) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const handleChange = (field: keyof ApplyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAnonymousToggle = (checked: boolean) => {
    setIsAnonymous(checked);
    setFormData((prev) => ({
      ...prev,
      isAnonymous: checked,
      name: checked && !prev.name ? "Mehmon" : prev.name,
    }));
    if (errors.name) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const submissionData: ApplyFormData = {
      ...formData,
      isAnonymous,
      name: isAnonymous ? (formData.name?.trim() || "Anonim Mehmon") : formData.name?.trim(),
      format,
      preferredDay,
      preferredTime,
      telegramHandle: telegramHandle.trim(),
      business: format,
      companySize: `${format} (${preferredDay} ${preferredTime})`,
    };

    // Validation
    const newErrors: Record<string, string> = {};

    if (!isAnonymous && (!submissionData.name || submissionData.name.length < 2)) {
      newErrors.name = "Iltimos, ismingizni kiriting";
    }

    if (contactMethod === "phone") {
      if (!isUzbekPhoneComplete(displayPhone)) {
        newErrors.phone = "Iltimos, to'liq telefon raqamingizni kiriting (+998 (XX) XXX-XX-XX)";
      }
    } else {
      if (!telegramHandle || telegramHandle.length < 3) {
        newErrors.telegramHandle = "Iltimos, Telegram @username yoki telefoningizni kiriting";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = applySchema.safeParse(submissionData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
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
        throw new Error(data.error || "Arizani yuborishda xatolik yuz berdi");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot anti-spam field */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot || ""}
        onChange={(e) => handleChange("honeypot", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {serverError && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 text-xs rounded-xl">
          {serverError}
        </div>
      )}

      {/* ================= HOOK #1: ANONIM MUROJAAT (ANONYMOUS MODE SWITCH) ================= */}
      <div className="bg-[#142820]/5 border border-[#C59B6D]/30 p-3.5 sm:p-4 rounded-2xl transition-all duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🔒</span>
            <div>
              <p className="text-xs font-semibold text-charcoal tracking-wide">
                Anonim yozilish (Ism shart emas)
              </p>
              <p className="text-[11px] text-[#5C6660]">
                O&apos;zingizni erkin his qiling — to&apos;liq maxfiylik
              </p>
            </div>
          </div>
          <Switch
            id="anonymous-toggle"
            checked={isAnonymous}
            onCheckedChange={handleAnonymousToggle}
            className="data-[state=checked]:bg-sage data-[state=unchecked]:bg-[#E5DFD6]"
          />
        </div>

        {isAnonymous && (
          <div className="mt-3 pt-3 border-t border-[#C59B6D]/20 animate-in fade-in slide-in-from-top-1 duration-300">
            <Badge
              variant="outline"
              className="bg-sage/10 text-sage border-sage/30 text-[11px] font-normal py-1 px-3 flex items-center gap-1.5 rounded-full w-full justify-center"
            >
              <span>✨</span>
              <span>Sizning shaxsingiz 100% sir saqlanadi. Taxallusdan foydalanishingiz mumkin.</span>
            </Badge>
          </div>
        )}
      </div>

      {/* ================= HOOK #2: SMART TIME-SLOT & FORMAT PICKER ================= */}
      <div className="space-y-3.5 bg-white border border-[#E5DFD6] p-4 sm:p-5 rounded-2xl shadow-sm">
        {/* Step A: Format Selector */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#5C6660] font-mono block mb-2 font-semibold">
            1. Uchrashuv formati:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: "Toshkent (Oflayn • 5/5)",
                title: "Toshkent (Oflayn 5/5)",
                desc: "Shaxsiy kabinetda",
                icon: "🌿",
              },
              {
                id: "Onlayn (Video-aloqa)",
                title: "Onlayn Video",
                desc: "Zoom / Telegram",
                icon: "💻",
              },
            ].map((item) => {
              const isSelected = format === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id as typeof format)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1 active:scale-[0.98] ${
                    isSelected
                      ? "bg-sage text-cream border-sage shadow-md ring-1 ring-sage"
                      : "bg-cream text-charcoal border-[#E5DFD6] hover:border-sage/40 hover:bg-[#F2EFE9]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold leading-tight">{item.title}</span>
                    <span className="text-xs">{item.icon}</span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#5C6660]"}`}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step B: Preferred Day & Time */}
        <div className="pt-2 border-t border-[#E5DFD6]/80">
          <label className="text-[11px] uppercase tracking-wider text-[#5C6660] font-mono block mb-2 font-semibold">
            2. Sizga qulay kun va vaqt oralig&apos;i:
          </label>

          {/* Day Pills */}
          <div className="flex flex-wrap gap-2 mb-2.5">
            {["Ertaga", "Indinga", "Shu hafta oxiri"].map((day) => {
              const isSelected = preferredDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setPreferredDay(day)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-[0.97] ${
                    isSelected
                      ? "bg-[#C59B6D] text-white shadow-sm ring-1 ring-[#C59B6D]"
                      : "bg-[#F2EFE9] text-charcoal hover:bg-[#E5DFD6]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time Slot Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {["11:00", "14:00", "16:30", "19:00"].map((time) => {
              const isSelected = preferredTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setPreferredTime(time)}
                  className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer active:scale-[0.97] text-center border ${
                    isSelected
                      ? "bg-[#142820] text-[#DFBA73] border-[#DFBA73] shadow-sm"
                      : "bg-cream text-charcoal border-[#E5DFD6] hover:border-[#142820]/40"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= STEP C: CONTACT & IDENTITY ================= */}
      <div className="space-y-3.5">
        {/* Name / Nickname Input */}
        <div>
          <label htmlFor="apply-name" className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block mb-1.5">
            {isAnonymous ? "Taxallus (masalan: Mehmon)" : t("nameLabel")}{" "}
            {!isAnonymous && <span className="text-sage">*</span>}
          </label>
          <Input
            id="apply-name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={isAnonymous ? "Mehmon yoki istalgan taxallus" : t("namePlaceholder")}
            disabled={isSubmitting}
            className="w-full bg-white border-[#E5DFD6] px-4 py-3 h-11 text-sm text-charcoal placeholder:text-[#5C6660]/60 focus:border-sage focus:ring-2 focus:ring-sage/20 rounded-xl"
          />
          {errors.name && (
            <span className="text-xs text-red-500 font-mono mt-1 block">
              {errors.name}
            </span>
          )}
        </div>

        {/* Contact Method Selector (Phone or Telegram) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block">
              Bog&apos;lanish uchun <span className="text-sage">*</span>
            </label>
            <div className="flex items-center gap-1 bg-[#F2EFE9] p-0.5 rounded-lg text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setContactMethod("phone")}
                className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                  contactMethod === "phone" ? "bg-white text-charcoal shadow-xs font-semibold" : "text-[#5C6660]"
                }`}
              >
                Telefon
              </button>
              <button
                type="button"
                onClick={() => setContactMethod("telegram")}
                className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                  contactMethod === "telegram" ? "bg-white text-charcoal shadow-xs font-semibold" : "text-[#5C6660]"
                }`}
              >
                Telegram @username
              </button>
            </div>
          </div>

          {contactMethod === "phone" ? (
            <div>
              <Input
                id="apply-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={displayPhone}
                onChange={handlePhoneChange}
                placeholder="+998 (90) 123-45-67"
                disabled={isSubmitting}
                className={`w-full bg-white border h-11 px-4 py-3 text-sm text-charcoal placeholder:text-[#5C6660]/60 rounded-xl font-mono ${
                  errors.phone ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#E5DFD6] focus:border-sage focus:ring-2 focus:ring-sage/20"
                }`}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 font-mono mt-1 block">
                  {errors.phone}
                </span>
              )}
            </div>
          ) : (
            <div>
              <Input
                id="apply-telegram"
                type="text"
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
                className={`w-full bg-white border h-11 px-4 py-3 text-sm text-charcoal placeholder:text-[#5C6660]/60 rounded-xl font-mono ${
                  errors.telegramHandle ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#E5DFD6] focus:border-sage focus:ring-2 focus:ring-sage/20"
                }`}
              />
              {errors.telegramHandle && (
                <span className="text-xs text-red-500 font-mono mt-1 block">
                  {errors.telegramHandle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Question / Short Note */}
        <div>
          <label htmlFor="apply-question" className="text-xs uppercase tracking-wider text-[#5C6660] font-mono block mb-1.5">
            Qisqa izoh yoki bezovta qilayotgan holat (ixtiyoriy)
          </label>
          <Textarea
            id="apply-question"
            rows={2}
            value={formData.question || ""}
            onChange={(e) => handleChange("question", e.target.value)}
            placeholder="Masalan: Uyqusizlik, munosabatlardagi kelishmovchilik yoki doimiy zo'riqish..."
            disabled={isSubmitting}
            className="w-full bg-white border-[#E5DFD6] px-4 py-3 text-sm text-charcoal placeholder:text-[#5C6660]/60 focus:border-sage focus:ring-2 focus:ring-sage/20 rounded-xl resize-none"
          />
        </div>
      </div>

      {/* Submit Button (shadcn Button) */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sage hover:bg-sage-hover text-cream py-6 text-xs uppercase tracking-[0.16em] font-semibold rounded-full transition-all shadow-[0_6px_25px_rgba(46,90,68,0.28)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span>Yuborilmoqda...</span>
          ) : (
            <>
              <span>Vaqtni band qilish</span>
              <span>→</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
