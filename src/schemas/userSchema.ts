import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(5, "Username must be greater than 5 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
