import type { Request, Response } from "express";
import {
  getAllBooksService,
  getBookByIdService,
  getBooksByQueryServer,
} from "../services/bookService.js";

export async function getAllBooks(req: Request, res: Response) {
  const books = await getAllBooksService();
  res.status(200).json(books);
}

export async function getBookById(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!id) {
    throw new Error("Book Id required");
  }

  const book = await getBookByIdService(id);

  res.status(200).json(book);
}

export async function getBooksByQuery(req: Request, res: Response) {
  const { q } = req.query;

  if (typeof q !== "string") {
    res.status(400).json({ error: "Query param q must be a string" });
    return;
  }

  const books = await getBooksByQueryServer(q);
  res.status(200).json(books);
}
