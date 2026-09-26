"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import DashboardStatCard from "@/components/DashboardStatCard";
import StatusBadge from "@/components/StatusBadge";
import { useLibrary } from "@/lib/use-library";
import { formatDate, daysUntil } from "@/lib/format";

export default function AdminPage() {
  const { books, records } = useLibrary();

  const activeLoans = records.filter((r) => !r.returnedAt);
  const overdue = activeLoans.filter((r) => r.status === "overdue");
  const availableBooks = books.filter((b) => b.availableCopies > 0).length;
  const borrowedCount = activeLoans.length;

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Collection health, borrowing activity and inventory at a glance."
      />

      {/* Live statistics */}
      <section aria-label="Library statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Total books" value={books.length} tone="primary" />
        <DashboardStatCard label="Available books" value={availableBooks} tone="emerald" />
        <DashboardStatCard label="Currently borrowed" value={borrowedCount} tone="blue" />
        <DashboardStatCard label="Currently overdue" value={overdue.length} tone="red" />
      </section>

      {/* Book management table */}
      <section aria-label="Book management" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Book management</h2>
          <Link href="/admin/books" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Manage books →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-4 py-3 font-semibold">Book</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Genre · Level</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Copies / Availability</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {books.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{b.title}</p>
                      <p className="text-xs text-slate-500">{b.author}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {b.genre} · {b.level}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {b.availableCopies} of {b.totalCopies} available
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.availableCopies > 0 ? "available" : "unavailable"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Borrowing records */}
      <section aria-label="Borrowing records" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent borrowing records</h2>
          <Link href="/admin/records" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            All records →
          </Link>
        </div>
        {records.length === 0 ? (
          <p className="text-sm text-slate-500">No borrowing records yet.</p>
        ) : (
          <div className="space-y-2">
            {[...records]                .sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime())
              .slice(0, 5)
              .map((r) => {
                const isOverdue = r.status === "overdue" && !r.returnedAt;
                return (
                  <div
                    key={r.id}
                    className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border bg-white p-4 shadow-sm ${
                      isOverdue ? "border-red-200" : "border-border-subtle"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{r.bookTitle}</p>
                      <p className="truncate text-xs text-slate-500">
                        Borrowed {formatDate(r.borrowedAt)} · Due {formatDate(r.dueAt)}
                        {!r.returnedAt && (
                          <span className={isOverdue ? "ml-1 font-medium text-red-600" : "ml-1 text-slate-400"}>
                            ({isOverdue ? `${Math.abs(daysUntil(r.dueAt))}d overdue` : `in ${daysUntil(r.dueAt)}d`})
                          </span>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* Overdue alert section */}
      <section aria-label="Overdue" className="mt-8 pb-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-slate-900">Overdue attention</h2>
        {overdue.length === 0 ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            No overdue books — all loans are on time. 🎉
          </p>
        ) : (
          <div className="space-y-2">
            {overdue.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4">
                <div>
                  <p className="font-medium text-red-900">{r.bookTitle}</p>
                  <p className="text-xs text-red-700">
                    {Math.abs(daysUntil(r.dueAt))} day{Math.abs(daysUntil(r.dueAt)) === 1 ? "" : "s"} overdue · due {formatDate(r.dueAt)}
                  </p>
                </div>
                <StatusBadge status="overdue" />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
