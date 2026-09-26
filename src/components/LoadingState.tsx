type LoadingStateProps = {
  /** Short message shown under the spinner. */
  label?: string;
};

/** Full-area loading placeholder for page sections. */
export default function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-white px-6 py-16 text-center"
    >
      <span
        className="size-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

/** Skeleton block used while real data loads. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-slate-200/70 ${className}`} />;
}
