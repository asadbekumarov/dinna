"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uz">
      <body className="bg-cream text-charcoal font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6 p-8 bg-white border border-border rounded-2xl shadow-card">
            <h2 className="font-serif text-2xl font-normal text-charcoal">
              Tizim xatoligi yuz berdi
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-2 leading-relaxed">
              Kutilmagan xatolik yuz berdi. Iltimos, sahifani qayta yuklang.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => reset()}
                className="bg-sage hover:bg-sage-hover text-cream font-medium px-6 py-3 uppercase tracking-wider text-xs rounded-full transition-colors cursor-pointer min-h-[44px]"
              >
                Qayta yuklash
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
