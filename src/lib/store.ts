/** LibraAI application-state data layer.
 *
 * One source of truth for the whole app. Borrow/return logic keeps
 * availability counts correct by construction. This module is intentionally
 * the ONLY file that changes when the real Supabase backend is connected.
 */

import type { Book, BorrowRecord, BorrowStatus } from "./types";

export type BookInput = Omit<Book, "id">;

/** ---------- Seed catalog (kept tiny; matches college CS/IT syllabus) ---------- */

let nextId = 1;
const id = (prefix: string) => `${prefix}-${nextId++}`;

const seedBooks: BookInput[] = [
  {
    title: "Python Crash Course",
    author: "Eric Matthes",
    genre: "Programming",
    level: "Beginner",
    availableCopies: 3,
    totalCopies: 5,
    shelfLocation: "A1-01",
    description:
      "A hands-on, project-based introduction to programming with Python — ideal for first-semester students.",
  },
  {
    title: "Automate the Boring Stuff with Python",
    author: "Al Sweigart",
    genre: "Programming",
    level: "Beginner",
    availableCopies: 2,
    totalCopies: 4,
    shelfLocation: "A1-02",
    description:
      "Practical Python automation: file handling, spreadsheets, web scraping and everyday task scripting.",
  },
  {
    title: "Machine Learning Yearning",
    author: "Andrew Ng",
    genre: "Artificial Intelligence",
    level: "Intermediate",
    availableCopies: 2,
    totalCopies: 2,
    shelfLocation: "B2-04",
    description:
      "Strategy guide for structuring machine learning projects, from problem framing to model iteration.",
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    genre: "Artificial Intelligence",
    level: "Advanced",
    availableCopies: 1,
    totalCopies: 3,
    shelfLocation: "B2-01",
    description:
      "The standard university text on AI: search, logic, planning, reasoning and modern ML approaches.",
  },
  {
    title: "The Linux Command Line",
    author: "William Shotts",
    genre: "Operating Systems",
    level: "Beginner",
    availableCopies: 4,
    totalCopies: 6,
    shelfLocation: "C1-03",
    description:
      "A complete introduction to the Linux shell — commands, scripting, permissions and system tools.",
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    genre: "Databases",
    level: "Intermediate",
    availableCopies: 2,
    totalCopies: 4,
    shelfLocation: "D1-05",
    description:
      "Core database theory and practice: relational models, SQL, normalization, transactions and recovery.",
  },
  {
    title: "Computer Networking: A Top-Down Approach",
    author: "Kurose & Ross",
    genre: "Networking",
    level: "Intermediate",
    availableCopies: 0,
    totalCopies: 2,
    shelfLocation: "C2-02",
    description:
      "Application-first tour of networking: HTTP, TCP/IP, routing, link layers and wireless networks.",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Software Engineering",
    level: "Advanced",
    availableCopies: 3,
    totalCopies: 3,
    shelfLocation: "E1-01",
    description:
      "Principles, patterns and practices for writing readable, maintainable professional software.",
  },
];

const seedRecords: Array<{
  bookIdx: number;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
}> = [
  // An active loan due in 6 days
  { bookIdx: 0, borrowedAt: "-9d", dueAt: "+6d", returnedAt: undefined },
  // A loan due in 2 days (will show as active/due-soon)
  { bookIdx: 1, borrowedAt: "-12d", dueAt: "+2d", returnedAt: undefined },
  // An overdue loan (due 3 days ago, not returned)
  { bookIdx: 6, borrowedAt: "-24d", dueAt: "-3d", returnedAt: undefined },
  // A returned loan
  { bookIdx: 4, borrowedAt: "-30d", dueAt: "-16d", returnedAt: "-18d" },
];

/** ---------- Store implementation ---------- */

function relativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

function computeStatus(rec: BorrowRecord): BorrowStatus {
  if (rec.returnedAt) return "returned";
  const due = new Date(rec.dueAt).getTime();
  const now = Date.now();
  if (now > due) return "overdue";
  if (now > due - 3 * 24 * 60 * 60 * 1000) return "due-soon";
  return "active";
}

function computeAvailableCopies(book: Book, records: BorrowRecord[]): number {
  const active = records.filter(
    (r) => r.bookId === book.id && !r.returnedAt
  ).length;
  return Math.max(0, book.totalCopies - active);
}

class LibraryStore {
  private books: Book[] = [];
  private records: BorrowRecord[] = [];
  private listeners = new Set<() => void>();

