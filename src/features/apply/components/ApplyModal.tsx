"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { ApplyForm } from "./ApplyForm";
import { contactConfig } from "@/config/contact";
import { X } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: string | null;
}

export function ApplyModal({
  isOpen,
  onClose,
  selectedService,
}: ApplyModalProps) {
  const t = useTranslations("applyModal");
  const commonT = useTranslations("common");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const modalTitle = selectedService
    ? `${selectedService}`
    : t("title");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={modalTitle}
      className="!max-w-lg w-full p-6 sm:p-9 relative bg-cream border border-[#E5E0D8] rounded-2xl shadow-[0_25px_60px_rgba(46,90,68,0.15)] text-charcoal"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#E5E0D8]">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium block mb-1">
            Dinna Mirzabayeva
          </span>
          <h3 className="font-serif text-2xl text-charcoal">
            {modalTitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={commonT("close")}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isSuccess ? (
        <div className="py-2 text-left animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/10 rounded-full font-mono text-xs text-sage font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse shrink-0" />
            <span>{t("thankYouBadge")}</span>
          </div>

          <h4 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
            {t("thankYouTitle")}
          </h4>

          <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed mb-6">
            {t("thankYouBody")}
          </p>

          <div className="border-t border-b border-[#E5E0D8] py-4 mb-6 space-y-3 font-mono text-xs">
            <div className="flex items-start gap-2">
              <span className="text-sage shrink-0 font-bold">{t("timelineStep1Prefix")}</span>
              <span className="text-charcoal">{t("timelineStep1Text")}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#C59B6D] shrink-0 font-bold">{t("timelineStep2Prefix")}</span>
              <span className="text-[#5C6660]">{t("timelineStep2Text")}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#C59B6D] shrink-0 font-bold">{t("timelineStep3Prefix")}</span>
              <span className="text-[#5C6660]">{t("timelineStep3Text")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <a
              href={contactConfig.telegramChannel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={contactConfig.telegramChannel.ariaLabel}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sage hover:bg-sage-hover text-cream text-xs font-medium rounded-full transition-all cursor-pointer shadow-[0_4px_16px_rgba(46,90,68,0.25)]"
            >
              <span>{t("actionTelegram")}</span>
              <span>↗</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E5E0D8] hover:bg-[#F2EFE9] text-charcoal text-xs font-medium rounded-full transition-all cursor-pointer"
            >
              <span>{commonT("close")}</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <ApplyForm
            onSuccess={() => setIsSuccess(true)}
            selectedService={selectedService}
          />
        </div>
      )}
    </Modal>
  );
}
