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

export async function getBookByIdService(id: string) {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  const book = await response.json();

  return {
    id: id,
    title: book.title,
    author: book.author_name?.[0] ?? "uknown",
    year: book.first_publish_year ?? null,
  };
}

export async function getBooksByQueryServer(q: string) {
  const response = await fetch(`https://openlibrary.org/search.json?q=${q}`);

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();

  if (data.docs.length === 0) {
    return [];
  }

  return data.docs.slice(0, 10).map((book: any) => ({
    id: (book.isbn?.[0] ?? book.key).replace("/works/", ""),
    title: book.title,
    author: book.author_name?.[0] ?? "unknown",
    year: book.first_publish_year ?? null,
  }));
}
