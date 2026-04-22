import { Router } from "express";
import {
  getMyBooks,
  saveBookToMyShelf,
} from "../controllers/userBooksController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/books", requireAuth, getMyBooks);
router.post("/books", requireAuth, saveBookToMyShelf);

export default router;
