import z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(5, "Username must be greater than 5 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const lookupUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LookupUserInput = z.infer<typeof lookupUserSchema>;
