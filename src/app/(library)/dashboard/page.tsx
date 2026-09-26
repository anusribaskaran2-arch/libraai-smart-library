"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import DashboardStatCard from "@/components/DashboardStatCard";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { useLibrary } from "@/lib/use-library";
import { formatDate, daysUntil } from "@/lib/format";

const STUDENT_ID = "local-student";

export default function DashboardPage() {
  const { books, records } = useLibrary();

  const myRecords = records.filter((r) => r.studentId === STUDENT_ID);
  const activeLoans = myRecords.filter((r) => !r.returnedAt);
  const borrowedCount = activeLoans.filter((r) => r.status !== "overdue").length;
  const overdueCount = activeLoans.filter((r) => r.status === "overdue").length;
  const availableBooks = books.filter((b) => b.availableCopies > 0).length;

  const recent = [...myRecords]
    .sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime())
    .slice(0, 4);

  const availableNow = books.filter((b) => b.availableCopies > 0).slice(0, 4);

  return (
    <>
      <PageHeader
        title="Welcome back 👋"
        description="Here's an overview of your library activity."
      />

      {/* Summary — computed live from the library state */}
      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Total books" value={books.length} tone="primary" />
        <DashboardStatCard label="Available books" value={availableBooks} tone="emerald" />
        <DashboardStatCard label="Borrowed by me" value={borrowedCount} tone="blue" />
        <DashboardStatCard label="Overdue" value={overdueCount} tone="red" />
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions" className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-slate-900">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/catalog" className="rounded-xl border border-border-subtle bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50/50">
            Browse the catalog →
          </Link>
          <Link href="/history" className="rounded-xl border border-border-subtle bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50/50">
            View borrowing history →
          </Link>
          <Link href="/assistant" className="rounded-xl border border-primary-200 bg-primary-50/60 p-4 text-sm font-medium text-primary-700 shadow-sm transition-colors hover:bg-primary-50">
            ✨ Ask LibraAI →
          </Link>
        </div>
      </section>

      {/* Recent borrowing — real records with statuses */}
      <section aria-label="Recent borrowing" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent borrowing</h2>
          <Link href="/history" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            compact
            icon={<EmptyIcon kind="clock" />}
            title="No borrowing activity yet"
            description="Borrow a book from the catalog and it will appear here."
          />
        ) : (
          <div className="space-y-2">
            {recent.map((r) => {
              const overdue = r.status === "overdue";
              const dueDays = daysUntil(r.dueAt);
              return (
                <div
                  key={r.id}
                  className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border bg-white p-4 shadow-sm ${
                    overdue ? "border-red-200" : "border-border-subtle"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{r.bookTitle}</p>
                    <p className="truncate text-sm text-slate-500">{r.bookAuthor}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    Due {formatDate(r.dueAt)}
                    {!r.returnedAt && (
                      <span className={overdue ? "ml-1 font-medium text-red-600" : "ml-1 text-slate-400"}>
                        ({overdue ? `${Math.abs(dueDays)}d overdue` : dueDays <= 0 ? "due today" : `in ${dueDays}d`})
                      </span>
                    )}
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Available now */}
      <section aria-label="Available now" className="mt-8 pb-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-slate-900">Available now</h2>
        {availableNow.length === 0 ? (
          <EmptyState compact icon={<EmptyIcon kind="book" />} title="Nothing on the shelf" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {availableNow.map((b) => (
              <Link
                key={b.id}
                href={`/catalog?book=${b.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-white p-4 shadow-sm transition-colors hover:border-primary-300"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{b.title}</p>
                  <p className="truncate text-sm text-slate-500">
                    {b.author} · {b.genre}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {b.availableCopies} available
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
