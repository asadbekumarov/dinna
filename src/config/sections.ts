/**
 * Sahifadagi bo'limlar ketma-ketligi va dinamik raqamlash konfiguratsiyasi.
 * Barcha bo'lim raqamlari ushbu tartib bo'yicha avtomatik 01.. dan boshlab ketma-ket generatsiya qilinadi.
 */

export const PAGE_SECTIONS = [
  "services",
  "stages",
  "expert",
  "media",
  "book",
  "faq",
  "contact",
] as const;

export type SectionKey = (typeof PAGE_SECTIONS)[number];

export function getSectionNumber(key: SectionKey): string {
  const index = PAGE_SECTIONS.indexOf(key);
  if (index === -1) return "";
  const num = index + 1;
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatSectionKicker(_key: SectionKey, title: string): string {
  return title.replace(/^\d{2}\s*\/\s*/, "").trim();
}
