import { supabase } from "../lib/supabase.js";
import type { CreateUserInput } from "../schemas/userSchema.js";

function toUserRow(user: CreateUserInput) {
  return {
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
  };
}

export async function createUserService(user: CreateUserInput) {
  const { error } = await supabase.from("users").insert(toUserRow(user));

  if (error) {
    throw new Error("Failed to create user");
  }
}
