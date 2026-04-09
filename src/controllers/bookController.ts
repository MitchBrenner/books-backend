import type { Request, Response } from "express";
import {
  getAllBooksService,
  getBookByIdService,
  getBooksByQueryService,
} from "../services/bookService.js";
import type {
  GetBookParamsDto,
  SearchBooksQueryDto,
} from "../types/bookDtos.js";
import {
  getBookParamsSchema,
  searchBooksSchema,
} from "../schemas/bookSchema.js";
import { z } from "zod";

export async function getAllBooks(req: Request, res: Response) {
  const books = await getAllBooksService();
  res.status(200).json(books);
}

export async function getBookById(
  req: Request<GetBookParamsDto>,
  res: Response,
) {
  const params = req.params;

  const result = getBookParamsSchema.safeParse(params);

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_PARAMS",
      message: "Invalid request parameters",
      details: z.flattenError(result.error),
    });
  }

  const book = await getBookByIdService(result.data.id);

  if (book === null) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Book not found",
    });
  }

  res.status(200).json(book);
}

export async function getBooksByQuery(
  req: Request<{}, {}, {}, SearchBooksQueryDto>,
  res: Response,
) {
  const { q } = req.query;

  const result = searchBooksSchema.safeParse({ q });

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_PARAMS",
      message: "Invalid request parameters",
      details: z.flattenError(result.error),
    });
  }

  const books = await getBooksByQueryService(result.data.q);
  res.status(200).json(books);
}
