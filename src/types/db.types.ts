export type BookRow = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  cover_id: number | null;
  created_at: string | null;
};

export type UserRow = {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserBookRow = {
  id: string;
  book_id: string;
  user_id: string;
  status: "want_to_read" | "reading" | "read" | "dnf";
  rating: number | null;
  review: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
