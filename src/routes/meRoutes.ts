import { Router } from "express";
import {
  deleteMyBook,
  getMyBooks,
  saveBookToMyShelf,
  updateMyBook,
} from "../controllers/userBooksController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/books", requireAuth, getMyBooks);
router.post("/books", requireAuth, saveBookToMyShelf);
router.patch("/books/:userBookId", requireAuth, updateMyBook);
router.delete("/books/:userBookId", requireAuth, deleteMyBook);

export default router;
