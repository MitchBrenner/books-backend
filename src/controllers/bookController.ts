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
    return res.status(400).json({ error: result.error });
  }

  const book = await getBookByIdService(result.data.id);

  res.status(200).json(book);
}

export async function getBooksByQuery(
  req: Request<{}, {}, {}, SearchBooksQueryDto>,
  res: Response,
) {
  const { q } = req.query;

  const result = searchBooksSchema.safeParse({ q });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const books = await getBooksByQueryService(result.data.q);
  res.status(200).json(books);
}
