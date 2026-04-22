import { supabase } from "../lib/supabase.js";
import type { CreateUserBook, UserBook } from "../schemas/userBookSchema.js";
import type { UserBookRow } from "../types/db.types.js";

export async function getUserBooksByUserIdService(
  userId: string,
): Promise<UserBook[]> {
  const { data, error } = await supabase
    .from("user_books")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to fetch user books");
  }

  const rows: UserBookRow[] = data ?? [];

  return rows.map((row: UserBookRow) => ({
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    status: row.status,
    rating: row.rating,
    review: row.review,
    startedAt: row.started_at ? new Date(row.started_at) : null,
    finishedAt: row.finished_at ? new Date(row.finished_at) : null,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  }));
}

export async function saveBookToUserShelfService(
  userId: string,
  userBook: CreateUserBook,
): Promise<void> {
  const { error } = await supabase.from("user_books").insert({
    user_id: userId,
    book_id: userBook.bookId,
    status: userBook.status,
    rating: userBook.rating,
    review: userBook.review,
    started_at: userBook.startedAt,
    finished_at: userBook.finishedAt,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (error) {
    throw new Error("Failed to add user book");
  }
}
