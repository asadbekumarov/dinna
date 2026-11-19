import { ReactNode } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/config/siteConfig";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dinna Mirzabayeva | Psixolog va Mualliflik Treninglari",
  description:
    "Toshkentda oflayn (5/5 manzili) va dunyo bo'ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari. Dinna Mirzabayeva (@m1rzabayevaa_021).",
  openGraph: {
    title: "Dinna Mirzabayeva | Psixolog va Mualliflik Treninglari",
    description:
      "Toshkentda oflayn (5/5) va dunyo bo'ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari.",
    type: "website",
    url: SITE_URL,
    siteName: "Dinna Mirzabayeva",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        secureUrl: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Dinna Mirzabayeva",
      },
    ],
  },  
  twitter: {
    card: "summary_large_image",
    title: "Dinna Mirzabayeva | Psixolog va Mualliflik Treninglari",
    description:
      "Toshkentda oflayn (5/5) va dunyo bo'ylab onlayn individual psixologik konsultatsiyalar hamda mualliflik treninglari.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
