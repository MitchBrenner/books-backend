import { supabase } from "../lib/supabase.js";
import type {
  CreateUserInput,
  User,
} from "../schemas/userSchema.js";
import type { UserRow } from "../types/db.types.js";

function toUserRow(user: CreateUserInput) {
  return {
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
  };
}

function toUser(user: UserRow): User {
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name ?? undefined,
    lastName: user.last_name ?? undefined,
  };
}

export async function createUserService(user: CreateUserInput) {
  const { error } = await supabase.from("users").insert(toUserRow(user));

  if (error) {
    throw new Error("Failed to create user");
  }
}

export async function getUserByUsernameService(
  username: string,
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch user");
  }

  return data ? toUser(data as UserRow) : null;
}
