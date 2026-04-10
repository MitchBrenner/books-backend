import type { Request, Response } from "express";
import {
  createUserBookService,
  getUserBooksByUserIdService,
} from "../services/userBooksService.js";
import {
  createUserBookSchema,
  userIdParamsSchema,
} from "../schemas/userBookSchema.js";
import { z } from "zod";

export async function getUserBooksByUserId(
  req: Request<{ userId: string }>,
  res: Response,
) {
  const params = req.params;

  const result = userIdParamsSchema.safeParse(params);

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

export async function createUserBook(
  req: Request<{ userId: string }>,
  res: Response,
) {
  const params = req.params;
  const body = req.body;

  const paramsResult = userIdParamsSchema.safeParse(params);

  if (!paramsResult.success) {
    return res.status(400).json({
      code: "INVALID_PARAMS",
      message: "Invalid User ID",
      details: z.flattenError(paramsResult.error),
    });
  }

  const result = createUserBookSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_BODY",
      message: "Invalid body",
      details: z.flattenError(result.error),
    });
  }

  await createUserBookService(paramsResult.data.userId, result.data);

  return res.status(201).json({ message: "Successfully added book" });
}
