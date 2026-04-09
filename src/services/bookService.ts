import { supabase } from "../lib/supabase.js";
import type { Book } from "../types/book.js";

export async function getAllBooksService(): Promise<Book[]> {
  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    throw new Error("Failed to fetch books");
  }

  return data;
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

  return data;
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

    return books;
  } else {
    return data;
  }
}

async function getBooksByQueryFromExternal(query: string): Promise<Book[]> {
  const response = await fetch(
    `https://openlibrary.org/search.json?title=${encodeURIComponent(`${query}`)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
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
    }));
}
