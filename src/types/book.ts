/**
 * Book Types
 */

export type OpenLibraryBook = {
  isbn?: string[];
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  // add more later
};

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  // add more later
};
