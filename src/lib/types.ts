/** Shared application-wide types. Data types will be extended in later phases
 * to match the Supabase schema exactly. */

/** Book availability state shown in the UI. */
export type AvailabilityStatus = "available" | "borrowed" | "unavailable";

/** Borrow record lifecycle state shown in the UI. */
export type BorrowStatus =
  | "active"
  | "due-soon"
  | "overdue"
  | "returned";

/** A catalog book as rendered by BookCard. Fields become required once the
 * database is connected in a later phase. */
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  /** Academic level the book targets, e.g. "Beginner" | "Intermediate" | "Advanced". */
  level: string;
  /** Number of copies currently on the shelf. */
  availableCopies: number;
  /** Total copies owned by the library. */
  totalCopies: number;
  /** Physical shelf location, e.g. "A3-12". */
  shelfLocation: string;
  description?: string;
  coverUrl?: string;
}

/** A borrowing record as rendered in history tables. Fields become required
 * once the database is connected in a later phase. */
export interface BorrowRecord {
  id: string;
  /** Id of the catalog book this loan refers to. */
  bookId: string;
  /** Id of the student who holds the loan. */
  studentId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  status: BorrowStatus;
}
