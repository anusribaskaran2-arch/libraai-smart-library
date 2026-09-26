import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional SVG icon drawn inline to avoid an icon-library dependency. */
  icon?: ReactNode;
  /** Optional call-to-action, e.g. a link or button. */
  action?: ReactNode;
  /** Tighter padding for card-sized sections. */
  compact?: boolean;
};

/** Shown where real data will appear after the database is connected. */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-white text-center ${
        compact ? "gap-2 px-6 py-10" : "gap-3 px-6 py-16"
      }`}
    >
      {icon && (
        <div
          className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-medium text-slate-900">{title}</p>
        {description && <p className="mx-auto max-w-sm text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

const paths = {
  book: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
  clock: "M12 7v5l4 2 M3.05 13A9 9 0 1 0 6 5.3L3 8",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.35-4.35",
  box: "M21 8v13H3V8 M1 3h22v5H1z M10 12h4",
  alert:
    "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  sparkles: "M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.2 2.2 M16.2 16.2l2.1 2.1 M18.4 5.6l-2.2 2.2 M7.8 16.2l-2.1 2.1",
} as const;

export function EmptyIcon({ kind }: { kind: keyof typeof paths }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
      aria-hidden="true"
    >
      <path d={paths[kind]} />
    </svg>
  );
}
