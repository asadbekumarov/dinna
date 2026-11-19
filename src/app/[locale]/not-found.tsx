import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream text-charcoal flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white border border-[#E5DFD6] rounded-2xl shadow-sm">
        <span className="font-serif text-6xl font-light text-[#C49A6C] tracking-tight block">
          404
        </span>
        <div>
          <h2 className="font-serif text-2xl font-normal text-charcoal">
            Sahifa topilmadi
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6660] font-light mt-2 leading-relaxed">
            Siz qidirayotgan sahifa ko‘chirilgan yoki mavjud emas.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild className="px-6 rounded-full bg-sage hover:bg-sage-hover text-white">
            <Link href="/">
              Bosh sahifaga qaytish
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
