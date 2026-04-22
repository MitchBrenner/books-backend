import { Router } from "express";
import { getUserBooksByUserId } from "../controllers/userBooksController.js";

const router = Router();

router.get("/:userId/books", getUserBooksByUserId);

export default router;
