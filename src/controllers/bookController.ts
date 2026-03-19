import type { Request, Response } from "express";
import { getAllBooksService } from "../services/bookService.js";

export async function getAllBooks(req: Request, res: Response) {
  const books = await getAllBooksService();
  res.status(200).json(books);
}
