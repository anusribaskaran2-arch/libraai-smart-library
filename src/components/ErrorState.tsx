"use client";

import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  /** Renders a retry button when provided. */
  onRetry?: () => void;
};

/** Shown when a page section fails to load real data. */
export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this section. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
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
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4 M12 16h.01" />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-red-900">{title}</p>
        {message && <p className="mx-auto max-w-sm text-sm text-red-700">{message}</p>}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/** Named export for pages that compose a custom error CTA, e.g. a link. */
export function ErrorStateWithAction({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      {children}
    </div>
  );
}
