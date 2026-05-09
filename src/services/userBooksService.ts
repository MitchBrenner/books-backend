import { supabase, supabaseAdmin } from "../lib/supabase.js";
import { ValidationError } from "../lib/errors.js";
import type {
  CreateUserBook,
  UpdateUserBook,
  UserBook,
} from "../schemas/userBookSchema.js";
import type { UserBookRowWithBook } from "../types/db.types.js";

async function recalculateTotalPagesRead(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("user_books")
    .select(
      `
      *,
      books (
        pages
      )
    `,
    )
    .eq("user_id", userId);

  if (error) return;

  const rows: UserBookRowWithBook[] = data ?? [];

  const total = rows.reduce((sum, row) => {
    const pages = row.books?.pages ?? 0;
    if (row.status === "read") return sum + pages;
    if (row.status === "reading") return sum + (row.curr_page ?? 0);
    return sum;
  }, 0);

  await supabaseAdmin
    .from("profiles")
    .update({ total_pages_read: total })
    .eq("id", userId);
}

export async function getUserBooksByUserIdService(
  userId: string,
): Promise<UserBook[]> {
  const { data, error } = await supabase
    .from("user_books")
    .select(
      `
      *,
      books (
        id,
        title,
        subtitle,
        author,
        year,
        cover_url,
        pages,
        description,
        categories,
        google_rating
      )
    `,
    )
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to fetch user books");
  }

  const rows: UserBookRowWithBook[] = data ?? [];

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    status: row.status,
    rating: row.rating,
    review: row.review,
    currPage: row.curr_page,
    startedAt: row.started_at ? new Date(row.started_at) : null,
    finishedAt: row.finished_at ? new Date(row.finished_at) : null,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
    book: row.books
      ? {
          id: row.books.id,
          title: row.books.title,
          subtitle: row.books.subtitle,
          author: row.books.author,
          year: row.books.year,
          coverUrl: row.books.cover_url,
          pages: row.books.pages,
          description: row.books.description,
          categories: row.books.categories,
          googleRating: row.books.google_rating,
        }
      : undefined,
  }));
}

export async function updateUserBookService(
  userId: string,
  userBookId: string,
  data: UpdateUserBook,
): Promise<void> {
  if (data.currPage != null) {
    const { data: existing } = await supabase
      .from("user_books")
      .select("books(pages)")
      .eq("id", userBookId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages = (existing as any)?.books?.pages as number | null | undefined;
    if (pages != null && data.currPage > pages) {
      throw new ValidationError(
        `Current page (${data.currPage}) cannot exceed the book's total pages (${pages})`,
      );
    }
  }

  const { error } = await supabase
    .from("user_books")
    .update({
      status: data.status,
      rating: data.rating,
      review: data.review,
      curr_page: data.currPage,
      started_at: data.startedAt,
      finished_at: data.finishedAt,
      updated_at: new Date(),
    })
    .eq("id", userBookId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to update user book");
  }

  await recalculateTotalPagesRead(userId);
}

export async function deleteUserBookService(
  userId: string,
  userBookId: string,
): Promise<void> {
  const { error } = await supabase
    .from("user_books")
    .delete()
    .eq("id", userBookId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to delete user book");
  }

  await recalculateTotalPagesRead(userId);
}

export async function saveBookToUserShelfService(
  userId: string,
  userBook: CreateUserBook,
): Promise<{ id: string }> {
  if (userBook.currPage != null) {
    const { data: bookData } = await supabase
      .from("books")
      .select("pages")
      .eq("id", userBook.bookId)
      .single();

    if (bookData?.pages != null && userBook.currPage > bookData.pages) {
      throw new ValidationError(
        `Current page (${userBook.currPage}) cannot exceed the book's total pages (${bookData.pages})`,
      );
    }
  }

  const { data, error } = await supabase
    .from("user_books")
    .insert({
      user_id: userId,
      book_id: userBook.bookId,
      status: userBook.status,
      rating: userBook.rating,
      review: userBook.review,
      curr_page: userBook.currPage,
      started_at: userBook.startedAt,
      finished_at: userBook.finishedAt,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Failed to add user book");
  }

  await recalculateTotalPagesRead(userId);

  return { id: data.id };
}
