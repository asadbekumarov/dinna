"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream text-charcoal flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white border border-[#E5DFD6] rounded-2xl shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-normal text-charcoal">
            Kutilmagan xatolik yuz berdi
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6660] font-light mt-2 leading-relaxed">
            Sahifani yuklashda xatolik ro‘y berdi. Iltimos, qaytadan urinib ko‘ring.
          </p>
        </div>
        <div className="pt-2">
          <Button onClick={() => reset()} className="px-6 rounded-full bg-sage hover:bg-sage-hover text-white">
            Qayta yuklash
          </Button>
        </div>
      </div>
    </div>
  );
}
