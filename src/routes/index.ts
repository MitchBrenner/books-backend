import { Router } from "express";
import bookRoutes from "./bookRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/books", bookRoutes);
router.use("/users", userRoutes);

export default router;
