import { Router } from "express";
import { createUser } from "../controllers/userController.js";
import {
  createUserBook,
  getUserBooksByUserId,
} from "../controllers/userBooksController.js";

const router = Router();

router.post("/", createUser);
router.get("/:userId/books", getUserBooksByUserId);
router.post("/:userId/books", createUserBook);

export default router;
