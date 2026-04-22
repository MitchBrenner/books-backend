import type { NextFunction, Request, Response } from "express";

import { supabase } from "../lib/supabase.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Missing Authorization header",
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Authorization header must use Bearer token format",
    });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid or expired access token",
    });
  }

  req.user = user;

  next();
}
