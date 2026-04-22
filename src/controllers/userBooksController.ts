import type { Request, Response } from "express";
import {
  getUserBooksByUserIdService,
  saveBookToUserShelfService,
} from "../services/userBooksService.js";
import {
  createUserBookSchema,
  userIdParamsSchema,
} from "../schemas/userBookSchema.js";
import { z } from "zod";

function getAuthenticatedUserId(req: Request, res: Response): string | null {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Authenticated user not found on request",
    });

    return null;
  }

  return userId;
}

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

export async function getMyBooks(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req, res);

  if (!userId) {
    return;
  }

  const books = await getUserBooksByUserIdService(userId);

  return res.status(200).json(books);
}

export async function saveBookToMyShelf(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req, res);

  if (!userId) {
    return;
  }

  const result = createUserBookSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_BODY",
      message: "Invalid body",
      details: z.flattenError(result.error),
    });
  }

  await saveBookToUserShelfService(userId, result.data);

  return res.status(201).json({ message: "Successfully added book" });
}
