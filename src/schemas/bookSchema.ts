/**
 * Zod validation
 */

import { z } from "zod";

export const searchBooksSchema = z.object({
  q: z.string().min(1),
});

export const getBookParamsSchema = z.object({
  id: z.string().min(1),
});
