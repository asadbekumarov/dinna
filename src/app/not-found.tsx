import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="uz">
      <body className="bg-cream text-charcoal font-sans antialiased">
        <div className="min-h-screen bg-cream text-charcoal flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6 p-8 bg-white border border-border rounded-2xl shadow-card">
            <span className="font-serif text-6xl font-light text-terracotta-dark tracking-tight block">
              404
            </span>
            <div>
              <h2 className="font-serif text-2xl font-normal text-charcoal">
                Sahifa topilmadi
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-2 leading-relaxed">
                Siz qidirayotgan sahifa ko‘chirilgan yoki mavjud emas.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/uz"
                className="bg-sage hover:bg-sage-hover text-cream font-medium px-6 py-3 uppercase tracking-wider text-xs rounded-full inline-flex items-center justify-center transition-colors min-h-[44px]"
              >
                Bosh sahifaga qaytish
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
