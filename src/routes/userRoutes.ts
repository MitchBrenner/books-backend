import { Router } from "express";
import {
  createUserBook,
  getUserBooksByUserId,
} from "../controllers/userBooksController.js";

const router = Router();

router.get("/:userId/books", getUserBooksByUserId);
router.post("/:userId/books", createUserBook);

export default router;
