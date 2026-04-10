import { Router } from "express";
import { createUser, getUserByUsername } from "../controllers/userController.js";
import {
  createUserBook,
  getUserBooksByUserId,
} from "../controllers/userBooksController.js";

const router = Router();

router.get("/lookup", getUserByUsername);
router.post("/", createUser);
router.get("/:userId/books", getUserBooksByUserId);
router.post("/:userId/books", createUserBook);

export default router;
