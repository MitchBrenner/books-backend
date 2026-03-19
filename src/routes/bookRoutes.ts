import { Router } from "express";
import { getAllBooks } from "../controllers/bookController.js";

const router = Router();

router.get("/", getAllBooks);

export default router;
