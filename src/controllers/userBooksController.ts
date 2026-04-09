import type { Request, Response } from "express";
import { getUserBooksByUserIdService } from "../services/userBooksService.js";
import { getUserBooksSchema } from "../schemas/userBookSchema.js";
import { z } from "zod";

export async function getUserBooksByUserId(
  req: Request<{ userId: string }>,
  res: Response,
) {
  const params = req.params;

  const result = getUserBooksSchema.safeParse(params);

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_PARAMS",
      message: "Invalid User ID",
      details: z.flattenError(result.error),
    });
  }

  const books = await getUserBooksByUserIdService(result.data?.userId);

  res.status(200).json(books);
}
