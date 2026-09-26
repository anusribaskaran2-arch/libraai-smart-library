import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { AvailabilityStatus, Book } from "@/lib/types";

type BookCardProps = {
  book: Book;
  /** Hides the borrow button where borrowing is not yet possible. */
  borrowAction?: React.ReactNode;
};

/** Deterministic pastel gradient for the cover placeholder, derived from the
 * book id so the catalog looks varied once real data arrives. */
const coverGradients = [
  "from-primary-100 to-primary-200",
  "from-emerald-100 to-emerald-200",
  "from-amber-100 to-amber-200",
  "from-rose-100 to-rose-200",
  "from-sky-100 to-sky-200",
  "from-violet-100 to-violet-200",
];

function coverGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return coverGradients[hash % coverGradients.length];
}

/** Catalog card. In Phase 1 it renders from typed data only — pages pass no
 * books yet, so this component is exercised by later phases. */
export default function BookCard({ book, borrowAction }: BookCardProps) {
  const availability: AvailabilityStatus =
    book.availableCopies > 0 ? "available" : "unavailable";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Cover placeholder until cover images exist in the schema */}
      <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${coverGradient(book.id)} px-4`}>
        <span className="font-display text-sm font-semibold text-slate-700 line-clamp-2 text-center">
          {book.title}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-medium text-slate-900">{book.title}</h3>
            <p className="truncate text-sm text-slate-500">{book.author}</p>
          </div>
          <StatusBadge status={availability} />
        </div>

        <p className="text-xs text-slate-500">
          {book.genre} · {book.level} · Shelf {book.shelfLocation}
        </p>

        <p className="text-xs font-medium text-slate-600">
          {book.availableCopies} of {book.totalCopies} copies available
        </p>

        {/* Details are part of the catalog phase; keep the card focused for now. */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Link
            href={`/catalog/${book.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View details
          </Link>
          {borrowAction}
        </div>
        {borrowAction === undefined && (
          <p className="text-[11px] text-slate-400">Borrowing opens after the database is connected.</p>
        )}
      </div>
    </article>
  );
}
