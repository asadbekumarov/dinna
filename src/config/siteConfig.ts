import { contactConfig } from "./contact";

const getBaseUrl = (): string => {
  // 1. Explicit custom domain from environment (e.g. when custom domain is mapped)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, "");
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (process.env.SITE_URL) {
    const url = process.env.SITE_URL.trim().replace(/\/$/, "");
    return url.startsWith("http") ? url : `https://${url}`;
  }
  // 2. Public production domain (do not use VERCEL_URL as it points to SSO-protected preview hashes)
  return "https://dinna-psixologiya.vercel.app";
};

export const SITE_URL = getBaseUrl();

export const siteConfig = {
  name: "Dinna Mirzabayeva",
  title: "Dinna Mirzabayeva | Psixolog & Shaxsiy Rivojlanish Treneri",
  description:
    "Toshkentda oflayn (5/5) va dunyo bo'ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/og-image.png`,

  contact: {
    phone: contactConfig.phone.display,
    phoneClean: contactConfig.phone.clean,
    email: contactConfig.email.address,
    address: contactConfig.office.addressUz,
    workingHours: "Dush - Shan: 10:00 - 19:00",
  },

  socials: {
    telegram: contactConfig.telegramDirect.url,
    telegramChannel: contactConfig.telegramChannel.url,
    telegramDirect: contactConfig.telegramDirect.url,
    instagram: contactConfig.instagram.url,
    youtube: contactConfig.youtube.url,
    linkedin: contactConfig.linkedin.url,
  },

  navLinks: [
    { href: "#xizmatlar", labelKey: "services" },
    { href: "#bosqichlar", labelKey: "methodology" },
    { href: "#ekspert", labelKey: "expert" },
    { href: "#natijalar", labelKey: "media" },
    { href: "#faq", labelKey: "faq" },
    { href: "#aloqa", labelKey: "contact" },
  ],
};
