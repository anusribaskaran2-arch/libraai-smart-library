import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col items-center text-center">
            {/* LibraAI branding */}
            <span
              className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M10 8.5 13.5 12 10 15.5" />
              </svg>
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-slate-900">
              Log in to LibraAI
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Smart Library Management, powered by AI
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Access is role-based: students and librarians sign in with their college account.
          Authentication will be connected in the next phase.
        </p>
      </div>
    </main>
  );
}
