import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  getBooksByQuery,
} from "../controllers/bookController.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/search", getBooksByQuery);
router.get("/:id", getBookById);

export default router;
