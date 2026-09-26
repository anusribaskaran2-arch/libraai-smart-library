import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Borrowing Records — Admin",
};

const columns = ["Student", "Book", "Borrowed", "Due date", "Status", "Action"];

export default function AdminRecordsPage() {
  return (
    <>
      <PageHeader
        title="Borrowing records"
        description="All student borrowing activity across the library."
      />

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                {columns.map((col) => (
                  <th key={col} scope="col" className="px-4 py-3 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="p-4 sm:p-6">
          <EmptyState
            compact
            icon={<EmptyIcon kind="clock" />}
            title="No records yet"
            description="Borrowing records appear here as students borrow and return books."
          />
        </div>
      </div>
    </>
  );
}
