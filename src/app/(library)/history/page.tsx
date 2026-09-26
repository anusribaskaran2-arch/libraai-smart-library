"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { useLibrary } from "@/lib/use-library";
import { formatDate, daysUntil } from "@/lib/format";

const STUDENT_ID = "local-student";

type Filter = "all" | "active" | "returned" | "overdue";

export default function HistoryPage() {
  const { records, returnBook } = useLibrary();
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const mine = records.filter((r) => r.studentId === STUDENT_ID);

  const filtered = mine.filter((r) => {
    if (filter === "all") return true;
    if (filter === "active") return !r.returnedAt && r.status !== "overdue";
    if (filter === "overdue") return !r.returnedAt && r.status === "overdue";
    return Boolean(r.returnedAt);
  });

  function handleReturn(bookId: string, title: string) {
    try {
      returnBook(bookId, STUDENT_ID);
      setNotice({ ok: true, text: `Returned "${title}". It is available again in the catalog.` });
    } catch (err) {
      setNotice({ ok: false, text: err instanceof Error ? err.message : "Return failed." });
    }
  }

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime()
  );

  return (
    <>
      <PageHeader title="Borrowing history" description="Your active, returned and overdue records." />

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

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "active", "returned", "overdue"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "rounded-full bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white"
                : "rounded-full border border-border-subtle bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            }
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<EmptyIcon kind="clock" />}
          title="No records here"
          description="Borrow a book from the catalog — records with borrowed date, due date and status appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-4 py-3 font-semibold">Book</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Borrowed</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Due date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {sorted.map((r) => {
                  const overdue = r.status === "overdue";
                  const dueDays = daysUntil(r.dueAt);
                  return (
                    <tr key={r.id} className={overdue ? "bg-red-50/50" : undefined}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{r.bookTitle}</p>
                        <p className="text-xs text-slate-500">{r.bookAuthor}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(r.borrowedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(r.dueAt)}
                        {!r.returnedAt && (
                          <span
                            className={
                              overdue
                                ? "ml-1 text-xs font-medium text-red-600"
                                : "ml-1 text-xs text-slate-400"
                            }
                          >
                            ({overdue ? `${Math.abs(dueDays)}d overdue` : dueDays <= 0 ? "today" : `in ${dueDays}d`})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        {!r.returnedAt ? (
                          <button
                            type="button"
                            onClick={() => handleReturn(r.bookId, r.bookTitle)}
                            className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
                          >
                            Return
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Returned {formatDate(r.returnedAt)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
