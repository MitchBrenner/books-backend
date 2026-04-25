import { z } from "zod";
import { bookSchema } from "./bookSchema.js";

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
  book: bookSchema.optional(),
});

export const userIdParamsSchema = z.object({
  userId: z.uuid(),
});

export const createUserBookSchema = z.object({
  bookId: z.string(),
  status: z.enum(["want_to_read", "reading", "read", "dnf"]),
  rating: z.number().min(1).max(5).optional().nullable(),
  review: z.string().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  finishedAt: z.coerce.date().optional().nullable(),
});

export const updateUserBookSchema = z.object({
  status: z.enum(["want_to_read", "reading", "read", "dnf"]).optional(),
  rating: z.number().min(1).max(5).optional().nullable(),
  review: z.string().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  finishedAt: z.coerce.date().optional().nullable(),
});

export const userBookParamsSchema = z.object({
  userBookId: z.uuid(),
});

export type UserBook = z.infer<typeof userBookSchema>;
export type CreateUserBook = z.infer<typeof createUserBookSchema>;
export type UpdateUserBook = z.infer<typeof updateUserBookSchema>;
