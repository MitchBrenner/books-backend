/**
 * Book Types
 */

export type OpenLibraryBook = {
  isbn?: string[];
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  cover_id: number | null;
};