  constructor() {
    this.books = seedBooks.map((b) => ({ ...b, id: id("book") }));

    this.records = seedRecords.map((r) => ({
      id: id("rec"),
      bookId: this.books[r.bookIdx].id,
      studentId: "local-student",
      bookTitle: this.books[r.bookIdx].title,
      bookAuthor: this.books[r.bookIdx].author,
      borrowedAt: relativeDate(parseInt(r.borrowedAt, 10)),
      dueAt: relativeDate(parseInt(r.dueAt, 10)),
      returnedAt: r.returnedAt ? relativeDate(parseInt(r.returnedAt, 10)) : undefined,
      status: "active" as BorrowStatus,
    }));

    // Fix derived fields against the seeded state
    this.records.forEach((r) => {
      r.status = computeStatus(r);
      const book = this.books.find((b) => b.id === r.bookId);
      if (book) {
        book.availableCopies = computeAvailableCopies(book, this.records);
      }
    });
  }

  /** --- subscriptions (used by the React hook) --- */

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit() {
    this.listeners.forEach((l) => l());
  }

  /** --- queries --- */

  // Arrow properties so the methods stay bound when passed directly to
  // `useSyncExternalStore` as client/server snapshot getters.
  getBooks = (): Book[] => {
    return this.books;
  };

  getBook(id: string): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  getRecords(studentId: string): BorrowRecord[] {
    return this.records.filter((r) => r.studentId === studentId);
  }

  getAllRecords = (): BorrowRecord[] => {
    return this.records;
  };

  /** Catalog search across title, author and genre. */
  searchBooks(query: string, genre?: string, level?: string): Book[] {
    const q = query.trim().toLowerCase();
    return this.books.filter((b) => {
      const matchesQuery =
        q === "" ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q);
      const matchesGenre = !genre || genre === "all" || b.genre === genre;
      const matchesLevel = !level || level === "all" || b.level === level;
      return matchesQuery && matchesGenre && matchesLevel;
    });
  }

  getGenres(): string[] {
    return [...new Set(this.books.map((b) => b.genre))].sort();
  }

  getLevels(): string[] {
    return ["Beginner", "Intermediate", "Advanced"].filter((l) =>
      this.books.some((b) => b.level === l)
    );
  }

  /** --- mutations --- */

  addBook(input: BookInput): Book {
    const book: Book = { ...input, id: id("book") };
    this.books.push(book);
    this.emit();
    return book;
  }

  updateBook(id: string, patch: Partial<BookInput>): Book | undefined {
    const book = this.books.find((b) => b.id === id);
    if (!book) return undefined;
    Object.assign(book, patch);
    this.emit();
    return book;
  }

  deleteBook(id: string): boolean {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.books.splice(idx, 1);
    this.emit();
    return true;
  }

  /** Borrow one copy of a book. Throws on invalid state so the UI can show why. */
  borrow(bookId: string, studentId: string): BorrowRecord {
    const book = this.books.find((b) => b.id === bookId);
    if (!book) throw new Error("Book not found.");
    if (book.availableCopies <= 0) {
      throw new Error("No copies available right now.");
    }
    if (
      this.records.some(
        (r) => r.bookId === bookId && r.studentId === studentId && !r.returnedAt
      )
    ) {
      throw new Error("You already have an active loan for this book.");
    }

    const loanDays = 14;
    const rec: BorrowRecord = {
      id: id("rec"),
      bookId,
      studentId,
      bookTitle: book.title,
      bookAuthor: book.author,
      borrowedAt: new Date().toISOString(),
      dueAt: relativeDate(loanDays),
      returnedAt: undefined,
      status: "active",
    };
    this.records.push(rec);
    book.availableCopies -= 1;
    this.emit();
    return rec;
  }

  /** Return a book: finds the caller's active loan and closes it. */
  returnBook(bookId: string, studentId: string): BorrowRecord {
    const rec = this.records.find(
      (r) => r.bookId === bookId && r.studentId === studentId && !r.returnedAt
    );
    if (!rec) throw new Error("No active loan found for this book.");

    rec.returnedAt = new Date().toISOString();
    rec.status = computeStatus(rec);

    const book = this.books.find((b) => b.id === bookId);
    if (book) book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    this.emit();
    return rec;
  }

  /** Explicitly refresh derived status fields (e.g. on app focus). */
  refreshStatuses() {
    this.records.forEach((r) => {
      r.status = computeStatus(r);
    });
    this.emit();
  }
}

/** Singleton store for the session. */
export const store = new LibraryStore();

export { computeStatus, computeAvailableCopies };
