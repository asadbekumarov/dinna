import { z } from "zod";

// Phone number matches Uzbekistan format (+998 followed by 9 digits)
export const phoneRegex = /^\+998\d{9}$/;

export const applySchema = z
  .object({
    name: z
      .string()
      .trim()
      .max(60, { message: "Ism 60 ta belgidan oshmasligi kerak" })
      .optional()
      .or(z.literal("")),
    isAnonymous: z.boolean().optional(),
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
    telegramHandle: z
      .string()
      .trim()
      .max(60)
      .optional()
      .or(z.literal("")),
    format: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),
    preferredDay: z
      .string()
      .trim()
      .max(60)
      .optional()
      .or(z.literal("")),
    preferredTime: z
      .string()
      .trim()
      .max(60)
      .optional()
      .or(z.literal("")),
    business: z
      .string()
      .trim()
      .max(120)
      .optional()
      .or(z.literal("")),
    companySize: z
      .string()
      .trim()
      .max(60)
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .trim()
      .max(300)
      .optional()
      .or(z.literal("")),
    question: z
      .string()
      .trim()
      .max(1000, { message: "Savol 1000 ta belgidan oshmasligi kerak" })
      .optional()
      .or(z.literal("")),
    service: z.string().trim().max(120).optional(),
    locale: z.string().trim().max(10).optional(),
    pageUrl: z.string().trim().max(300).optional(),
    honeypot: z.string().optional(),
  });

export type ApplyFormData = z.infer<typeof applySchema>;
