import type { ApplyFormData } from "../schemas/applySchema";

interface TelegramSendResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Sends a structured consultation application lead to Telegram channel for Dinna Mirzabayeva.
 * Uses environment variables TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.
 */
export async function sendTelegramLead(
  lead: ApplyFormData,
  clientIp?: string
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[Telegram Service] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID. Skipping Telegram dispatch in dev mode."
    );
    return {
      success: true, // Don't block application submission in dev mode
    };
  }

  const timestamp = new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

  const cleanText = (str?: string) =>
    (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const isTrainingLead =
    lead.service?.toLowerCase().includes("trening") ||
    lead.service?.toLowerCase().includes("тренинг") ||
    lead.service?.toLowerCase().includes("training") ||
    lead.service?.toLowerCase().includes("dastur");

  const localeStr = lead.locale ? lead.locale.toUpperCase() : "UZ";
  const sourceStr = lead.pageUrl ? ` · ${cleanText(lead.pageUrl)}` : "";

  const isAnonymous = Boolean(lead.isAnonymous);
  const clientName = isAnonymous
    ? `${cleanText(lead.name) || "Mehmon"} 🔒 [ANONIM MUROJAAT]`
    : cleanText(lead.name || "Mijoz");

  const contactLine = lead.telegramHandle
    ? `✈️ <b>Telegram:</b> ${cleanText(lead.telegramHandle)}`
    : `📞 <b>Telefon:</b> <code>${cleanText(lead.phone || "Ko'rsatilmagan")}</code>`;

  const slotLine =
    lead.preferredDay || lead.preferredTime
      ? `🕒 <b>Tanlangan vaqt:</b> ${cleanText(lead.preferredDay || "Yaqin kunlarda")} · ${cleanText(lead.preferredTime || "Kelishiladi")}`
      : null;

  const formatLine = lead.format
    ? `📍 <b>Format:</b> ${cleanText(lead.format)}`
    : `📍 <b>Format:</b> ${cleanText(lead.business || lead.companySize || "Toshkent 5/5 yoki Onlayn")}`;

  const message = isTrainingLead
    ? [
        `🌿 <b>YANGI ARIZA | MUALLIFLIK TRENINGI</b>`,
        isAnonymous ? `🔒 <b>[ANONIM MUROJAAT]</b>` : null,
        `━━━━━━━━━━━━━━━━━━━━`,
        `👤 <b>Mijoz:</b> ${clientName}`,
        contactLine,
        lead.phone && lead.telegramHandle ? `📞 <b>Telefon:</b> <code>${cleanText(lead.phone)}</code>` : null,
        `📍 <b>Shahar / Joylashuv:</b> ${cleanText(lead.address || "Ko'rsatilmagan")}`,
        lead.companySize
          ? `🎯 <b>Format:</b> ${cleanText(lead.companySize)}`
          : null,
        slotLine,
        lead.question
          ? `📝 <b>Izoh / Savol:</b>\n<i>${cleanText(lead.question)}</i>`
          : null,
        `🌐 <b>Til / Manba:</b> ${localeStr}${sourceStr}`,
        `🕒 <b>Vaqt:</b> ${timestamp} (Toshkent vaqti)`,
        clientIp ? `🌐 <b>IP:</b> <code>${clientIp}</code>` : null,
        `━━━━━━━━━━━━━━━━━━━━`,
        `🔒 <i>Mijoz bilan shaxsiy va maxfiy bog'laning.</i>`,
      ]
        .filter(Boolean)
        .join("\n")
    : [
        `🌿 <b>YANGI KONSULTATSIYA ARIZASI — DINNA MIRZABAYEVA</b>`,
        isAnonymous ? `🔒 <b>[ANONIM MUROJAAT]</b>` : null,
        `━━━━━━━━━━━━━━━━━━━━`,
        `👤 <b>Mijoz:</b> ${clientName}`,
        contactLine,
        lead.phone && lead.telegramHandle ? `📞 <b>Telefon:</b> <code>${cleanText(lead.phone)}</code>` : null,
        formatLine,
        slotLine,
        `🎯 <b>Yo'nalish:</b> ${cleanText(lead.service || "Individual psixologik konsultatsiya")}`,
        lead.question
          ? `💭 <b>Murojaat sababi / Savol:</b>\n<i>${cleanText(lead.question)}</i>`
          : null,
        `🌐 <b>Til / Manba:</b> ${localeStr}${sourceStr}`,
        `🕒 <b>Vaqt:</b> ${timestamp} (Toshkent vaqti)`,
        clientIp ? `🌐 <b>IP:</b> <code>${clientIp}</code>` : null,
        `━━━━━━━━━━━━━━━━━━━━`,
        `🔒 <i>100% maxfiylik kafolatlangan.</i>`,
      ]
        .filter(Boolean)
        .join("\n");

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Telegram HTTP error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown Telegram dispatch error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
