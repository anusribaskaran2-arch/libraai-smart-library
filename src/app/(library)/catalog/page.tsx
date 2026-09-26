"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import BookCard from "@/components/BookCard";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";
import { useLibrary } from "@/lib/use-library";
import type { Book } from "@/lib/types";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function CatalogPage() {
  const { books, searchBooks, borrow } = useLibrary();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [level, setLevel] = useState("all");
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre))].sort(), [books]);
  const results = useMemo(() => searchBooks(query, genre, level), [searchBooks, query, genre, level]);

  function handleBorrow(book: Book) {
    try {
      borrow(book.id, "local-student");
      setNotice({ ok: true, text: `Borrowed "${book.title}" — due in 14 days. See History.` });
    } catch (err) {
      setNotice({ ok: false, text: err instanceof Error ? err.message : "Borrow failed." });
    }
  }

  return (
    <>
      <PageHeader
        title="Book catalog"
        description="Search by title, author or genre; borrow available books instantly."
      />

      {notice && (
        <div
          role="status"
          className={
            notice.ok
              ? "mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {notice.text}
        </div>
      )}

      <section aria-label="Search and filters" className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author or genre…"
          className="w-full rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-slate-600 shadow-sm outline-none focus:border-primary-400"
          >
            <option value="all">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-slate-600 shadow-sm outline-none focus:border-primary-400"
          >
            <option value="all">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-slate-400">
            {results.length} book{results.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      <section aria-label="Books" className="mt-6 pb-4">
        {results.length === 0 ? (
          <EmptyState
            icon={<EmptyIcon kind="search" />}
            title="No books match your search"
            description="Try a different keyword, or clear the genre and level filters."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                borrowAction={
                  book.availableCopies > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleBorrow(book)}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      Borrow
                    </button>
                  ) : (
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-400">
                      Unavailable
                    </span>
                  )
                }
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
