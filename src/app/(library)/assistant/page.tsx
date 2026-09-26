"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import PageHeader from "@/components/PageHeader";
import BookCard from "@/components/BookCard";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import StatusBadge from "@/components/StatusBadge";
import { useLibrary } from "@/lib/use-library";
import {
  toAiBooks,
  type AiBook,
  type AiHistoryItem,
  type AiRecommendation,
  type AiRecommendResponse,
  type AiSearchResponse,
  type AiSource,
} from "@/lib/ai";

const STUDENT_ID = "local-student";

const EXAMPLES = [
  "Beginner Python books",
  "Available books about databases",
  "Advanced AI and machine learning",
];

/** Small pill showing whether the model or keyword search answered. */
function SourceBadge({ source }: { source: AiSource }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        source === "groq"
          ? "bg-primary-50 text-primary-700 ring-primary-600/20"
          : "bg-slate-100 text-slate-600 ring-slate-500/20"
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {source === "groq" ? "AI search" : "Keyword search"}
    </span>
  );
}

export default function AssistantPage() {
  const { books, records, borrow } = useLibrary();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<AiSearchResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const [recs, setRecs] = useState<AiRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [recsInterpretation, setRecsInterpretation] = useState("");

  const aiBooks = useMemo(() => toAiBooks(books), [books]);

  /** Past loans act as taste signals for recommendations. */
  const history: AiHistoryItem[] = useMemo(
    () =>
      records
        .filter((r) => r.studentId === STUDENT_ID)
        .map((r) => ({
          title: r.bookTitle,
          genre: books.find((b) => b.id === r.bookId)?.genre,
        })),
    [records, books]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      setRecsLoading(true);
      try {
        const res = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ books: aiBooks, history, limit: 3 }),
        });
        if (!res.ok) throw new Error("Recommendations request failed.");
        const data = (await res.json()) as AiRecommendResponse;
        if (cancelled) return;
        setRecs(data.recommendations);
        setRecsInterpretation(data.interpretation);
      } catch {
        if (!cancelled) setRecs([]);
      } finally {
        if (!cancelled) setRecsLoading(false);
      }
    }

    void loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, [aiBooks, history]);

  const runSearch = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      setSearching(true);
      setSearchError(null);
      setResult(null);

      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed, books: aiBooks }),
        });
        const data = (await res.json()) as AiSearchResponse & {
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Search failed.");
        setResult(data);
      } catch (err) {
        setSearchError(
          err instanceof Error ? err.message : "Search failed. Please retry."
        );
      } finally {
        setSearching(false);
      }
    },
    [aiBooks]
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void runSearch(query);
  }

  function handleBorrow(book: AiBook) {
    try {
      borrow(book.id, STUDENT_ID);
      setNotice({
        ok: true,
        text: `Borrowed "${book.title}" — due in 14 days. See History.`,
      });
    } catch (err) {
      setNotice({
        ok: false,
        text: err instanceof Error ? err.message : "Borrow failed.",
      });
    }
  }

  return (
    <>
      <PageHeader
        title="Ask LibraAI ✨"
        description="Describe what you're looking for in plain language. Results are matched against the real catalog."
      />

      {/* Search form */}
      <section aria-label="AI search" className="space-y-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. An easy book to start learning Python"
            aria-label="Ask LibraAI"
            className="w-full rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="shrink-0 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuery(ex);
                void runSearch(ex);
              }}
              className="rounded-full border border-border-subtle bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className={
            notice.ok
              ? "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {notice.text}
        </div>
      )}

      {/* Search results */}
      <section aria-label="Search results" className="mt-6">
        {searching && <LoadingState label="Asking LibraAI…" />}

        {!searching && searchError && (
          <ErrorState
            title="Search failed"
            message={searchError}
            onRetry={() => void runSearch(query)}
          />
        )}

        {!searching && !searchError && !result && (
          <EmptyState
            icon={<EmptyIcon kind="sparkles" />}
            title="Ask a question to get started"
            description="LibraAI understands natural language like “available books on networking” and only returns titles that exist in the catalog."
          />
        )}

        {!searching && !searchError && result && (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Results
              </h2>
              <SourceBadge source={result.source} />
              <span className="text-xs text-slate-400">
                {result.interpretation}
              </span>
            </div>

            {result.books.length === 0 ? (
              <EmptyState
                compact
                icon={<EmptyIcon kind="search" />}
                title="No matching books"
                description="Nothing in the catalog matches that request. Try different wording or browse the catalog."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.books.map((book) => (
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
          </>
        )}
      </section>

      {/* Recommendations */}
      <section aria-label="Recommended for you" className="mt-10 pb-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-slate-900">
          Recommended for you
        </h2>
        {recsLoading ? (
          <LoadingState label="Finding suggestions…" />
        ) : recs.length === 0 ? (
          <EmptyState
            compact
            icon={<EmptyIcon kind="book" />}
            title="No suggestions right now"
            description="Borrow a book and personalized recommendations will appear here."
          />
        ) : (
          <>
            {recsInterpretation && (
              <p className="mb-3 text-xs text-slate-400">
                {recsInterpretation}
              </p>
            )}
            <div className="space-y-2">
              {recs.map((rec) => {
                const book = books.find((b) => b.id === rec.id);
                if (!book) return null;
                return (
                  <div
                    key={rec.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border-subtle bg-white p-4 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {book.title}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {book.author} · {book.genre}
                      </p>
                      <p className="mt-1 text-xs text-primary-700">{rec.reason}</p>
                    </div>
                    <StatusBadge
                      status={book.availableCopies > 0 ? "available" : "unavailable"}
                    />
                    {book.availableCopies > 0 && (
                      <button
                        type="button"
                        onClick={() => handleBorrow(book)}
                        className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                      >
                        Borrow
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
}
