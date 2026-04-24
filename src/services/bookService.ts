import { supabase } from "../lib/supabase.js";
import type { Book } from "../schemas/bookSchema.js";
import type { BookRow } from "../types/db.types.js";

function toBook(book: BookRow): Book {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    coverId: book.cover_id,
    pages: book.pages,
  };
}

export async function getAllBooksService(): Promise<Book[]> {
  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    throw new Error("Failed to fetch books");
  }

  const books: BookRow[] = data ?? [];

  return books.map((book) => toBook(book));
}

export async function getBookByIdService(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch book");
  }

  return data ? toBook(data as BookRow) : null;
}

export async function getBooksByQueryService(query: string): Promise<Book[]> {
  // first check our db
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .ilike("title", `%${query}%`);

  if (error) {
    throw new Error("Failed to fetch books");
  }

  // if we don't have the book check open library & add to our db
  if (data.length === 0) {
    const books = await getBooksByQueryFromExternal(query);

    // add to our db only if query is meaningful
    if (query.length >= 3) {
      const { error } = await supabase.from("books").upsert(books);
      if (error) {
        // silently fail -> this does not affect the user
        console.error(error);
      }
    }

    return books.map((book) => toBook(book));
  } else {
    const books: BookRow[] = data ?? [];

    return books.map((book) => toBook(book));
  }
}

async function getBooksByQueryFromExternal(query: string): Promise<BookRow[]> {
  const fields = "key,title,author_name,first_publish_year,cover_i,number_of_pages_median";
  const response = await fetch(
    `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&fields=${fields}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch books from OpenLibrary: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // map data
  return data.docs
    .filter((book: any) =>
      book.title?.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 10)
    .map((book: any) => ({
      id: book.key.replace("/works/", ""),
      title: book.title,
      author: book.author_name?.[0] ?? "Unknown",
      year: book.first_publish_year ?? null,
      cover_id: book.cover_i ?? null,
      pages: book.number_of_pages_median ?? null,
    }));
}
