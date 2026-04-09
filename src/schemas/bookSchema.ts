/**
 * Zod validation
 */

import { z } from "zod";

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  year: z.number().optional().nullable(),
  coverId: z.number().optional().nullable(),
});

export const searchBooksSchema = z.object({
  q: z.string().min(1),
});

export const getBookParamsSchema = z.object({
  id: z.string().min(1),
});

export type Book = z.infer<typeof bookSchema>;
