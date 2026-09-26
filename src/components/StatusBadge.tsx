import type { AvailabilityStatus, BorrowStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: AvailabilityStatus | BorrowStatus;
};

/** Visual style per status. Kept declarative so later phases can add
 * statuses (e.g. "reserved") without touching call sites. */
const styles: Record<StatusBadgeProps["status"], { label: string; className: string }> = {
  available: { label: "Available", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  borrowed: { label: "Borrowed", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  unavailable: { label: "Unavailable", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  active: { label: "Active", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  "due-soon": { label: "Due soon", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  overdue: { label: "Overdue", className: "bg-red-50 text-red-700 ring-red-600/20" },
  returned: { label: "Returned", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
};

/** Small pill used in the catalog and history to show record state. */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
