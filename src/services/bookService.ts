import { supabase } from "../lib/supabase.js";
import type { Book } from "../schemas/bookSchema.js";
import type { BookRow } from "../types/db.types.js";

function toBook(book: BookRow): Book {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    coverUrl: book.cover_url,
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
    const books = await searchGoogleBooks(query);

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

const SUMMARY_PATTERN =
  /\b(summary|study guide|analysis|workbook|companion|unofficial|notes|review of|young reader)\b/i;
const INSTITUTIONAL_AUTHOR_PATTERN =
  /\(state\)|\bdepartment\b|\bbureau\b|\blegislature\b|\bboard\b|\bcommittee\b|\bcommission\b/i;
const MIN_PAGES = 50;
const MIN_YEAR = 1950;

async function searchGoogleBooks(query: string): Promise<BookRow[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const encodedQuery = encodeURIComponent(`${query} intitle:"${query}"`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=40&printType=books&langRestrict=en&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch books from Google Books: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!data.items) return [];

  const seen = new Set<string>();
  const candidates: Array<BookRow & { ratingsCount: number }> = [];

  for (const item of data.items) {
    const info = item.volumeInfo;
    const title: string = info.title ?? "Unknown";
    const author: string = info.authors?.[0] ?? "Unknown";
    const pages: number | null = info.pageCount ?? null;

    const identifiers: { type: string }[] = info.industryIdentifiers ?? [];
    if (!identifiers.some((i) => i.type === "ISBN_13")) continue;
    if (SUMMARY_PATTERN.test(title)) continue;
    if (INSTITUTIONAL_AUTHOR_PATTERN.test(author)) continue;
    if (pages !== null && pages < MIN_PAGES) continue;

    const year = info.publishedDate
      ? parseInt(info.publishedDate.substring(0, 4))
      : null;
    if (year !== null && year < MIN_YEAR) continue;

    const key = `${title.toLowerCase()}|${author.toLowerCase()}|${year}`;
    if (seen.has(key)) continue;
    seen.add(key);

    candidates.push({
      id: item.id,
      title,
      author,
      year: year && !isNaN(year) ? year : null,
      cover_url: info.imageLinks?.thumbnail ?? null,
      pages,
      created_at: null,
      ratingsCount: info.ratingsCount ?? 0,
    });
  }

  return candidates
    .sort((a, b) => b.ratingsCount - a.ratingsCount)
    .slice(0, 10)
    .map(({ ratingsCount: _, ...book }) => book);
}
