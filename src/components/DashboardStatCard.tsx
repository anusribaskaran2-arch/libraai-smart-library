import type { ReactNode } from "react";

type DashboardStatCardProps = {
  /** Metric name, e.g. "Books borrowed". */
  label: string;
  /** Statistic value. Undefined renders a loading placeholder instead of a
   * fake number — real values come from Supabase in later phases. */
  value?: number | string;
  /** Small colored icon bubble. */
  icon?: ReactNode;
  /** Optional accent for the icon bubble background. */
  tone?: "primary" | "blue" | "amber" | "red" | "emerald";
};

const toneClasses = {
  primary: "bg-primary-50 text-primary-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  emerald: "bg-emerald-50 text-emerald-600",
} as const;

/** Summary statistic card used on the student and admin dashboards. */
export default function DashboardStatCard({
  label,
  value,
  icon,
  tone = "primary",
}: DashboardStatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      {icon && (
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        {value === undefined ? (
          <p className="mt-0.5 text-sm text-slate-400" title="Waiting for database connection">
            —
          </p>
        ) : (
          <p className="font-display text-2xl font-semibold text-slate-900">{value}</p>
        )}
      </div>
    </div>
  );
}
