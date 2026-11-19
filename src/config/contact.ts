/**
 * Markazlashtirilgan aloqa ma'lumotlari - Dinna Mirzabayeva
 */

export interface TelegramAccount {
  handle: string;
  url: string;
  display: string;
  ariaLabel: string;
}

const buildTelegramAccount = (
  handleName: string,
  purpose: { uz: string; ru: string; en: string }
): TelegramAccount => {
  const cleanHandle = handleName.replace(/^@/, "");
  return {
    handle: cleanHandle,
    display: `@${cleanHandle}`,
    url: `https://t.me/${cleanHandle}`,
    ariaLabel: `Telegram (${cleanHandle}) - ${purpose.uz}`,
  };
};

export const contactConfig = {
  phone: {
    display: "+998 90 000 00 21",
    href: "tel:+998900000021",
    clean: "+998900000021",
    ariaLabel: "Telefon orqali bog'lanish",
  },
  // Rasmiy Telegram
  telegramChannel: buildTelegramAccount("m1rzabayevaa_021", {
    uz: "Rasmiy psixologik blog va yangiliklar",
    ru: "Официальный психологический блог",
    en: "Official psychology blog",
  }),
  // To'g'ridan-to'g'ri shaxsiy lichka
  telegramDirect: buildTelegramAccount("m1rzabayevaa_021", {
    uz: "To'g'ridan-to'g'ri shaxsiy aloqa va konsultatsiyaga yozilish",
    ru: "Прямая личная связь и запись на консультацию",
    en: "Direct personal contact and consultation booking",
  }),
  get telegram() {
    return this.telegramDirect;
  },
  instagram: {
    url: "https://www.instagram.com/m1rzabayevaa_021",
    handle: "@m1rzabayevaa_021",
    display: "@m1rzabayevaa_021",
    ariaLabel: "Dinna Mirzabayeva Instagram profili",
  },
  youtube: {
    url: "https://www.instagram.com/m1rzabayevaa_021",
    handle: "@m1rzabayevaa_021",
    display: "@m1rzabayevaa_021",
    ariaLabel: "Instagram profiliga o'tish",
  },
  linkedin: {
    url: "https://www.instagram.com/m1rzabayevaa_021",
    display: "Dinna Mirzabayeva",
    ariaLabel: "Dinna Mirzabayeva profili",
  },
  email: {
    address: "contact@dinnamirzabayeva.uz",
    href: "mailto:contact@dinnamirzabayeva.uz",
    ariaLabel: "Email orqali bog'lanish",
  },
  office: {
    hasExactAddress: true,
    addressUz: "Toshkent shahri, 5/5",
    addressRu: "г. Ташкент, 5/5",
    addressEn: "Tashkent, 5/5",
    landmarkUz: "Toshkent 5/5 (Oflayn qabul)",
    landmarkRu: "Ташкент 5/5 (Офлайн приём)",
    landmarkEn: "Tashkent 5/5 (In-person sessions)",
  },
};
