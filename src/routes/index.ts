import { Router } from "express";
import bookRoutes from "./bookRoutes.js";
import meRoutes from "./meRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/books", bookRoutes);
router.use("/me", meRoutes);
router.use("/users", userRoutes);

export default router;
