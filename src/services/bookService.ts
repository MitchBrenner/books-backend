import { supabase } from "../lib/supabase.js";
import type { Book } from "../types/book.js";

export async function getAllBooksService(): Promise<Book[]> {
  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    throw new Error("Failed to fetch books");
  }

  return data;
}

export async function getBookByIdService(id: string): Promise<Book> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Failed to fetch book");
  }

  return data;
}

export async function getBooksByQueryService(q: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .ilike("title", `%${q}%`);

  if (error) {
    throw new Error("Failed to fetch books");
  }

  return data;
}
