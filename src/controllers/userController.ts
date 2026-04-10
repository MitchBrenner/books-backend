import type { Request, Response } from "express";
import {
  createUserSchema,
  lookupUserSchema,
} from "../schemas/userSchema.js";
import {
  createUserService,
  getUserByUsernameService,
} from "../services/userService.js";
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

export async function getUserByUsername(
  req: Request<{}, {}, {}, { username?: string }>,
  res: Response,
) {
  const result = lookupUserSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      code: "INVALID_QUERY",
      message: "Invalid username query",
      details: z.flattenError(result.error),
    });
  }

  const user = await getUserByUsernameService(result.data.username);

  if (!user) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return res.status(200).json(user);
}
