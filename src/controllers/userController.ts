import type { Request, Response } from "express";
import { createUserSchema } from "../schemas/userSchema.js";
import { createUserService } from "../services/userService.js";
import { z } from "zod";

export async function createUser(req: Request, res: Response) {
  const body = req.body;

  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_PARAMS",
      message: "Invalid request parameters",
      details: z.flattenError(result.error),
    });
  }

  await createUserService(result.data);

  res.status(201).json({ message: "User created" });
}
