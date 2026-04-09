import { z } from "zod";

export const userBookSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  userId: z.uuid(),
  status: z.enum(["want_to_read", "reading", "read", "dnf"]),
  rating: z.number().min(1).max(5).optional().nullable(),
  review: z.string().optional().nullable(),
  startedAt: z.date().optional().nullable(),
  finishedAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getUserBooksSchema = z.object({
  userId: z.uuid(),
});

export type UserBook = z.infer<typeof userBookSchema>;
