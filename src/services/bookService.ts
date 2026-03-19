export async function getAllBooksService() {
  const response = await fetch("https://openlibrary.org/search.json?q=fiction");

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();

  return data.docs.slice(0, 10).map((book: any) => ({
    id: (book.isbn?.[0] ?? book.key).replace("/works/", ""),
    title: book.title,
    author: book.author_name?.[0] ?? "unknown",
    year: book.first_publish_year ?? null,
  }));
}
