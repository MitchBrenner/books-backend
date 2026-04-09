import { Router } from "express";
import { createUser } from "../controllers/userController.js";
import { getUserBooksByUserId } from "../controllers/userBooksController.js";

const router = Router();

router.post("/", createUser);
router.get("/:userId/books", getUserBooksByUserId);

export default router;
