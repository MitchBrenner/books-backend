import type { Request, Response } from "express";
import {
  getAllBooksService,
  getBookByIdService,
  getBooksByQueryServer,
} from "../services/bookService.js";
import type {
  GetBookParamsDto,
  SearchBooksQueryDto,
} from "../types/bookDtos.js";

export async function getAllBooks(req: Request, res: Response) {
  const books = await getAllBooksService();
  res.status(200).json(books);
}

export async function getBookById(
  req: Request<GetBookParamsDto>,
  res: Response,
) {
  const { id } = req.params;

  if (!id) {
    throw new Error("Book Id required");
  }

  const book = await getBookByIdService(id);

  res.status(200).json(book);
}

export async function getBooksByQuery(
  req: Request<{}, {}, {}, SearchBooksQueryDto>,
  res: Response,
) {
  const { q } = req.query;

  if (q === "") {
    throw new Error("Query search is required");
  }

  const books = await getBooksByQueryServer(q);
  res.status(200).json(books);
}
