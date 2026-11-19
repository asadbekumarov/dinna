import { z } from "zod";

export const phoneRegex = /^\+998\d{9}$/;

export const quizSubmissionSchema = z.object({
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
  companySize: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal("")),
  answers: z
    .array(
      z
        .number()
        .int()
        .min(0, { message: "Ball kamida 0 bo'lishi kerak" })
        .max(3, { message: "Ball ko'pi bilan 3 bo'lishi kerak" })
    )
    .min(4, { message: "Barcha savollarga javob berilishi kerak" })
    .max(10),
  locale: z.string().trim().max(10).optional(),
  pageUrl: z.string().trim().max(300).optional(),
  honeypot: z.string().optional(),
});

export type QuizSubmissionData = z.infer<typeof quizSubmissionSchema>;
