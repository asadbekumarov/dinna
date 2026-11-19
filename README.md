# Dinna Mirzabayeva — Boutique Psychology & Mental Wellness Platform 🌿

> **Zamonaviy, xotirjam va yuqori konversiyali butik psixologiya platformasi.**  
> Dinna Mirzabayeva ([@m1rzabayevaa_021](https://t.me/m1rzabayevaa_021)) — Toshkentda oflayn (5/5 shinam kabinet) va butun dunyo bo‘ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari.

---

## 🏛️ Dizayn Falsafasi va Ranglar Tizimi (Mental Health UX)

Loyiha inson ruhiyatiga xotirjamlik beruvchi va ichki xavfsizlik (emotional safety) hissini uyg‘otuvchi sokin ranglar palitrasi asosida qurilgan:

- **Asosiy Fon (Warm Alabaster):** `#FAF8F5` / `#F7F4EF` — ko‘zga og‘irlik qilmaydigan, ipaksimon iliq fon.
- **Santuari Kontrasti (Velvety Emerald Charcoal):** `#142820` — luks, chuqur va vazmin qora-zumrad bloklar.
- **Brand Accent (Healing Sage Green):** `#2E5A44` (Hover: `#234735`) — ishonch, muvozanat va ruhiy shifo rangi.
- **Issiq Tilla Urg‘u (Brushed Champagne Gold):** `#C59B6D` / `#DFBA73` — shaxsiy e'tibor va iliqlik aksenti.
- **Tipografiya:** 
  - Sarlavhalar: `Cormorant Garamond` (elegant, empathetic serif)
  - Asosiy matn: `Plus Jakarta Sans` / `Inter` (o‘qishga qulay)
  - Belgilar va metrikalar: `JetBrains Mono`

---

## 🎯 3 Ta Yuqori Konversiyali Psixologik "Hook"

### 1. 🔒 "Anonim Murojaat" (Anonymous Mode Switch)
O‘zbekistondagi ko‘plab mijozlar andisha yoki ijtimoiy bosim sabab psixologga yozilishdan tortinishadi.
- Ariza formasi va test yakunida `shadcn/ui` **`Switch`** joylashtirilgan: *"🔒 Anonim yozilish (Ism shart emas)"*.
- Yoqilganda maydon avtomatik *"Taxallus (masalan: Mehmon)"* ga aylanadi va *"✨ Sizning shaxsingiz 100% sir saqlanadi"* nishoni ko‘rinadi.
- Telegram Botga xabar yuborilganda `[ANONIM MUROJAAT]` deb belgilanadi.

### 2. 📅 Smart Time-Slot & Format Picker
Mijoz bilan Telegramda vaqt kelishish uchun sarflanadigan soatlarni tejaydi va no-show holatlarini kamaytiradi:
- **A bosqich (Format):** `Toshkent (Oflayn • 5/5)` vs `Onlayn (Video-aloqa)`.
- **B bosqich (Kun & Vaqt):** *Ertaga*, *Indinga*, *Shu hafta oxiri* pillari hamda aniq soat tugmalari (*11:00*, *14:00*, *16:30*, *19:00*).
- **C bosqich (Aloqa):** Telefon raqam (`+998...`) yoki Telegram `@username` kiritish imkoniyati.

### 3. 🕊️ Pre-Qualifying Diagnostik Test (`/test`)
Vaqti bo‘sh foydalanuvchilarni saralab, mijozning haqiqiy muammosiga aniq yechim taklif qiladi:
- **Q1 (Asosiy og‘riq):** Stress va charchoq / Oila va munosabatlar / Ishonchsizlik va qo‘rquv / Maqsad va o‘sish.
- **Q2 (Davomiyligi):** Yaqinda boshlandi / Bir necha oydan beri / 1 yildan ortiq.
- **Q3 (Tayyorgarlik):** Tezroq yechim kerak / Dastlab 1 seansda sinab ko‘rmoqchiman.
- **Q4 (Format):** Toshkent 5/5 oflayn / Onlayn video.
- **Dinamik Natija Kartasi:** Q1 javobiga moslashtirilgan shaxsiy yo‘nalish (masalan: *Individual Antistress Terapiyasi*), chuqur empatiya tushuntirishi va 1-bosishda kontekstli xabar bilan Telegramga o‘tish tugmasi.

---

## 📱 Mobil Instagram Brauzer Moslashuvi

- **Qotirilgan Pastki Panel (`MobileStickyBar`):** Ekranni pastga surtganda paydo bo‘ladi va 1-bosishda testga yo‘naltiradi yoki band qilish panelini ochadi.
- **Moslashuvchan Modal / Drawer:** Kompyuterda markaziy `Dialog`, mobil Instagram yoki smartfon brauzerida esa pastdan chiquvchi **`Drawer`** (bottom sheet).
- **Zero Horizontal Overflow:** 360px–430px ekranlarda gorizontal siljish umuman yo‘q, `env(safe-area-inset-bottom)` to‘liq qo‘llab-quvvatlanadi.

---

## 🛠️ Texnologiyalar Staki

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Komponentlar:** [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
  - `Button`, `Card`, `Badge`, `Tabs`, `Dialog`, `Drawer` (`vaul`), `Switch`, `Progress`, `Input`, `Textarea`, `Accordion`
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Tailwind CSS Animate
- **Til qo‘llab-quvvatlashi:** [next-intl](https://next-intl-docs.vercel.app/) (O‘zbek `uz`, Rus `ru`, Ingliz `en`)
- **Validatsiya:** [Zod](https://zod.dev/)
- **Integratsiya:** Telegram Bot API (Arizalar va test natijalarini to‘g‘ridan-to‘g‘ri yopiq guruh/kanalga jo‘natish)
- **Avtomatlashtirilgan Testlar:** [Playwright Chromium](https://playwright.dev/)

---

## 📂 Loyiha Tuzilishi

```bash
psyholog/
├── public/
│   └── images/
│       └── hero/
│           └── dinna-portrait.jpg     # Dinna Mirzabayevaning rasmiy estetik portreti
├── src/
│   ├── app/
│   │   ├── [locale]/                  # Ko'p tilli sahifalar (uz, ru, en)
│   │   │   ├── page.tsx               # Asosiy sahifa
│   │   │   ├── bron/page.tsx          # Konsultatsiya vaqtini band qilish sahifasi
│   │   │   └── test/page.tsx          # 4-savolli diagnostik test sahifasi
│   │   └── api/
│   │       ├── apply/route.ts         # Konsultatsiya arizalarini Telegramga jo'natish
│   │       └── quiz/route.ts          # Test natijalarini hisoblash va Telegramga jo'natish
│   ├── components/
│   │   ├── layout/                    # Navbar, Footer, MobileStickyBar
│   │   ├── sections/                  # Hero, Services (Bento Grid), Stages, FAQ, Contact
│   │   └── ui/                        # shadcn/ui komponentlari (Button, Switch, Drawer va b.)
│   ├── config/
│   │   └── contact.ts                 # Dinnaning ijtimoiy tarmoq va kontakt sozlamalari
│   ├── features/
│   │   ├── apply/                     # Booking form, smart slot tanlagich va Telegram yuboruvchi
│   │   └── quiz/                      # 4 ta savol ma'lumotlari, diagnostik xarita va natijalar
│   └── lib/
│       ├── formatPhone.ts             # O'zbekiston telefon raqamlari maskasi (+998)
│       └── rateLimit.ts               # Spamlardan himoya qiluvchi Rate Limiter
├── test-suite.js                      # Playwright E2E avtomatlashtirilgan test skripti
└── package.json
```

---

## 🚀 Ishga Tushirish va O‘rnatish

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
# yoki
pnpm install
```

### 2. Muhit o‘zgaruvchilari (`.env.local`):
Loyihaning ildiz papkasida `.env.local` faylini yarating:
```env
# Telegram Bot Integratsiyasi
TELEGRAM_BOT_TOKEN="sizning_bot_tokeningiz"
TELEGRAM_CHAT_ID="sizning_chat_yoki_kanal_idingiz"

# Sayt domeni
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Dasturni dev-rejimda ishga tushirish:
```bash
npm run dev
```
Brauzerda oching: [http://localhost:3000](http://localhost:3000)

### 4. Ishlab chiqarish (Production) uchun yig‘ish:
```bash
npm run build
npm run start
```

---

## 🧪 Avtomatlashtirilgan Testlarni O‘tkazish (Playwright)

Loyiha to‘liq Playwright E2E test to‘plami bilan ta'minlangan. Desktop, Mini-Test va Mobil Instagram brauzeri rejimlarini avtomatik tekshirish uchun:

```bash
node test-suite.js
```

Test natijalari va skrinshotlar `test-artifacts/` papkasida avtomatik saqlanadi.

---

## 📄 Litsenziya

Barcha huquqlar himoyalangan © Dinna Mirzabayeva ([@m1rzabayevaa_021](https://t.me/m1rzabayevaa_021)).
